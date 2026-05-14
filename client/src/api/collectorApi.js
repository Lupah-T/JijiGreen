import { api } from "./authApi.js";

export const submitWaste = (payload) => api.post("/collector/submissions", payload);
export const verifyWaste = (id, payload) => api.patch(`/collector/submissions/${id}/verify`, payload);
export const getCollectionHistory = () => api.get("/collector/history");
