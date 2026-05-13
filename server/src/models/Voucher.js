import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reward: { type: mongoose.Schema.Types.ObjectId, ref: "Reward", required: true },
    redeemed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Voucher", voucherSchema);
