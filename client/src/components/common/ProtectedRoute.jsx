import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const { user, loading } = useAuth();
  const role = user?.role || localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (loading) return <div className="loader"><span className="spinner" /> Checking access...</div>;
  if (allowedRoles.length && !allowedRoles.includes(role)) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
}
