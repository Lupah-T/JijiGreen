import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    county: { type: String, required: true },
    totalPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("School", schoolSchema);
