import { getAdminDashboard } from "../api/adminApi.js";

export const analyticsService = {
  dashboard: async () => (await getAdminDashboard()).data,
};
