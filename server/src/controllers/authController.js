import User from "../models/User.js";
import crypto from "crypto";
import { generateToken } from "../utils/generateToken.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";
import { ageGroupForAge } from "../config/rewardConfig.js";
import { lifetimeOf } from "../services/rewardEngine.js";
import { sendPasswordResetEmail, sendPasswordChangedEmail } from "../utils/email.js";

// What the client is allowed to know about a user (never the password hash etc.)
const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  age: user.age,
  ageGroup: user.ageGroup,
  ecoPoints: user.ecoPoints || 0,
  lifetimePoints: lifetimeOf(user),
  phone: user.phone,
  bio: user.bio,
  avatarUrl: user.avatarUrl,
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password, age } = req.body;
    const existingUser = await User.exists({ email });

    if (existingUser) {
      return sendError(res, 409, "User already exists");
    }

    const user = await User.create({ name, email, password, role: "student", age, ageGroup: ageGroupForAge(age) });

    return sendSuccess(res, 201, "User registered successfully", {
      user: publicUser(user),
      token: generateToken({ id: user._id, role: user.role }),
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return sendError(res, 401, "Invalid credentials");
    }

    if (!user.isActive) {
      return sendError(res, 403, "Account is inactive");
    }

    return sendSuccess(res, 200, "Login successful", {
        user: publicUser(user),
        token: generateToken({ id: user._id, role: user.role }),
    });
  } catch (error) {
    return next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return sendError(res, 404, "User not found");
    return sendSuccess(res, 200, "Current user retrieved successfully", publicUser(user));
  } catch (error) {
    return next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return sendError(res, 404, "No account found for that email");

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashed;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    const resetLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetLink);

    return sendSuccess(res, 200, "Password reset email sent");
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpire: { $gt: Date.now() } }).select("+password");

    if (!user) return sendError(res, 400, "Invalid or expired token");

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await sendPasswordChangedEmail(user.email);

    return sendSuccess(res, 200, "Password reset successful");
  } catch (error) {
    return next(error);
  }
};
