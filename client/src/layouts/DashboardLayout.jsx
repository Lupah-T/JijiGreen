import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { LayoutDashboard, Star, Trophy, User, CheckSquare, ClipboardList, Users, BarChart2, Gift, ClipboardCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

const MOBILE_NAV = {
  student:   [{ to:"/student/dashboard", I:LayoutDashboard, l:"Home" }, { to:"/student/rewards", I:Star, l:"Rewards" }, { to:"/student/leaderboard", I:Trophy, l:"Ranks" }, { to:"/student/apply-collector", I:ClipboardCheck, l:"Apply" }, { to:"/student/profile", I:User, l:"Profile" }],
  collector: [{ to:"/collector/dashboard", I:LayoutDashboard, l:"Home" }, { to:"/collector/verify-waste", I:CheckSquare, l:"Verify" }, { to:"/collector/history", I:ClipboardList, l:"History" }],
  school_admin: [{ to:"/admin/dashboard", I:LayoutDashboard, l:"Home" }, { to:"/admin/analytics", I:BarChart2, l:"Stats" }],
  operations_admin: [{ to:"/admin/dashboard", I:LayoutDashboard, l:"Home" }, { to:"/admin/users", I:Users, l:"Users" }, { to:"/admin/analytics", I:BarChart2, l:"Stats" }, { to:"/admin/rewards", I:Gift, l:"Rewards" }],
  super_admin: [{ to:"/admin/dashboard", I:LayoutDashboard, l:"Home" }, { to:"/admin/users", I:Users, l:"Users" }, { to:"/admin/analytics", I:BarChart2, l:"Stats" }, { to:"/admin/rewards", I:Gift, l:"Rewards" }],
};

export default function DashboardLayout() {
  const { user } = useAuth();
  const role = user?.role || localStorage.getItem("role") || "student";
  const mobileLinks = MOBILE_NAV[role] || MOBILE_NAV.student;

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-main">
        <Outlet />
      </main>
      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        {mobileLinks.map(({ to, I, l }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => `mobile-nav-item${isActive ? " active" : ""}`}>
            <I /> <span>{l}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
