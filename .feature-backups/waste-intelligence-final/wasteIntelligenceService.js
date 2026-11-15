import {
  BRAND_CONFIDENCE_THRESHOLD,
  ENVIRONMENTAL_CONVERSION_FACTORS,
  MATERIAL_ALIASES,
} from "../utils/analyticsConfig.js";

const round = (value, places = 2) => {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

const toValidWeight = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
};

const normalizeText = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

export function normalizeMaterialCategory(value) {
  const normalized = normalizeText(value);
  if (!normalized) return "other";

  const materials = Object.entries(MATERIAL_ALIASES);

  // Exact matches first. This avoids broad partial matches such as
  // classifying "glass bottle" as plastic merely because it contains "bottle".
  for (const [material, aliases] of materials) {
    if (aliases.includes(normalized)) return material;
  }

  // Then match complete phrases or words, preferring longer aliases.
  const candidates = materials
    .flatMap(([material, aliases]) =>
      aliases.map((alias) => ({ material, alias }))
    )
    .sort((a, b) => b.alias.length - a.alias.length);

  for (const candidate of candidates) {
    const escaped = candidate.alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(^|\\s)${escaped}(\\s|$)`).test(normalized)) {
      return candidate.material;
    }
  }

  return "other";
}

export function resolveBrandRecord(record = {}) {
  const confirmedName =
    record.brandSource === "collector-confirmed"
      ? String(record.brandName ?? "").trim()
      : "";

  if (confirmedName) {
    return {
      brandName: confirmedName,
      source: "collector-confirmed",
      isConfirmed: true,
      confidence: 1,
    };
  }

  const prediction = record.aiBrandPrediction ?? {};
  const predictedName = String(
    prediction.brandName ?? prediction.brand ?? ""
  ).trim();

  const confidence = Number(
    prediction.confidence ?? record.brandConfidence
  );

  if (
    predictedName &&
    Number.isFinite(confidence) &&
    confidence >= BRAND_CONFIDENCE_THRESHOLD &&
    confidence <= 1
  ) {
    return {
      brandName: predictedName,
      source: "ai-predicted",
      isConfirmed: false,
      confidence: round(confidence, 4),
    };
  }

  return {
    brandName: null,
    source: "unknown",
    isConfirmed: false,
    confidence: Number.isFinite(confidence) ? round(confidence, 4) : null,
  };
}

function deduplicate(records) {
  const seen = new Set();

  return records.filter((record) => {
    const id = record?._id ?? record?.id ?? record?.transactionId;

    // Without a stable identifier, do not discard a record based on guesses.
    if (!id) return true;

    const key = String(id);
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function getDate(record) {
  const value = record.verifiedAt ?? record.createdAt ?? record.date;
  const date = value ? new Date(value) : null;

  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function buildMaterialBreakdown(records) {
  const groups = new Map();

  for (const record of records) {
    const material = normalizeMaterialCategory(
      record.materialCategory || record.wasteType
    );

    const group = groups.get(material) ?? {
      material,
      totalKg: 0,
      transactionCount: 0,
    };

    group.totalKg += toValidWeight(record.weightKg);
    group.transactionCount += 1;
    groups.set(material, group);
  }

  const total = [...groups.values()].reduce((sum, item) => sum + item.totalKg, 0);

  return [...groups.values()]
    .map((item) => ({
      ...item,
      totalKg: round(item.totalKg),
      percentage: total > 0 ? round((item.totalKg / total) * 100) : 0,
    }))
    .sort((a, b) => b.totalKg - a.totalKg);
}

function buildBrandBreakdown(records, source) {
  const groups = new Map();

  for (const record of records) {
    const brand = resolveBrandRecord(record);
    if (brand.source !== source || !brand.brandName) continue;

    const group = groups.get(brand.brandName) ?? {
      brandName: brand.brandName,
      totalKg: 0,
      transactionCount: 0,
    };

    group.totalKg += toValidWeight(record.weightKg);
    group.transactionCount += 1;
    groups.set(brand.brandName, group);
  }

  return [...groups.values()]
    .map((item) => ({ ...item, totalKg: round(item.totalKg) }))
    .sort((a, b) => b.totalKg - a.totalKg);
}

function buildTimeBreakdown(records) {
  const groups = new Map();

  for (const record of records) {
    const date = getDate(record);
    if (!date) continue;

    const month = date.toISOString().slice(0, 7);
    const group = groups.get(month) ?? {
      period: month,
      totalKg: 0,
      transactionCount: 0,
    };

    group.totalKg += toValidWeight(record.weightKg);
    group.transactionCount += 1;
    groups.set(month, group);
  }

  return [...groups.values()]
    .sort((a, b) => a.period.localeCompare(b.period))
    .map((item) => ({ ...item, totalKg: round(item.totalKg) }));
}

export function getWasteIntelligenceAnalytics(inputRecords = []) {
  const verifiedRecords = deduplicate(
    inputRecords.filter((record) => {
      const status = String(record.status ?? "").toLowerCase();
      return status === "verified" && toValidWeight(record.weightKg) > 0;
    })
  );

  const totalKg = verifiedRecords.reduce(
    (sum, record) => sum + toValidWeight(record.weightKg),
    0
  );

  const uniqueStudents = new Set(
    verifiedRecords
      .map((record) => record.student?._id ?? record.student)
      .filter(Boolean)
      .map(String)
  );

  const confirmedRecords = verifiedRecords.filter(
    (record) => resolveBrandRecord(record).source === "collector-confirmed"
  );
  const predictedRecords = verifiedRecords.filter(
    (record) => resolveBrandRecord(record).source === "ai-predicted"
  );
  const unknownRecords = verifiedRecords.filter(
    (record) => resolveBrandRecord(record).source === "unknown"
  );

  const confirmedBrands = buildBrandBreakdown(verifiedRecords, "collector-confirmed");
  const predictedBrands = buildBrandBreakdown(verifiedRecords, "ai-predicted");

  const highestConfirmedBrand = confirmedBrands[0] ?? null;
  const mostFrequentlyConfirmedBrand = [...confirmedBrands].sort(
    (a, b) => b.transactionCount - a.transactionCount
  )[0] ?? null;

  const count = verifiedRecords.length;
  const share = (value) => count ? round((value / count) * 100) : 0;

  return {
    generatedAt: new Date().toISOString(),

    summary: {
      totalVerifiedWasteKg: round(totalKg),
      verifiedTransactionCount: count,
      participatingUsers: uniqueStudents.size,
      averageWeightPerTransactionKg: count ? round(totalKg / count) : 0,
    },

    materialBreakdown: buildMaterialBreakdown(verifiedRecords),
    timeBreakdown: buildTimeBreakdown(verifiedRecords),

    brands: {
      confirmedBreakdown: confirmedBrands,
      predictedBreakdown: predictedBrands,
      confirmedTransactionCount: confirmedRecords.length,
      predictedTransactionCount: predictedRecords.length,
      unknownTransactionCount: unknownRecords.length,
      confirmedShare: share(confirmedRecords.length),
      predictedShare: share(predictedRecords.length),
      unknownBrandShare: share(unknownRecords.length),
    },

    insights: {
      highestWeightConfirmedBrand: highestConfirmedBrand,
      mostFrequentlyConfirmedBrand,
    },

    environmentalImpact: {
      available: false,
      message: "Environmental impact estimates are unavailable until validated conversion factors and methodology are configured.",
      conversionFactors: ENVIRONMENTAL_CONVERSION_FACTORS,
    },
  };
}
