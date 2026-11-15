import mongoose from "mongoose";

const wasteSubmissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    wasteType: {
      type: String,
      required: true,
      trim: true,
    },

    // Final material selected or confirmed by the collector.
    materialCategory: {
      type: String,
      default: null,
    },

    // AI output is stored separately and is never treated as human confirmation.
    aiMaterialPrediction: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    weightKg: {
      type: Number,
      required: true,
      min: 0.1,
    },
    imageUrl: String,

    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    pointsAwarded: {
      type: Number,
      default: 0,
    },
    verifiedAt: {
      type: Date,
      default: null,
    },

    // Only explicitly collector-confirmed brands belong in brandName.
    brandName: {
      type: String,
      default: null,
    },
    brandSource: {
      type: String,
      enum: ["collector-confirmed", "ai-predicted", "unknown"],
      default: "unknown",
    },
    brandConfidence: {
      type: Number,
      default: null,
      min: 0,
      max: 1,
    },
    aiBrandPrediction: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("WasteSubmission", wasteSubmissionSchema);
