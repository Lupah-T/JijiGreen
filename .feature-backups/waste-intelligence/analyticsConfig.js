export const BRAND_CONFIDENCE_THRESHOLD = Number(process.env.JG_BRAND_CONFIDENCE_THRESHOLD ?? 0.75);

export const ENVIRONMENTAL_CONVERSION_FACTORS = {
  plastic: null,
  glass: null,
  metal: null,
  paper: null,
  cardboard: null,
  other: null,
};

export const MATERIAL_ALIASES = {
  plastic: ["plastic", "plastic bottle", "pet", "polyethylene", "polyester", "bottle", "packaging"],
  metal: ["metal", "aluminium", "aluminum", "steel", "tin", "can", "cans", "aluminium can"],
  glass: ["glass", "glass bottle", "jar", "bottle glass"],
  paper: ["paper", "newspaper", "magazine", "office paper", "cardstock"],
  cardboard: ["cardboard", "carton", "box", "corrugated cardboard"],
};
