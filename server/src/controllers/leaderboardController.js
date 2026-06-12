import Leaderboard from "../models/Leaderboard.js";
import { refreshLeaderboard } from "../services/leaderboardEngine.js";

export const getLeaderboard = async (_req, res) => {
  const leaderboard = await Leaderboard.find()
    .populate("user", "name ecoPoints role")
    .populate("school", "name")
    .sort({ rank: 1 })
    .limit(50);
  res.json(leaderboard);
};

export const rebuildLeaderboard = async (_req, res) => {
  res.json(await refreshLeaderboard());
};
