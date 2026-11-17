import { api } from "./authApi.js";

export const getCollectionPoints = (params = {}) => api.get("/collection-points", { params });
