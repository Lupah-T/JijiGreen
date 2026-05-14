import Leaderboard from "../models/Leaderboard.js";
import User from "../models/User.js";

export const refreshLeaderboard = async () => {
  const users = await User.find({ role: "student" }).sort({ ecoPoints: -1 });

  await Promise.all(
    users.map((user, index) =>
      Leaderboard.findOneAndUpdate(
        { user: user._id },
        { user: user._id, school: user.school, points: user.ecoPoints, rank: index + 1 },
        { upsert: true, new: true }
      )
    )
  );

  return Leaderboard.find().populate("user", "name ecoPoints").sort({ rank: 1 });
};
