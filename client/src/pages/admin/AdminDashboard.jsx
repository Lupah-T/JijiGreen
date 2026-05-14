import AnalyticsCard from "../../components/admin/AnalyticsCard.jsx";

export default function AdminDashboard() {
  return (
    <>
      <h1>Admin Dashboard</h1>
      <div className="dashboard-grid">
        <AnalyticsCard label="Students" value="0" />
        <AnalyticsCard label="Schools" value="0" />
        <AnalyticsCard label="Waste collected" value="0 kg" />
      </div>
    </>
  );
}
