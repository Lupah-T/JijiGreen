import User from "../models/User.js";
import WasteSubmission from "../models/WasteSubmission.js";
import { getWasteIntelligenceAnalytics } from "../services/wasteIntelligenceService.js";

export const getWasteIntelligence = async (req, res) => {
  try {
    let studentFilter = {};

    if (req.user.role === "school_admin") {
      if (!req.user.school) {
        return res.status(403).json({
          success: false,
          message: "Your admin account is not assigned to a school.",
        });
      }

      const studentIds = await User.find({
        school: req.user.school,
        role: "student",
      }).distinct("_id");

      studentFilter = { student: { $in: studentIds } };
    }

    const records = await WasteSubmission.find({
      status: "verified",
      ...studentFilter,
    })
      .select("_id student wasteType materialCategory weightKg brandName brandSource brandConfidence aiBrandPrediction createdAt verifiedAt")
      .sort({ createdAt: -1 })
      .lean();

    const analytics = getWasteIntelligenceAnalytics(records);

    return res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("[waste-intelligence]", error);

    return res.status(500).json({
      success: false,
      message: "Unable to calculate waste intelligence.",
    });
  }
};
