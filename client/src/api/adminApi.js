import { api } from "./authApi.js";

export const getAdminDashboard = () => api.get("/admin/dashboard");
export const getUsers = () => api.get("/admin/users");
export const getSchools = () => api.get("/admin/schools");
export const createSchool = (payload) => api.post("/admin/schools", payload);
export const createReward = (payload) => api.post("/admin/rewards", payload);
