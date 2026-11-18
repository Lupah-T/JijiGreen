import User from "../models/User.js";
import School from "../models/School.js";
import WasteSubmission from "../models/WasteSubmission.js";

export const getPlatformAnalytics = async (scopeUser = null) => {
  const startOfWindow = new Date();
  startOfWindow.setMonth(startOfWindow.getMonth() - 5);
  startOfWindow.setDate(1);
  startOfWindow.setHours(0, 0, 0, 0);

  let studentFilter = {};
  let userFilter = { role: "student" };
  let schoolCount = 0;

  if (scopeUser?.role === "school_admin") {
    if (!scopeUser.school) {
      const error = new Error("Your admin account is not assigned to a school.");
      error.statusCode = 403;
      throw error;
    }

    userFilter = { role: "student", school: scopeUser.school };
    const studentIds = await User.find(userFilter).distinct("_id");
    studentFilter = { student: { $in: studentIds } };
  }

  const [students, schools, submissions, verifiedSubmissions, recentUsers, recentSubmissions] = await Promise.all([
    User.countDocuments(userFilter),
    scopeUser?.role === "school_admin" ? Promise.resolve(schoolCount) : School.countDocuments(),
    WasteSubmission.countDocuments(studentFilter),
    WasteSubmission.find({ status: "verified", ...studentFilter }),
    User.find(userFilter).populate("school", "name").select("name email role school isActive createdAt").sort({ createdAt: -1 }).limit(5),
    WasteSubmission.find({ createdAt: { $gte: startOfWindow }, ...studentFilter })
      .populate("student", "name email role")
      .populate("collectionPoint", "name county")
      .sort({ createdAt: -1 })
      .limit(50),
  ]);

  const totalWasteKg = verifiedSubmissions.reduce((sum, item) => sum + item.weightKg, 0);
  const monthlyTrendMap = new Map();

  for (let offset = 5; offset >= 0; offset -= 1) {
    const month = new Date();
    month.setMonth(month.getMonth() - offset);
    month.setDate(1);
    month.setHours(0, 0, 0, 0);
    const key = month.toLocaleDateString("en-US", { month: "short" });
    monthlyTrendMap.set(key, { month: key, waste: 0, submissions: 0 });
  }

  const wasteByTypeMap = new Map();

  recentSubmissions.forEach((submission) => {
    const monthKey = new Date(submission.createdAt).toLocaleDateString("en-US", { month: "short" });
    const monthEntry = monthlyTrendMap.get(monthKey);
    if (monthEntry) {
      monthEntry.waste += Number(submission.weightKg || 0);
      monthEntry.submissions += 1;
    }

    if (submission.status === "verified") {
      const current = wasteByTypeMap.get(submission.wasteType) || 0;
      wasteByTypeMap.set(submission.wasteType, current + Number(submission.weightKg || 0));
    }
  });

  const monthlyTrend = Array.from(monthlyTrendMap.values());
  const wasteByType = Array.from(wasteByTypeMap.entries()).map(([wasteType, weight]) => ({
    wasteType,
    weight,
  }));

  return {
    students,
    schools,
    submissions,
    totalWasteKg,
    monthlyTrend,
    wasteByType,
    recentUsers,
    recentSubmissions,
  };
};
