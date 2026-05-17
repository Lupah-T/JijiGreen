import { createContext, useMemo, useState } from "react";
import { authService } from "../services/authService.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const value = useMemo(
    () => ({
      user,
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
