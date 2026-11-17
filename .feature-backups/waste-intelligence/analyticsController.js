import WasteSubmission from "../models/WasteSubmission.js";
import { getWasteIntelligenceAnalytics } from "../services/wasteIntelligenceService.js";

export const getWasteIntelligence = async (_req, res) => {
  try {
    const records = await WasteSubmission.find({}).sort({ createdAt: -1 }).lean();
    const analytics = getWasteIntelligenceAnalytics(records);
    res.json({ success: true, data: analytics });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to calculate waste intelligence" });
  }
};
