import { api } from "./authApi.js";

export const getStudentDashboard = () => api.get("/student/dashboard");
export const getStudentHistory   = () => api.get("/student/history");
export const getProfile          = () => api.get("/student/profile");
export const updateProfile       = (data) => api.put("/student/profile", data);
