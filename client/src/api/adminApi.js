import { api } from "./authApi.js";

export const getAdminDashboard = () => api.get("/admin/dashboard");
export const getUsers = () => api.get("/admin/users");
export const getSchools = () => api.get("/admin/schools");
export const createSchool = (payload) => api.post("/admin/schools", payload);
export const createReward = (payload) => api.post("/admin/rewards", payload);
export const createPrivilegedUser = (payload) => api.post("/admin/create-user", payload);
export const getCollectorApplications = () => api.get("/admin/collector-applications");
export const reviewCollectorApplication = (id, payload) => api.patch(`/admin/collector-applications/${id}/review`, payload);
export const getAuditLogs = () => api.get("/admin/audit-logs");
export const getCollectors = () => api.get("/admin/collectors");
export const getAdminCollectionPoints = () => api.get("/admin/collection-points");
export const createCollectionPoint = (payload) => api.post("/admin/collection-points", payload);
export const updateCollectionPoint = (id, payload) => api.put(`/admin/collection-points/${id}`, payload);
export const updateUserRole = (userId, payload) => api.patch(`/admin/users/${userId}/role`, payload);
export const getUserDetails = (userId) => api.get(`/admin/users/${userId}/details`);
