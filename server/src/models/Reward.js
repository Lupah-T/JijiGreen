import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    pointsCost: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    // Who can see / redeem this reward
    audience: { type: String, enum: ["child", "adult", "all"], default: "all", index: true },
    category: { type: String, default: "General" },
    emoji: { type: String, default: "🎁" },
    // "standard" rewards are bought with points. "milestone" rewards are awarded automatically
    // once a user's lifetime points reach milestoneAt (no points are spent).
    kind: { type: String, enum: ["standard", "milestone"], default: "standard" },
    milestoneAt: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Reward", rewardSchema);
