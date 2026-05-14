import mongoose from "mongoose";

const wasteSubmissionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    collector: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    wasteType: { type: String, required: true },
    weightKg: { type: Number, required: true },
    imageUrl: String,
    status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
    pointsAwarded: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("WasteSubmission", wasteSubmissionSchema);
