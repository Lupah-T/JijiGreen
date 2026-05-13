import User from "../models/User.js";
import School from "../models/School.js";
import WasteSubmission from "../models/WasteSubmission.js";

export const getPlatformAnalytics = async () => {
  const [students, schools, submissions, verifiedSubmissions] = await Promise.all([
    User.countDocuments({ role: "student" }),
    School.countDocuments(),
    WasteSubmission.countDocuments(),
    WasteSubmission.find({ status: "verified" }),
  ]);

  const totalWasteKg = verifiedSubmissions.reduce((sum, item) => sum + item.weightKg, 0);

  return { students, schools, submissions, totalWasteKg };
};
