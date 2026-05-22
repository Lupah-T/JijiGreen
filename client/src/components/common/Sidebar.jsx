import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Leaf, LayoutDashboard, Star, Trophy, History, User,
         CheckSquare, ClipboardList, Users, School, BarChart2,
         Gift, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { ThemeContext } from "../../context/ThemeContext.jsx";

const NAV = {
  student: [
    { to: "/student/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
    { to: "/student/rewards",     label: "Rewards",     icon: Star },
    { to: "/student/leaderboard", label: "Leaderboard", icon: Trophy },
    { to: "/student/history",     label: "History",     icon: History },
    { to: "/student/profile",     label: "Profile",     icon: User },
  ],
  collector: [
    { to: "/collector/dashboard",    label: "Dashboard",    icon: LayoutDashboard },
    { to: "/collector/verify-waste", label: "Verify Waste", icon: CheckSquare },
    { to: "/collector/history",      label: "History",      icon: ClipboardList },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard",  icon: LayoutDashboard },
    { to: "/admin/users",     label: "Users",       icon: Users },
    { to: "/admin/schools",   label: "Schools",     icon: School },
    { to: "/admin/analytics", label: "Analytics",   icon: BarChart2 },
    { to: "/admin/rewards",   label: "Rewards",     icon: Gift },
  ],
};

function initials(name = "") {
  return name.split(" ").slice(0,2).map(w => w[0]).join("").toUpperCase() || "U";
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext) || {};
  const navigate = useNavigate();
  const role = user?.role || localStorage.getItem("role") || "student";
  const links = NAV[role] || NAV.student;

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <Leaf size={20} /> JijiGreen
      </div>

      {/* User */}
      {user && (
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials(user.name)}</div>
          <div>
            <div className="sidebar-user-name">{user.name || "User"}</div>
            <div className="sidebar-user-role">{role}</div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar-nav">
        <span className="sidebar-section-label">Menu</span>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}>
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button onClick={toggleTheme}
          className="sidebar-link"
          style={{ width: "100%", color: "rgba(255,255,255,.55)" }}>
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />} {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <button onClick={handleLogout}
          className="sidebar-link"
          style={{ width: "100%", color: "rgba(255,255,255,.4)" }}>
          <LogOut size={16} /> Log out
        </button>
      </div>
    </aside>
  );
}
