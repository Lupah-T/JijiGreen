import { loginUser, registerUser, forgotPassword as forgotPasswordApi, resetPassword as resetPasswordApi } from "../api/authApi.js";

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
  async forgotPassword(payload) {
    const { data } = await forgotPasswordApi(payload);
    return {
      success: data.success ?? true,
      message: data.message || "If an account exists, a reset link has been sent",
    };
  },
  async resetPassword({ token, password }) {
    if (!token) throw new Error("Missing token");
    const { data } = await resetPasswordApi(token, { password });
    return {
      success: data.success ?? true,
      message: data.message || "Password reset successful",
    };
  },
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  },
};
