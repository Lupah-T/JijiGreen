import Reward from "../models/Reward.js";
import { redeemReward } from "../services/rewardEngine.js";

export const listRewards = async (_req, res) => {
  res.json(await Reward.find({ active: true }).sort({ pointsCost: 1 }));
};

export const redeem = async (req, res) => {
  const voucher = await redeemReward(req.user, req.params.id);
  res.status(201).json(voucher);
};
