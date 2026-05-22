import mongoose from "mongoose";

const collectorApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fullName: { type: String, required: true, trim: true, minlength: 2 },
    phone: { type: String, required: true, trim: true },
    county: { type: String, required: true, trim: true },
    collectionPointName: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    nationalId: { type: String, required: true, trim: true, select: false },
    documentUrl: { type: String, trim: true },
    reason: { type: String, required: true, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    moderationNotes: { type: String, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

collectorApplicationSchema.index(
  { userId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ["pending", "approved"] } },
  }
);

export default mongoose.model("CollectorApplication", collectorApplicationSchema);
