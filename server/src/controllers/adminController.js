import mongoose from "mongoose";
import User from "../models/User.js";
import School from "../models/School.js";
import Reward from "../models/Reward.js";
import AuditLog from "../models/AuditLog.js";
import CollectorApplication from "../models/CollectorApplication.js";
import { getPlatformAnalytics } from "../services/analyticsEngine.js";
import { writeAuditLog } from "../services/auditService.js";
import { sendNotification } from "../services/notificationService.js";

const ADMIN_CREATABLE_ROLES = ["collector", "school_admin", "operations_admin"];
const ALLOWED_ROLE_UPDATES = ["collector", "school_admin", "operations_admin", "student"];

export const getAdminDashboard = async (_req, res) => {
  res.json(await getPlatformAnalytics());
};

export const listUsers = async (_req, res) => {
  res.json(await User.find().select("-password").sort({ createdAt: -1 }));
};

export const createAdminUser = async (req, res) => {
  const { name, email, password, role, school, phone } = req.body;

  if (!ADMIN_CREATABLE_ROLES.includes(role)) {
    return res.status(422).json({ message: "Invalid privileged role" });
  }

  const existingUser = await User.exists({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password, role, school, phone });

  await writeAuditLog({
    action: "admin_creation",
    performedBy: req.user._id,
    targetUser: user._id,
    previousRole: null,
    newRole: role,
    metadata: { email, createdVia: "/api/admin/create-user" },
  });

  res.status(201).json({
    success: true,
    message: "Privileged user created",
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const listSchools = async (_req, res) => {
  res.json(await School.find().sort({ name: 1 }));
};

export const createSchool = async (req, res) => {
  res.status(201).json(await School.create(req.body));
};

export const createReward = async (req, res) => {
  res.status(201).json(await Reward.create(req.body));
};

export const listCollectorApplications = async (_req, res) => {
  const applications = await CollectorApplication.find()
    .populate("userId", "name email role")
    .populate("reviewedBy", "name email role")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: applications });
};

export const reviewCollectorApplication = async (req, res) => {
  const { status, moderationNotes } = req.body;
  const application = await CollectorApplication.findById(req.params.id).select("+nationalId");

  if (!application) {
    return res.status(404).json({ message: "Collector application not found" });
  }

  if (application.status !== "pending") {
    return res.status(409).json({ message: "Application has already been reviewed" });
  }

  if (application.userId.toString() === req.user.id) {
    return res.status(403).json({ message: "Users cannot approve their own collector application" });
  }

  const applicant = await User.findById(application.userId);
  if (!applicant) {
    return res.status(404).json({ message: "Applicant account not found" });
  }

  const previousRole = applicant.role;
  application.status = status;
  application.reviewedBy = req.user._id;
  application.reviewedAt = new Date();
  application.moderationNotes = moderationNotes;

  if (status === "approved") {
    applicant.role = "collector";
    await applicant.save();
  }

  await application.save();

  await writeAuditLog({
    action: status === "approved" ? "collector_approval" : "collector_rejection",
    performedBy: req.user._id,
    targetUser: applicant._id,
    previousRole,
    newRole: status === "approved" ? applicant.role : previousRole,
    metadata: {
      applicationId: application._id,
      moderationNotes,
      collectionPointName: application.collectionPointName,
      county: application.county,
    },
  });

  await sendNotification({
    to: applicant.email,
    subject: status === "approved" ? "Collector application approved" : "Collector application reviewed",
    message: status === "approved"
      ? "Your JijiGreen collector access has been approved."
      : "Your JijiGreen collector application was not approved at this time.",
  });

  res.json({
    success: true,
    message: status === "approved" ? "Collector approved" : "Collector application rejected",
    data: application,
  });
};

export const listAuditLogs = async (_req, res) => {
  const logs = await AuditLog.find()
    .populate("performedBy", "name email role")
    .populate("targetUser", "name email role")
    .sort({ createdAt: -1 })
    .limit(200);

  res.json({ success: true, data: logs });
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const { userId } = req.params;

    if (!role || typeof role !== "string") {
      return res.status(400).json({ message: "Role is required" });
    }

    if (!ALLOWED_ROLE_UPDATES.includes(role)) {
      return res.status(422).json({ message: "Invalid role" });
    }

    // prevent self role modification for safety
    if (req.user.id === userId) {
      return res.status(403).json({ message: "Users cannot modify their own role" });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const targetUser = await User.findById(userId).select("+role isActive name email");
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    if (!targetUser.isActive) {
      return res.status(400).json({ message: "Target user account is inactive" });
    }

    // Do not allow changing super_admin via this endpoint
    if (targetUser.role === "super_admin") {
      return res.status(403).json({ message: "Modifying super_admin role via this endpoint is forbidden" });
    }

    const previousRole = targetUser.role;
    if (previousRole === role) {
      return res.status(200).json({ success: true, message: "Role unchanged", data: { id: targetUser._id, role: previousRole } });
    }

    targetUser.role = role;
    await targetUser.save();

    await writeAuditLog({
      action: "role_update",
      performedBy: req.user._id,
      targetUser: targetUser._id,
      previousRole,
      newRole: role,
      metadata: { changedVia: "/api/admin/users/:userId/role" },
    });

    res.json({
      success: true,
      message: "User role updated",
      data: { id: targetUser._id, name: targetUser.name, email: targetUser.email, role: targetUser.role },
    });
  } catch (error) {
    // Do not leak internal errors
    res.status(500).json({ message: "Server error" });
  }
};
