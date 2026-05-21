import WasteForm from "../../components/collector/WasteForm.jsx";
import { Recycle, CheckCircle, Clock } from "lucide-react";

export default function CollectorDashboard() {
  return (
    <>
      <div>
        <h1 className="page-title">Collector Dashboard</h1>
        <p style={{ color: "var(--clr-muted)", marginTop: 4 }}>Verify waste submissions and award eco-points</p>
      </div>

      {/* Quick stats */}
      <div className="dashboard-grid-3">
        {[
          { icon: <CheckCircle size={20} style={{ color: "#16a34a" }} />, bg: "#f0fdf4", label: "Verified Today",    value: "7"       },
          { icon: <Recycle     size={20} style={{ color: "#3b82f6" }} />, bg: "#eff6ff", label: "Total kg Today",   value: "18.4 kg" },
          { icon: <Clock       size={20} style={{ color: "#f59e0b" }} />, bg: "#fffbeb", label: "Pending Review",   value: "3"       },
        ].map((s) => (
          <div key={s.label} className="stat-card fade-in">
            <div className="stat-card-header">
              <div className="stat-label">{s.label}</div>
              <div style={{ width: 40, height: 40, borderRadius: "var(--r-md)", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {s.icon}
              </div>
            </div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Form */}
      <div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          New Submission
        </h2>
        <WasteForm />
      </div>
    </>
  );
}
