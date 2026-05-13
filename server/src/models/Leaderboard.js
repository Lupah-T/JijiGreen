import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    points: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Leaderboard", leaderboardSchema);
