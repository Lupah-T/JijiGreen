import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
      validate: {
        validator(value) {
          return /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value);
        },
        message: "Password must include uppercase, lowercase, and number",
      },
    },
    role: {
      type: String,
      enum: ["student", "collector", "school_admin", "operations_admin", "super_admin"],
      default: "student",
      index: true,
    },
    isActive: { type: Boolean, default: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },
    ecoPoints: { type: Number, default: 0 },
    phone:     { type: String, trim: true },
    bio:       { type: String, maxlength: [300, "Bio max 300 characters"] },
    avatarUrl: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
