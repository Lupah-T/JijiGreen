import axios from "axios";
import { normalizeApiError } from "./errors.js";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error))
);

export const loginUser = (payload) => api.post("/auth/login", payload);
export const registerUser = (payload) => api.post("/auth/register", payload);
export const getCurrentUser = () => api.get("/auth/me");
export const forgotPassword = (payload) => api.post("/auth/forgot-password", payload);
export const resetPassword = (token, payload) => api.post(`/auth/reset-password/${token}`, payload);
