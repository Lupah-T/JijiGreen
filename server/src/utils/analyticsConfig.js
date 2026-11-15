const configuredThreshold = Number(process.env.JG_BRAND_CONFIDENCE_THRESHOLD ?? 0.75);

export const BRAND_CONFIDENCE_THRESHOLD =
  Number.isFinite(configuredThreshold) && configuredThreshold >= 0 && configuredThreshold <= 1
    ? configuredThreshold
    : 0.75;

// No environmental conversion factors are enabled until JijiGreen has
// documented and validated its methodology and data sources.
export const ENVIRONMENTAL_CONVERSION_FACTORS = {
  plastic: null,
  glass: null,
  metal: null,
  paper: null,
  cardboard: null,
  other: null,
};

const aliases = {
  plastic: ["plastic", "plastic bottle", "pet", "polyethylene", "polyester", "plastic packaging"],
  metal: ["metal", "aluminium", "aluminum", "steel", "tin", "can", "cans", "aluminium can", "aluminum can"],
  glass: ["glass", "glass bottle", "glass jar", "jar"],
  paper: ["paper", "newspaper", "magazine", "office paper", "cardstock"],
  cardboard: ["cardboard", "carton", "box", "corrugated cardboard"],
};

export const MATERIAL_ALIASES = Object.fromEntries(
  Object.entries(aliases).map(([material, values]) => [
    material,
    values.map((value) => value.toLowerCase()),
  ])
);
