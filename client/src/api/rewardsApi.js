import { api } from "./authApi.js";

export const getRewards = () => api.get("/rewards");
export const redeemReward = (id) => api.post(`/rewards/${id}/redeem`);
export const getLeaderboard = () => api.get("/leaderboard");
