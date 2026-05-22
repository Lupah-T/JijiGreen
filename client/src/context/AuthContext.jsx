import { createContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser } from "../api/authApi.js";
import { authService } from "../services/authService.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const role = localStorage.getItem("role");
    return role ? { role } : null;
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("token")));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then(({ data }) => {
        const currentUser = data.data || data;
        setUser(currentUser);
        if (currentUser?.role) localStorage.setItem("role", currentUser.role);
      })
      .catch(() => {
        authService.logout();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      login: async (payload) => {
        const data = await authService.login(payload);
        setUser(data.user);
        return data;
      },
      register: async (payload) => {
        const data = await authService.register(payload);
        setUser(data.user);
        return data;
      },
      logout: () => {
        authService.logout();
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
