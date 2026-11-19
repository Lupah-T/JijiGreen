import WasteSubmission from "../models/WasteSubmission.js";
import User from "../models/User.js";
import { buildStudentDashboardMetrics } from "../utils/calculations.js";
import CollectionPoint from "../models/CollectionPoint.js";

export const getStudentDashboard = async (req, res) => {
  const submissions = await WasteSubmission.find({ student: req.user._id }).sort({ createdAt: -1 });
  const user = await User.findById(req.user._id).select("-password");
  const metrics = buildStudentDashboardMetrics(user.toObject(), submissions);

  res.json({
    success: true,
    data: {
      user: {
        ...user.toObject(),
        ecoPoints: metrics.ecoPoints,
      },
      submissions,
      metrics,
    },
  });
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
  const allowedFields = ["name", "phone", "bio", "avatarUrl"];
  const updates = allowedFields.reduce((acc, field) => {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      acc[field] = req.body[field];
    }
    return acc;
  }, {});

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  ).select("-password");
  res.json({ success: true, message: "Profile updated", data: user });
};

export const submitWaste = async (req, res) => {
  try {
    const weightKg = Number(req.body.weightKg);
    const submittedWasteType = String(req.body.wasteType || "").trim().toLowerCase();
    const wasteType = submittedWasteType === "aluminium" ? "metal" : submittedWasteType;

    if (!Number.isFinite(weightKg) || weightKg < 0.1) {
      return res.status(400).json({ success: false, message: "Weight must be at least 0.1 kg." });
    }

    const collectionPoint = await CollectionPoint.findOne({
      status: "active",
      ...(req.body.collectionPoint ? { _id: req.body.collectionPoint } : {}),
    }).populate("assignedCollectors", "_id role isActive");

    if (!collectionPoint) {
      return res.status(400).json({
        success: false,
        message: "A valid active collection point that accepts this waste type is required.",
      });
    }

    let collector = (collectionPoint.assignedCollectors || []).find(
      (item) => item.role === "collector" && item.isActive
    );

    if (!collector) {
      collector = await User.findOne({ role: "collector", isActive: true }).select("_id role isActive");

      if (collector) {
        await CollectionPoint.updateOne(
          { _id: collectionPoint._id },
          { $addToSet: { assignedCollectors: collector._id } }
        );
      }
    }

    if (!collector) {
      return res.status(409).json({
        success: false,
        message: "No active collector is currently available. Please try again.",
      });
    }

    const submission = await WasteSubmission.create({
      student: req.user._id,
      collector: collector._id,
      collectionPoint: collectionPoint._id,
      wasteType,
      materialCategory: wasteType,
      weightKg,
      status: "pending",
      pointsAwarded: 0,
      brandSource: "unknown",
    });

    res.status(201).json({
      success: true,
      message: "Submission sent. Waiting for collector verification.",
      data: submission,
    });
  } catch (error) {
    console.error("[student-submit-waste]", error);
    res.status(500).json({ success: false, message: "Unable to submit waste." });
  }
};
