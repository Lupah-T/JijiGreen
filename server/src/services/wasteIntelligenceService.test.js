import assert from "node:assert/strict";
import {
  getWasteIntelligenceAnalytics,
  normalizeMaterialCategory,
  resolveBrandRecord,
} from "./wasteIntelligenceService.js";

const records = [
  {
    _id: "1",
    status: "verified",
    materialCategory: "plastic",
    wasteType: "plastic bottle",
    weightKg: 1.2,
    student: "user-1",
    createdAt: "2025-01-03T08:00:00Z",
    brandName: "Coca-Cola",
    brandSource: "collector-confirmed",
  },
  {
    _id: "2",
    status: "verified",
    materialCategory: "glass",
    wasteType: "glass bottle",
    weightKg: 2.5,
    student: "user-2",
    createdAt: "2025-01-04T08:00:00Z",
    brandName: "Pepsi",
    brandSource: "collector-confirmed",
  },
  {
    _id: "3",
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
    _id: "4",
    status: "pending",
    materialCategory: "metal",
    wasteType: "aluminium can",
    weightKg: 5,
    student: "user-3",
    createdAt: "2025-01-07T08:00:00Z",
    brandName: "Predator",
    brandSource: "collector-confirmed",
  },
  {
    _id: "5",
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
    _id: "6",
    status: "rejected",
    materialCategory: "cardboard",
    wasteType: "cardboard box",
    weightKg: 3,
    student: "user-4",
    createdAt: "2025-02-10T08:00:00Z",
  },
  {
    _id: "7",
    status: "verified",
    materialCategory: "paper",
    wasteType: "paper",
    weightKg: -2,
    student: "user-5",
  },
];

const analytics = getWasteIntelligenceAnalytics(records);

assert.equal(analytics.summary.totalVerifiedWasteKg, 6);
assert.equal(analytics.summary.verifiedTransactionCount, 4);
assert.equal(analytics.summary.participatingUsers, 2);
assert.equal(analytics.summary.averageWeightPerTransactionKg, 1.5);

assert.equal(analytics.materialBreakdown.length, 3);
assert.equal(analytics.materialBreakdown.find((x) => x.material === "plastic").totalKg, 2);
assert.equal(analytics.materialBreakdown.find((x) => x.material === "glass").totalKg, 2.5);
assert.equal(analytics.materialBreakdown.find((x) => x.material === "metal").totalKg, 1.5);

assert.equal(analytics.brands.confirmedBreakdown.length, 2);
assert.equal(analytics.brands.predictedBreakdown.length, 1);
assert.equal(
  analytics.brands.confirmedBreakdown.find((x) => x.brandName === "Coca-Cola").transactionCount,
  1
);
assert.equal(
  analytics.brands.predictedBreakdown.find((x) => x.brandName === "Coca-Cola").transactionCount,
  1
);

assert.equal(analytics.brands.confirmedShare, 50);
assert.equal(analytics.brands.predictedShare, 25);
assert.equal(analytics.brands.unknownBrandShare, 25);
assert.equal(analytics.brands.unknownTransactionCount, 1);

assert.equal(normalizeMaterialCategory("Aluminium can"), "metal");
assert.equal(normalizeMaterialCategory("glass bottle"), "glass");
assert.equal(normalizeMaterialCategory("plastic bottle"), "plastic");
assert.equal(normalizeMaterialCategory("unknown object"), "other");

assert.equal(
  resolveBrandRecord({
    brandName: "Coca-Cola",
    brandSource: "collector-confirmed",
  }).isConfirmed,
  true
);

assert.equal(
  resolveBrandRecord({
    aiBrandPrediction: { brandName: "Predator", confidence: 0.7 },
  }).brandName,
  null
);

assert.equal(
  resolveBrandRecord({
    aiBrandPrediction: { brandName: "Coca-Cola", confidence: 0.9 },
  }).isConfirmed,
  false
);

assert.equal(analytics.environmentalImpact.available, false);

// A repeated copy of the same database record must not inflate totals.
const duplicated = getWasteIntelligenceAnalytics([records[0], records[0]]);
assert.equal(duplicated.summary.verifiedTransactionCount, 1);
assert.equal(duplicated.summary.totalVerifiedWasteKg, 1.2);

console.log("waste intelligence tests passed");
