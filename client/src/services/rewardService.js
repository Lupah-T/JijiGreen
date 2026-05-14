import { getRewards, redeemReward } from "../api/rewardsApi.js";

export const rewardService = {
  list: async () => (await getRewards()).data,
  redeem: async (id) => (await redeemReward(id)).data,
};
