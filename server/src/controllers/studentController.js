import WasteSubmission from "../models/WasteSubmission.js";
import User from "../models/User.js";

export const getStudentDashboard = async (req, res) => {
  const submissions = await WasteSubmission.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.json({ user: req.user, submissions });
};

export const getStudentHistory = async (req, res) => {
  const history = await WasteSubmission.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.json(history);
};

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({ success: true, data: user });
};

export const updateProfile = async (req, res) => {
  const { name, phone, bio, avatarUrl } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, bio, avatarUrl },
    { new: true, runValidators: true }
  ).select("-password");
  res.json({ success: true, message: "Profile updated", data: user });
};
