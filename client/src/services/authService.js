import { loginUser, registerUser } from "../api/authApi.js";

export const authService = {
  async login(payload) {
    const { data } = await loginUser(payload);
    const authData = data.data || data;

    if (authData.token) {
      localStorage.setItem("token", authData.token);
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
    const registeredUser = data.data || data.user;

    return {
      success: data.success ?? true,
      message: data.message || "User registered successfully",
      user: registeredUser,
    };
  },
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  },
};
