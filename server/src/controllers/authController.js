import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.exists({ email });

    if (existingUser) {
      return sendError(res, 409, "User already exists");
    }

    const user = await User.create({ name, email, password, role: "student" });

    return sendSuccess(res, 201, "User registered successfully", {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
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
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken({ id: user._id, role: user.role }),
    });
  } catch (error) {
    return next(error);
  }
};

export const me = (req, res) => {
  sendSuccess(res, 200, "Current user retrieved successfully", req.user);
};
