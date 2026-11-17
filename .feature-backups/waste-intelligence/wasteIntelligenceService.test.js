import assert from "node:assert/strict";
import { getWasteIntelligenceAnalytics, normalizeMaterialCategory, resolveBrandRecord } from "./wasteIntelligenceService.js";

const records = [
  {
    status: "verified",
    materialCategory: "plastic",
    wasteType: "plastic bottle",
    weightKg: 1.2,
    student: "user-1",
    createdAt: "2025-01-03T08:00:00Z",
    brandName: "Coca-Cola",
    brandSource: "collector-confirmed",
    brandConfidence: 1,
  },
  {
    status: "verified",
    materialCategory: "glass",
    wasteType: "glass bottle",
    weightKg: 2.5,
    student: "user-2",
    createdAt: "2025-01-04T08:00:00Z",
    brandName: "Pepsi",
    brandSource: "collector-confirmed",
    brandConfidence: 1,
  },
  {
    status: "verified",
    materialCategory: "plastic",
    wasteType: "plastic bottle",
    weightKg: 0.8,
    student: "user-1",
    createdAt: "2025-01-06T08:00:00Z",
    aiBrandPrediction: { brandName: "Coca-Cola", confidence: 0.9 },
    brandSource: "ai-predicted",
    brandConfidence: 0.9,
  },
  {
    status: "pending",
    materialCategory: "metal",
    wasteType: "aluminium can",
    weightKg: 5,
    student: "user-3",
    createdAt: "2025-01-07T08:00:00Z",
    brandName: "Predator",
    brandSource: "collector-confirmed",
    brandConfidence: 1,
  },
  {
    status: "verified",
    materialCategory: "metal",
    wasteType: "aluminium can",
    weightKg: 1.5,
    student: "user-2",
    createdAt: "2025-02-03T08:00:00Z",
    aiBrandPrediction: { brandName: "Predator", confidence: 0.65 },
    brandSource: "ai-predicted",
    brandConfidence: 0.65,
  },
  {
    status: "rejected",
    materialCategory: "cardboard",
    wasteType: "cardboard box",
    weightKg: 3,
    student: "user-4",
    createdAt: "2025-02-10T08:00:00Z",
    brandName: null,
    brandSource: "unknown",
    brandConfidence: 0.4,
  },
];

const analytics = getWasteIntelligenceAnalytics(records);

assert.equal(analytics.summary.totalVerifiedWasteKg, 6.0);
assert.equal(analytics.summary.verifiedTransactionCount, 4);
assert.equal(analytics.summary.participatingUsers, 2);
assert.equal(analytics.materialBreakdown.length, 3);
assert.equal(analytics.materialBreakdown[0].material, "glass");
assert.equal(analytics.materialBreakdown[0].totalKg, 2.5);
assert.equal(analytics.materialBreakdown[1].material, "plastic");
assert.equal(analytics.materialBreakdown[1].totalKg, 2.0);
assert.equal(analytics.materialBreakdown[2].material, "metal");
assert.equal(analytics.materialBreakdown[2].totalKg, 1.5);
assert.equal(analytics.brands.breakdown.find((brand) => brand.brandName === "Coca-Cola")?.transactionCount, 2);
assert.equal(analytics.brands.breakdown.find((brand) => brand.brandName === "Pepsi")?.totalKg, 2.5);
assert.equal(analytics.brands.unknownBrandShare, 25);
assert.equal(normalizeMaterialCategory("Aluminium can"), "metal");
assert.equal(resolveBrandRecord({ aiBrandPrediction: { brandName: "Predator", confidence: 0.7 }, brandConfidence: 0.7 }).brandName, "Predator");
assert.equal(resolveBrandRecord({ aiBrandPrediction: { brandName: "UnknownBrand", confidence: 0.5 }, brandConfidence: 0.5 }).brandName, null);
assert.equal(resolveBrandRecord({ brandName: "Coca-Cola", brandSource: "collector-confirmed", brandConfidence: 1 }).source, "collector-confirmed");
assert.equal(resolveBrandRecord({ aiBrandPrediction: { brandName: "Pepsi", confidence: 0.8 }, brandSource: "ai-predicted", brandConfidence: 0.8 }).isConfirmed, false);
console.log("waste intelligence tests passed");
