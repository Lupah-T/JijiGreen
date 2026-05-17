import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { RewardProvider } from "./context/RewardContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <ThemeProvider>
        <AuthProvider>
          <RewardProvider>
            <AppRoutes />
          </RewardProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
