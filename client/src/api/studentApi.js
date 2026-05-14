import { api } from "./authApi.js";

export const getStudentDashboard = () => api.get("/student/dashboard");
export const getStudentHistory = () => api.get("/student/history");
