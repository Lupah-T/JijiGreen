import { loginUser, registerUser } from "../api/authApi.js";

export const authService = {
  async login(payload) {
    const { data } = await loginUser(payload);
    localStorage.setItem("token", data.token);
    return data;
  },
  async register(payload) {
    const { data } = await registerUser(payload);
    localStorage.setItem("token", data.token);
    return data;
  },
  logout() {
    localStorage.removeItem("token");
  },
};
