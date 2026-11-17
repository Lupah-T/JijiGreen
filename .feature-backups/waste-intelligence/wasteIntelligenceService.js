import { BRAND_CONFIDENCE_THRESHOLD, ENVIRONMENTAL_CONVERSION_FACTORS, MATERIAL_ALIASES } from "../utils/analyticsConfig.js";

const toNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
};

const getNormalizedStatus = (record) => String(record?.status ?? "").trim().toLowerCase();

const getRecordKey = (record) => {
  if (!record || typeof record !== "object") return null;

  if (record._id) return String(record._id);
  if (record.id) return String(record.id);
  if (record.transactionId) return String(record.transactionId);

  const fallback = [record.student ?? "unknown", record.createdAt ?? record.updatedAt ?? record.date ?? "unknown", record.wasteType ?? "", record.weightKg ?? ""]
    .join("-");

  return fallback || null;
};

const getNumericConfidence = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 && numeric <= 1 ? numeric : null;
};

export const normalizeMaterialCategory = (value) => {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) return "other";

  for (const [category, aliases] of Object.entries(MATERIAL_ALIASES)) {
    const matched = aliases.some((alias) => {
      const normalizedAlias = String(alias).trim().toLowerCase();
      return raw.includes(normalizedAlias) || normalizedAlias.includes(raw);
    });

    if (matched) return category;
  }

  return "other";
};

export const resolveBrandRecord = (record) => {
  if (!record || typeof record !== "object") {
    return { brandName: null, source: "unknown", confidence: null, isConfirmed: false };
  }

  const candidateName = typeof record.brandName === "string" ? record.brandName.trim() : "";
  const aiPrediction = record.aiBrandPrediction && typeof record.aiBrandPrediction === "object" ? record.aiBrandPrediction : null;
  const aiName = aiPrediction && typeof aiPrediction.brandName === "string"
    ? aiPrediction.brandName.trim()
    : aiPrediction && typeof aiPrediction.name === "string"
      ? aiPrediction.name.trim()
      : "";
  const aiConfidence = getNumericConfidence(aiPrediction?.confidence ?? record.brandConfidence);
  const statedConfidence = getNumericConfidence(record.brandConfidence);

  if (record.brandSource === "collector-confirmed" && candidateName) {
    return {
      brandName: candidateName,
      source: "collector-confirmed",
      confidence: statedConfidence ?? 1,
      isConfirmed: true,
    };
  }

  if (aiName && aiConfidence !== null && aiConfidence >= BRAND_CONFIDENCE_THRESHOLD) {
    return {
      brandName: aiName,
      source: "ai-predicted",
      confidence: aiConfidence,
      isConfirmed: false,
    };
  }

  return {
    brandName: null,
    source: "unknown",
    confidence: aiConfidence ?? statedConfidence ?? null,
    isConfirmed: false,
  };
};

const createPeriodKey = (dateValue, period) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return null;

  if (period === "day") {
    return date.toISOString().slice(0, 10);
  }

  if (period === "week") {
    const tmp = new Date(date);
    const day = tmp.getDay();
    const diff = (day === 0 ? -6 : 1 - day);
    tmp.setDate(tmp.getDate() + diff);
    tmp.setHours(0, 0, 0, 0);
    return tmp.toISOString().slice(0, 10);
  }

  const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  return monthKey;
};

const formatPeriodLabel = (key, period) => {
  if (!key) return "Unknown";
  if (period === "day") return new Date(`${key}T00:00:00Z`).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
  if (period === "week") return `Week of ${new Date(`${key}T00:00:00Z`).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}`;
  const [year, month] = key.split("-");
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const aggregateByPeriod = (records, period) => {
  const map = new Map();
  const seen = new Set();

  for (const record of records) {
    const key = getRecordKey(record);
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);

    const weight = toNumber(record.weightKg);
    const timestamp = record.updatedAt || record.createdAt || record.verifiedAt || record.date;
    const periodKey = createPeriodKey(timestamp, period);
    if (!periodKey) continue;

    const current = map.get(periodKey) || { label: formatPeriodLabel(periodKey, period), totalKg: 0, transactions: 0 };
    current.totalKg += weight;
    current.transactions += 1;
    map.set(periodKey, current);
  }

  return [...map.entries()]
    .map(([periodKey, value]) => ({ periodKey, label: value.label, totalKg: Number(value.totalKg.toFixed(2)), transactions: value.transactions }))
    .sort((a, b) => a.periodKey.localeCompare(b.periodKey));
};

const aggregateMaterialBreakdown = (records) => {
  const map = new Map();
  const seen = new Set();

  for (const record of records) {
    const key = getRecordKey(record);
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);

    const material = normalizeMaterialCategory(record.materialCategory || record.wasteType);
    const weight = toNumber(record.weightKg);
    const current = map.get(material) || { material, totalKg: 0, transactionCount: 0 };
    current.totalKg += weight;
    current.transactionCount += 1;
    map.set(material, current);
  }

  const sorted = [...map.values()].sort((a, b) => b.totalKg - a.totalKg);
  const totalWeight = sorted.reduce((sum, item) => sum + item.totalKg, 0) || 1;

  return sorted.map((item) => ({
    material: item.material,
    totalKg: Number(item.totalKg.toFixed(2)),
    transactionCount: item.transactionCount,
    percentage: Number(((item.totalKg / totalWeight) * 100).toFixed(2)),
  }));
};

const aggregateBrandBreakdown = (records) => {
  const map = new Map();
  const seen = new Set();

  for (const record of records) {
    const key = getRecordKey(record);
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);

    const { brandName, source, confidence, isConfirmed } = resolveBrandRecord(record);
    if (!brandName) continue;

    const material = normalizeMaterialCategory(record.materialCategory || record.wasteType);
    const weight = toNumber(record.weightKg);
    const current = map.get(brandName) || {
      brandName,
      totalKg: 0,
      transactionCount: 0,
      itemCount: 0,
      materials: new Map(),
      sources: new Map(),
      source,
      isConfirmed,
      confidence: confidence ?? 0,
    };

    current.totalKg += weight;
    current.transactionCount += 1;
    current.itemCount += toNumber(record.itemCount ?? 0);
    current.source = current.source === "collector-confirmed" || source === "collector-confirmed" ? "collector-confirmed" : source;
    current.isConfirmed = current.isConfirmed || isConfirmed;
    current.confidence = current.confidence && confidence !== null ? Math.max(current.confidence, confidence) : (confidence ?? current.confidence);

    const materialEntry = current.materials.get(material) || { material, totalKg: 0, transactionCount: 0 };
    materialEntry.totalKg += weight;
    materialEntry.transactionCount += 1;
    current.materials.set(material, materialEntry);

    const sourceEntry = current.sources.get(source) || 0;
    current.sources.set(source, sourceEntry + 1);
    map.set(brandName, current);
  }

  const totalBrandWeight = [...map.values()].reduce((sum, item) => sum + item.totalKg, 0) || 1;

  return [...map.values()]
    .map((item) => ({
      brandName: item.brandName,
      totalKg: Number(item.totalKg.toFixed(2)),
      transactionCount: item.transactionCount,
      itemCount: item.itemCount,
      percentage: Number(((item.totalKg / totalBrandWeight) * 100).toFixed(2)),
      source: item.source,
      isConfirmed: item.isConfirmed,
      confidence: item.confidence,
      materials: [...item.materials.values()].map((materialEntry) => ({
        material: materialEntry.material,
        totalKg: Number(materialEntry.totalKg.toFixed(2)),
        transactionCount: materialEntry.transactionCount,
      })),
      sourceCounts: Object.fromEntries([...item.sources.entries()].map(([key, value]) => [key, value])),
    }))
    .sort((a, b) => b.totalKg - a.totalKg);
};

export const getWasteIntelligenceAnalytics = (records = []) => {
  const verifiedRecords = Array.isArray(records)
    ? records.filter((record) => record && getNormalizedStatus(record) === "verified")
    : [];

  if (!verifiedRecords.length) {
    return {
      summary: {
        totalVerifiedWasteKg: 0,
        verifiedTransactionCount: 0,
        participatingUsers: 0,
        averageWeightPerTransactionKg: 0,
      },
      materialBreakdown: [],
      materialComposition: [],
      trends: {
        daily: [],
        weekly: [],
        monthly: [],
      },
      brands: {
        breakdown: [],
        distributionByMaterial: [],
        distributionByPeriod: [],
        unknownBrandShare: 0,
        topByWeight: null,
        topByTransactions: null,
      },
      insights: {
        mostFrequentlyIdentifiedBrand: null,
        highestWeightBrand: null,
        highestItemCountBrand: null,
        notes: ["No verified waste records available for intelligence analysis."],
      },
      environmentalImpact: {
        available: false,
        factors: ENVIRONMENTAL_CONVERSION_FACTORS,
        note: "No reliable environmental conversion factors are configured for this deployment; impact estimates are intentionally unavailable.",
      },
      generatedAt: new Date().toISOString(),
    };
  }

  const totalVerifiedWasteKg = verifiedRecords.reduce((sum, record) => sum + toNumber(record.weightKg), 0);
  const totalVerifiedTransactions = verifiedRecords.length;
  const participatingUsers = new Set(
    verifiedRecords
      .filter((record) => record.student)
      .map((record) => String(record.student))
  ).size;
  const averageWeightPerTransactionKg = totalVerifiedTransactions ? totalVerifiedWasteKg / totalVerifiedTransactions : 0;

  const materialBreakdown = aggregateMaterialBreakdown(verifiedRecords);
  const materialComposition = materialBreakdown.map((row) => ({
    material: row.material,
    totalKg: row.totalKg,
    percentage: row.percentage,
    transactionCount: row.transactionCount,
  }));

  const dailyTrend = aggregateByPeriod(verifiedRecords, "day");
  const weeklyTrend = aggregateByPeriod(verifiedRecords, "week");
  const monthlyTrend = aggregateByPeriod(verifiedRecords, "month");

  const brandBreakdown = aggregateBrandBreakdown(verifiedRecords);
  const totalBrandWeight = brandBreakdown.reduce((sum, item) => sum + item.totalKg, 0) || 1;
  const brandDistributionByMaterial = brandBreakdown.flatMap((brand) =>
    brand.materials.map((material) => ({
      brandName: brand.brandName,
      material: material.material,
      totalKg: material.totalKg,
      transactionCount: material.transactionCount,
      percentage: Number(((material.totalKg / totalBrandWeight) * 100).toFixed(2)),
    }))
  );

  const brandDistributionByPeriod = brandBreakdown.flatMap((brand) => {
    const recordsForBrand = verifiedRecords.filter((record) => {
      const { brandName } = resolveBrandRecord(record);
      return brandName === brand.brandName;
    });

    return aggregateByPeriod(recordsForBrand, "month").map((period) => ({
      brandName: brand.brandName,
      label: period.label,
      totalKg: period.totalKg,
      transactions: period.transactions,
      periodKey: period.periodKey,
    }));
  });

  const identifiedTransactions = verifiedRecords.filter((record) => resolveBrandRecord(record).brandName !== null).length;
  const unknownTransactions = Math.max(totalVerifiedTransactions - identifiedTransactions, 0);
  const unknownBrandShare = totalVerifiedTransactions ? Number(((unknownTransactions / totalVerifiedTransactions) * 100).toFixed(2)) : 0;

  const mostFrequentlyIdentifiedBrand = [...brandBreakdown].sort((a, b) => b.transactionCount - a.transactionCount)[0] || null;
  const highestWeightBrand = [...brandBreakdown].sort((a, b) => b.totalKg - a.totalKg)[0] || null;
  const highestItemCountBrand = [...brandBreakdown].sort((a, b) => b.itemCount - a.itemCount)[0] || null;

  return {
    summary: {
      totalVerifiedWasteKg: Number(totalVerifiedWasteKg.toFixed(2)),
      verifiedTransactionCount: totalVerifiedTransactions,
      participatingUsers,
      averageWeightPerTransactionKg: Number(averageWeightPerTransactionKg.toFixed(2)),
    },
    materialBreakdown,
    materialComposition,
    trends: {
      daily: dailyTrend,
      weekly: weeklyTrend,
      monthly: monthlyTrend,
    },
    brands: {
      breakdown: brandBreakdown,
      distributionByMaterial: brandDistributionByMaterial,
      distributionByPeriod: brandDistributionByPeriod,
      unknownBrandShare,
      topByWeight: highestWeightBrand,
      topByTransactions: mostFrequentlyIdentifiedBrand,
    },
    insights: {
      mostFrequentlyIdentifiedBrand: mostFrequentlyIdentifiedBrand ? {
        brandName: mostFrequentlyIdentifiedBrand.brandName,
        transactionCount: mostFrequentlyIdentifiedBrand.transactionCount,
        totalKg: mostFrequentlyIdentifiedBrand.totalKg,
      } : null,
      highestWeightBrand: highestWeightBrand ? {
        brandName: highestWeightBrand.brandName,
        totalKg: highestWeightBrand.totalKg,
      } : null,
      highestItemCountBrand: highestItemCountBrand ? {
        brandName: highestItemCountBrand.brandName,
        itemCount: highestItemCountBrand.itemCount,
      } : null,
      notes: [
        "Material analytics use only verified submissions.",
        "Brand analytics do not promote low-confidence AI predictions to confirmed records.",
        "When no brand identity is available or confidence is below the configured threshold, records remain unconfirmed.",
      ],
    },
    environmentalImpact: {
      available: false,
      factors: ENVIRONMENTAL_CONVERSION_FACTORS,
      note: "No reliable environmental conversion factors are configured for this deployment; impact estimates are intentionally unavailable.",
    },
    generatedAt: new Date().toISOString(),
  };
};
