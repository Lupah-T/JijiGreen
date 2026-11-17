import User from "../models/User.js";
import Voucher from "../models/Voucher.js";
import { listRewardsFor, progressFor, redeemReward, issueMilestoneRewards, lifetimeOf } from "../services/rewardEngine.js";
import { MILESTONE_POINTS } from "../config/rewardConfig.js";

// Rewards the signed-in user is allowed to see. Admins/staff (and signed-out visitors) get everything.
export const listRewards = async (req, res, next) => {
  try {
    const viewer = req.user && ["student", "collector"].includes(req.user.role)
      ? await User.findById(req.user._id).select("ageGroup")
      : null;
    res.json(await listRewardsFor(viewer));
  } catch (error) {
    next(error);
  }
};

export const redeem = async (req, res, next) => {
  try {
    const result = await redeemReward(req.user._id, req.params.id);
    res.status(201).json({ success: true, message: `Redeemed ${result.reward.title}`, ...result.voucher.toObject(), ecoPoints: result.ecoPoints, lifetimePoints: result.lifetimePoints });
  } catch (error) {
    next(error);
  }
};

// Points progress + the awards/vouchers this user already holds
export const myRewards = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Catch users who crossed 500 before this feature existed
    if (lifetimeOf(user) >= MILESTONE_POINTS && !user.milestoneAwardedAt) {
      user.lifetimePoints = lifetimeOf(user);
      await issueMilestoneRewards(user);
      user.milestoneAwardedAt = user.milestoneAwardedAt || new Date();
    }

    const vouchers = await Voucher.find({ user: user._id }).populate("reward").sort({ createdAt: -1 });
    res.json({ success: true, data: { progress: progressFor(await User.findById(user._id)), vouchers, user: { name: user.name } } });
  } catch (error) {
    next(error);
  }
};
