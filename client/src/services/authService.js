import { loginUser, registerUser } from "../api/authApi.js";

export const authService = {
  async login(payload) {
    const { data } = await loginUser(payload);
    const authData = data.data || data;

    if (authData.token) {
      localStorage.setItem("token", authData.token);
    }
    if (authData.user?.role) {
      localStorage.setItem("role", authData.user.role);
    }

    return {
      success: data.success ?? true,
      message: data.message || "Login successful",
      user: authData.user,
      token: authData.token,
    };
  },
  async register(payload) {
    const { data } = await registerUser(payload);
    const authData = data.data || data;

    if (authData.token) {
      localStorage.setItem("token", authData.token);
    }
    if (authData.user?.role) {
      localStorage.setItem("role", authData.user.role);
    }

    return {
      success: data.success ?? true,
      message: data.message || "User registered successfully",
      user: authData.user,
      token: authData.token,
    };
  },
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  },
};
