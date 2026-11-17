import mongoose from "mongoose";
import WasteSubmission from "../models/WasteSubmission.js";
import User from "../models/User.js";
import CollectorApplication from "../models/CollectorApplication.js";
import CollectionPoint from "../models/CollectionPoint.js";
import { calculateEcoPoints } from "../utils/calculations.js";
import { writeAuditLog } from "../services/auditService.js";
import { awardPoints } from "../services/rewardEngine.js";

const parseJsonField = (value) => {
  if (!value) return null;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const createWasteSubmission = async (req, res) => {
  try {
    const studentId = String(req.body.student ?? "").trim();

    if (!mongoose.isValidObjectId(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid student ID.",
      });
    }

    const student = await User.findById(studentId).select("_id role isActive");

    if (!student || !student.isActive || student.role !== "student") {
      return res.status(400).json({
        success: false,
        message: "A valid active student account is required.",
      });
    }

    const weightKg = Number(req.body.weightKg);

    if (!Number.isFinite(weightKg) || weightKg < 0.1) {
      return res.status(400).json({
        success: false,
        message: "Weight must be at least 0.1 kg.",
      });
    }

    const collectionPoint = await CollectionPoint.findOne({
      _id: req.body.collectionPoint,
      status: "active",
      assignedCollectors: req.user._id,
    });

    if (!collectionPoint) {
      return res.status(403).json({ message: "Collector is not assigned to this active collection point" });
    }

    if (!collectionPoint.acceptedWasteTypes.includes(req.body.wasteType)) {
      return res.status(422).json({ message: "Waste type is not accepted at this collection point" });
    }

    const confirmedBrand = String(req.body.brandName ?? "").trim();
    const aiMaterialPrediction = parseJsonField(req.body.aiMaterialPrediction);
    const aiBrandPrediction = parseJsonField(req.body.aiBrandPrediction);
    const materialCategory = String(req.body.materialCategory ?? "").trim();

    const submission = await WasteSubmission.create({
      student: student._id,
      collector: req.user._id,
      collectionPoint: collectionPoint._id,
      wasteType: String(req.body.wasteType ?? "").trim(),
      materialCategory: materialCategory || null,
      aiMaterialPrediction,
      weightKg,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      brandName: confirmedBrand || null,
      brandSource: confirmedBrand ? "collector-confirmed" : "unknown",
      brandConfidence: null,
      aiBrandPrediction,
    });

    return res.status(201).json({
      success: true,
      message: "Submission recorded and awaiting verification.",
      data: submission,
    });
  } catch (error) {
    console.error("[create-waste-submission]", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create waste submission.",
    });
  }
};

export const verifyWasteSubmission = async (req, res) => {
  try {
    const requestedStatus = req.body.status ?? "verified";

    if (!["verified", "rejected"].includes(requestedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either verified or rejected.",
      });
    }

    const submissionId = req.params.id;

    if (!mongoose.isValidObjectId(submissionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid submission ID.",
      });
    }

    // Collectors can only process records assigned to themselves.
    // Operations and super administrators retain wider access.
    const ownershipFilter =
      req.user.role === "collector"
        ? { collector: req.user._id }
        : {};

    const existing = await WasteSubmission.findOne({
      _id: submissionId,
      ...ownershipFilter,
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Submission not found or you are not authorized to process it.",
      });
    }

    const pointsAwarded =
      requestedStatus === "verified"
        ? calculateEcoPoints(existing.weightKg)
        : 0;

    const update = {
      status: requestedStatus,
      pointsAwarded,
    };

    if (requestedStatus === "verified") {
      update.verifiedAt = new Date();
    }

    const submission = await WasteSubmission.findOneAndUpdate(
      {
        _id: submissionId,
        status: "pending",
        ...ownershipFilter,
      },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(409).json({
        success: false,
        message: "This submission has already been processed.",
      });
    }

    if (requestedStatus === "verified") {
      try {
        const updatedStudent = await User.findByIdAndUpdate(
          submission.student,
          { $inc: { ecoPoints: pointsAwarded } },
          { new: true }
        );

        if (!updatedStudent) {
          await WasteSubmission.updateOne(
            {
              _id: submission._id,
              status: "verified",
              verifiedAt: submission.verifiedAt,
            },
            {
              $set: { status: "pending", pointsAwarded: 0 },
              $unset: { verifiedAt: 1 },
            }
          );

          return res.status(409).json({
            success: false,
            message: "Student account not found. Verification was rolled back.",
          });
        }
      } catch (error) {
        await WasteSubmission.updateOne(
          {
            _id: submission._id,
            status: "verified",
            verifiedAt: submission.verifiedAt,
          },
          {
            $set: { status: "pending", pointsAwarded: 0 },
            $unset: { verifiedAt: 1 },
          }
        );
        throw error;
      }
    }

    return res.json({
      success: true,
      message:
        requestedStatus === "verified"
          ? "Submission verified and eco-points awarded."
          : "Submission rejected.",
      data: submission,
    });
  } catch (error) {
    console.error("[verify-waste-submission]", error);
    return res.status(500).json({
      success: false,
      message: "Unable to process waste verification.",
    });
  }
};

export const getCollectionHistory = async (req, res) => {
  const filter =
    req.user.role === "collector"
      ? { collector: req.user._id }
      : {};

  const submissions = await WasteSubmission.find(filter)
    .populate("student", "name email")
    .populate("collector", "name email")
    .sort({ createdAt: -1 })
    .lean();

  return res.json({
    success: true,
    data: submissions,
  });
};

export const getPendingSubmissions = async (req, res) => {
  const assignedPoints = await CollectionPoint.find({
    status: "active",
    assignedCollectors: req.user._id,
  }).select("_id");

  const submissions = await WasteSubmission.find({
    status: "pending",
    collectionPoint: { $in: assignedPoints.map((point) => point._id) },
  })
    .populate("student", "name email role school")
    .populate("collectionPoint", "name county address acceptedWasteTypes")
    .sort({ createdAt: -1 });

  res.json(submissions);
};

export const applyToBecomeCollector = async (req, res) => {
  const existingApplication = await CollectorApplication.findOne({
    userId: req.user._id,
    status: { $in: ["pending", "approved"] },
  });

  if (existingApplication) {
    return res.status(409).json({
      message:
        existingApplication.status === "pending"
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
  const application = await CollectorApplication.findOne({
    userId: req.user._id,
  })
    .sort({ createdAt: -1 })
    .select("-nationalId");

  res.json({ success: true, data: application });
};
