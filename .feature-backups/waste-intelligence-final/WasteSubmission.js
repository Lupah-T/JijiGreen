import mongoose from "mongoose";

const wasteSubmissionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collector: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    wasteType: { type: String, required: true },
    materialCategory: { type: String, default: null },
    weightKg: { type: Number, required: true },
    imageUrl: String,
    status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
    pointsAwarded: { type: Number, default: 0 },
    brandName: { type: String, default: null },
    brandSource: { type: String, enum: ["collector-confirmed", "ai-predicted", "unknown"], default: "unknown" },
    brandConfidence: { type: Number, default: null, min: 0, max: 1 },
    aiBrandPrediction: { type: Object, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("WasteSubmission", wasteSubmissionSchema);
