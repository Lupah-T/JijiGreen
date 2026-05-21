import { NavLink } from "react-router-dom";
import { Leaf, LayoutDashboard, Star, Trophy, User, History,
         CheckSquare, ClipboardList, Users, School, BarChart2,
         Gift, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";

const NAV_BY_ROLE = {
  student: [
    { to: "/student/dashboard",  label: "Dashboard",   icon: <LayoutDashboard size={17} /> },
    { to: "/student/rewards",    label: "Rewards",      icon: <Star            size={17} /> },
    { to: "/student/leaderboard",label: "Leaderboard",  icon: <Trophy          size={17} /> },
    { to: "/student/history",    label: "History",      icon: <History         size={17} /> },
    { to: "/student/profile",    label: "Profile",      icon: <User            size={17} /> },
  ],
  collector: [
    { to: "/collector/dashboard",   label: "Dashboard",  icon: <LayoutDashboard size={17} /> },
    { to: "/collector/verify-waste",label: "Verify Waste",icon: <CheckSquare    size={17} /> },
    { to: "/collector/history",     label: "History",    icon: <ClipboardList   size={17} /> },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard",  icon: <LayoutDashboard size={17} /> },
    { to: "/admin/users",     label: "Users",       icon: <Users           size={17} /> },
    { to: "/admin/schools",   label: "Schools",     icon: <School          size={17} /> },
    { to: "/admin/analytics", label: "Analytics",   icon: <BarChart2       size={17} /> },
    { to: "/admin/rewards",   label: "Rewards",     icon: <Gift            size={17} /> },
  ],
};

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "U";
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const role = user?.role || localStorage.getItem("role") || "student";
  const links = NAV_BY_ROLE[role] || NAV_BY_ROLE.student;

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <Leaf size={20} />
        JijiGreen
      </div>

      {/* User info */}
      {user && (
        <div className="sidebar-user">
          <div className="sidebar-avatar">{getInitials(user.name)}</div>
          <div className="sidebar-user-info">
            <small>{role}</small>
            <span>{user.name || "User"}</span>
          </div>
        </div>
      )}

      {/* Nav links */}
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button
          className="button-ghost"
          style={{ width: "100%", color: "rgba(255,255,255,0.5)", justifyContent: "flex-start", gap: 10, padding: "10px 14px" }}
          onClick={logout}
        >
          <LogOut size={17} /> Log out
        </button>
      </div>
    </aside>
  );
}
