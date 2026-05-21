import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar.jsx";

export default function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
