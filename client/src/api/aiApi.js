import { api } from "./authApi.js";

export const analyzeWasteImage = (formData) =>
  api.post("/ai/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getDIYRecommendations = ({ material, audience = "user" }) =>
  api.get("/ai/recommendations/diy", {
    params: { material, audience },
  });

export const getCollectionPointRecommendations = ({
  material,
  condition = "good",
  quantityKg = 1,
  latitude,
  longitude,
}) =>
  api.get("/ai/recommendations/collection-points", {
    params: {
      material,
      condition,
      quantity_kg: quantityKg,
      latitude,
      longitude,
    },
  });
