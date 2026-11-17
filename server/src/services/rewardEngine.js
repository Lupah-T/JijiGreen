import Reward from "../models/Reward.js";
import User from "../models/User.js";
import Voucher from "../models/Voucher.js";
import { CHILD_MIN_REDEEM_POINTS, DEFAULT_REWARDS, MILESTONE_POINTS } from "../config/rewardConfig.js";

const httpError = (statusCode, message) => Object.assign(new Error(message), { statusCode });

const newCode = (prefix = "JG") =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

/** Total points a user has ever earned. Older accounts may not have lifetimePoints yet. */
export const lifetimeOf = (user) => Math.max(Number(user.lifetimePoints || 0), Number(user.ecoPoints || 0));

/** Seed the default catalogue the first time (idempotent). */
export const seedDefaultRewards = async () => {
  if ((await Reward.estimatedDocumentCount()) > 0) return false;
  await Reward.insertMany(DEFAULT_REWARDS);
  console.log(`[rewards] Seeded ${DEFAULT_REWARDS.length} default rewards`);
  return true;
};

/** Rewards visible to a given user: matching age group + the milestone rewards. */
export const listRewardsFor = async (user) => {
  const filter = { active: true };
  if (user?.ageGroup) filter.audience = { $in: [user.ageGroup, "all"] };
  const rewards = await Reward.find(filter).sort({ kind: 1, pointsCost: 1 });
  return rewards;
};

/** Spend points on a standard reward. */
export const redeemReward = async (userId, rewardId) => {
  const [user, reward] = await Promise.all([User.findById(userId), Reward.findById(rewardId)]);

  if (!user) throw httpError(404, "User not found");
  if (!reward || !reward.active) throw httpError(404, "Reward is not available");
  if (reward.kind === "milestone") {
    throw httpError(400, `This award is given automatically when you reach ${reward.milestoneAt} total points`);
  }
  if (reward.audience !== "all" && reward.audience !== user.ageGroup) {
    throw httpError(403, reward.audience === "child" ? "This reward is for children under 16" : "This reward is for users aged 16 and above");
  }

  const cost = Math.max(reward.pointsCost, reward.audience === "child" ? CHILD_MIN_REDEEM_POINTS : 0);
  if (user.ecoPoints < cost) throw httpError(400, `You need ${cost - user.ecoPoints} more points for this reward`);

  // Atomic stock + balance updates so two quick clicks cannot overspend
  const stocked = await Reward.findOneAndUpdate({ _id: reward._id, stock: { $gt: 0 } }, { $inc: { stock: -1 } }, { new: true });
  if (!stocked) throw httpError(400, "Reward is out of stock");

  const charged = await User.findOneAndUpdate({ _id: user._id, ecoPoints: { $gte: cost } }, { $inc: { ecoPoints: -cost } }, { new: true });
  if (!charged) {
    await Reward.updateOne({ _id: reward._id }, { $inc: { stock: 1 } });
    throw httpError(400, "Insufficient eco points");
  }

  const voucher = await Voucher.create({ user: user._id, reward: reward._id, code: newCode() });
  return { voucher, reward: stocked, ecoPoints: charged.ecoPoints, lifetimePoints: lifetimeOf(charged) };
};

/** Add earned points and, if the user has just crossed 500 lifetime points, issue the grand awards. */
export const awardPoints = async (userId, points) => {
  if (!points || points <= 0) return { user: await User.findById(userId), milestoneIssued: false };

  const user = await User.findById(userId);
  if (!user) return { user: null, milestoneIssued: false };

  const before = lifetimeOf(user);
  user.ecoPoints += points;
  user.lifetimePoints = before + points;
  await user.save({ validateBeforeSave: false });

  let milestoneIssued = false;
  if (user.lifetimePoints >= MILESTONE_POINTS && !user.milestoneAwardedAt) {
    milestoneIssued = await issueMilestoneRewards(user);
  }
  return { user, milestoneIssued };
};

export const issueMilestoneRewards = async (user) => {
  // Mark first so a parallel verification cannot issue the awards twice
  const claimed = await User.findOneAndUpdate(
    { _id: user._id, milestoneAwardedAt: { $exists: false } },
    { $set: { milestoneAwardedAt: new Date() } }
  );
  if (!claimed) return false;

  const rewards = await Reward.find({ kind: "milestone", active: true, milestoneAt: { $lte: user.lifetimePoints } });
  await Voucher.insertMany(rewards.map((r) => ({ user: user._id, reward: r._id, code: newCode("JG-GRAND") })));
  return rewards.length > 0;
};

/** Everything the Rewards page needs about a user's progress. */
export const progressFor = (user) => ({
  ageGroup: user.ageGroup,
  ecoPoints: user.ecoPoints,
  lifetimePoints: lifetimeOf(user),
  milestonePoints: MILESTONE_POINTS,
  milestoneReached: Boolean(user.milestoneAwardedAt) || lifetimeOf(user) >= MILESTONE_POINTS,
  childMinRedeemPoints: CHILD_MIN_REDEEM_POINTS,
});
