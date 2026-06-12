import { api } from "./authApi.js";

export const submitWaste = (payload) => api.post("/collector/submissions", payload);
export const verifyWaste = (id, payload) => api.patch(`/collector/submissions/${id}/verify`, payload);
export const getPendingSubmissions = () => api.get("/collector/pending");
export const getCollectionHistory = () => api.get("/collector/history");
export const applyForCollector = (payload) => api.post("/collector/apply", payload);
export const getMyCollectorApplication = () => api.get("/collector/application");
