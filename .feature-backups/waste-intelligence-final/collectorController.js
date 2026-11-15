import WasteSubmission from "../models/WasteSubmission.js";
import User from "../models/User.js";
import CollectorApplication from "../models/CollectorApplication.js";
import { calculateEcoPoints } from "../utils/calculations.js";
import { writeAuditLog } from "../services/auditService.js";

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

export const applyToBecomeCollector = async (req, res) => {
  const existingApplication = await CollectorApplication.findOne({
    userId: req.user._id,
    status: { $in: ["pending", "approved"] },
  });

  if (existingApplication) {
    return res.status(409).json({
      message: existingApplication.status === "pending"
        ? "You already have a pending collector application"
        : "You are already approved as a collector",
    });
  }

  const application = await CollectorApplication.create({
    userId: req.user._id,
    fullName: req.body.fullName,
    phone: req.body.phone,
    county: req.body.county,
    collectionPointName: req.body.collectionPointName,
    location: req.body.location,
    nationalId: req.body.nationalId,
    documentUrl: req.body.documentUrl,
    reason: req.body.reason,
  });

  await writeAuditLog({
    action: "collector_application",
    performedBy: req.user._id,
    targetUser: req.user._id,
    previousRole: req.user.role,
    newRole: req.user.role,
    metadata: {
      applicationId: application._id,
      county: application.county,
      collectionPointName: application.collectionPointName,
    },
  });

  res.status(201).json({
    success: true,
    message: "Collector application submitted",
    data: application,
  });
};

export const getMyCollectorApplication = async (req, res) => {
  const application = await CollectorApplication.findOne({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .select("-nationalId");

  res.json({ success: true, data: application });
};
