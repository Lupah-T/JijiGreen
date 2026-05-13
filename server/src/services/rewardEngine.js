import Reward from "../models/Reward.js";
import Voucher from "../models/Voucher.js";

export const redeemReward = async (user, rewardId) => {
  const reward = await Reward.findById(rewardId);

  if (!reward || !reward.active) {
    throw new Error("Reward is not available");
  }

  if (reward.stock <= 0) {
    throw new Error("Reward is out of stock");
  }

  if (user.ecoPoints < reward.pointsCost) {
    throw new Error("Insufficient eco points");
  }

  user.ecoPoints -= reward.pointsCost;
  reward.stock -= 1;

  const voucher = await Voucher.create({
    user: user._id,
    reward: reward._id,
    code: `JG-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  });

  await Promise.all([user.save(), reward.save()]);
  return voucher;
};
