import WasteSubmission from "../models/WasteSubmission.js";

export const getStudentDashboard = async (req, res) => {
  const submissions = await WasteSubmission.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.json({ user: req.user, submissions });
};

export const getStudentHistory = async (req, res) => {
  const history = await WasteSubmission.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.json(history);
};
