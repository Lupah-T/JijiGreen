import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar.jsx";

const links = [
  { to: "/student/dashboard", label: "Student" },
  { to: "/collector/dashboard", label: "Collector" },
  { to: "/admin/dashboard", label: "Admin" },
];

export default function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <Sidebar links={links} />
      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
