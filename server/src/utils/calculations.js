export const calculateEcoPoints = (weightKg, multiplier = 10) => {
  return Math.max(0, Math.round(Number(weightKg || 0) * multiplier));
};

export const calculateImpact = (weightKg) => ({
  carbonSavedKg: Number((Number(weightKg || 0) * 1.8).toFixed(2)),
  treesEquivalent: Number((Number(weightKg || 0) / 25).toFixed(2)),
});
