import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { jwtConfig } from "../config/jwt.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, jwtConfig.secret);
    const user = await User.findById(decoded.id).select("_id role isActive name email school ecoPoints phone bio avatarUrl");

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User account is inactive or no longer exists" });
    }

    req.user = {
      id: user._id.toString(),
      _id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      school: user.school || null,
      ecoPoints: user.ecoPoints || 0,
      phone: user.phone || "",
      bio: user.bio || "",
      avatarUrl: user.avatarUrl || "",
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
};

// Same as protect, but never blocks: used by public endpoints that personalise their response.
export const optionalProtect = async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return next();

  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], jwtConfig.secret);
    const user = await User.findById(decoded.id).select("_id role isActive");
    if (user?.isActive) req.user = { id: user._id.toString(), _id: user._id, role: user.role };
  } catch {
    // ignore bad tokens - the visitor is treated as signed out
  }
  next();
};
