export const calculateEcoPoints = (weightKg, multiplier = 10) => {
  return Math.max(0, Math.round(Number(weightKg || 0) * multiplier));
};

export const calculateImpact = (weightKg) => {
  const safeWeight = Number(weightKg || 0);
  return {
    carbonSavedKg: Number((safeWeight * 1.8).toFixed(2)),
    treesEquivalent: Number((safeWeight / 25).toFixed(2)),
  };
};

export const buildStudentDashboardMetrics = (user, submissions = []) => {
  const verified = submissions.filter((sub) => sub.status === "verified");
  const totalVerifiedWeightKg = verified.reduce((sum, item) => sum + Number(item.weightKg || 0), 0);
  const totalPoints = verified.reduce((sum, item) => sum + Number(item.pointsAwarded || 0), 0);
  const carbonSaved = calculateImpact(totalVerifiedWeightKg);
  const achievements = [];

  if (verified.length > 0) achievements.push("First Recycler");
  if (totalVerifiedWeightKg >= 5) achievements.push("Plastic Protector");
  if (user.ecoPoints >= 250) achievements.push("Waste Warrior");
  if (carbonSaved.carbonSavedKg >= 25) achievements.push("Green Champion");

  return {
    ecoPoints: Number(user.ecoPoints || 0),
    totalSubmissions: submissions.length,
    totalVerifiedWeightKg: Number(totalVerifiedWeightKg.toFixed(2)),
    carbonSavedKg: Number(carbonSaved.carbonSavedKg.toFixed(2)),
    achievements,
    recentActivity: submissions.slice(0, 4).map((submission) => ({
      id: submission._id.toString(),
      text: `${submission.status === "verified" ? "Verified" : submission.status === "rejected" ? "Rejected" : "Pending"} ${Number(submission.weightKg || 0).toFixed(1)} kg ${submission.wasteType || "waste"}`,
      time: new Date(submission.createdAt).toLocaleString(),
      points: submission.status === "verified" ? Number(submission.pointsAwarded || 0) : 0,
    })),
    totalPointsAwarded: Number(totalPoints),
  };
};
