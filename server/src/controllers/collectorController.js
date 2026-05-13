import WasteSubmission from "../models/WasteSubmission.js";
import User from "../models/User.js";
import { calculateEcoPoints } from "../utils/calculations.js";

export const createWasteSubmission = async (req, res) => {
  const submission = await WasteSubmission.create({
    student: req.body.student,
    collector: req.user._id,
    wasteType: req.body.wasteType,
    weightKg: req.body.weightKg,
    imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
  });

  res.status(201).json(submission);
};

export const verifyWasteSubmission = async (req, res) => {
  const submission = await WasteSubmission.findById(req.params.id);

  if (!submission) {
    return res.status(404).json({ message: "Submission not found" });
  }

  submission.status = req.body.status || "verified";
  submission.pointsAwarded = submission.status === "verified" ? calculateEcoPoints(submission.weightKg) : 0;

  if (submission.status === "verified") {
    await User.findByIdAndUpdate(submission.student, { $inc: { ecoPoints: submission.pointsAwarded } });
  }

  await submission.save();
  res.json(submission);
};

export const getCollectionHistory = async (req, res) => {
  const submissions = await WasteSubmission.find({ collector: req.user._id }).sort({ createdAt: -1 });
  res.json(submissions);
};
