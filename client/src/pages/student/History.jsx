import { CheckCircle2, Clock3, Download, Filter, Recycle, Search } from "lucide-react";

const SUBMISSIONS = [
  { id: "JG-1048", type: "Plastic bottles", point: "Naivas Westlands", kg: 1.8, pts: 36, status: "Verified", date: "Today, 10:34 AM" },
  { id: "JG-1039", type: "Aluminium cans", point: "UoN Main Campus", kg: 0.7, pts: 21, status: "Verified", date: "Yesterday, 4:10 PM" },
  { id: "JG-1025", type: "Paper bundle", point: "Sarit Centre Kiosk", kg: 2.4, pts: 24, status: "Pending", date: "Mon, 9:00 AM" },
  { id: "JG-1017", type: "Glass bottles", point: "Naivas Westlands", kg: 1.1, pts: 17, status: "Verified", date: "Sun, 2:45 PM" },
];

export default function History() {
  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Submission History</h1>
          <p className="page-subtitle">Track verified drop-offs, pending checks, and earned eco-points.</p>
        </div>
        <button className="btn btn-outline"><Download size={15} /> Export</button>
      </div>

      <div className="dash-kpi-row">
        {[
          { label: "Total submissions", value: "24", icon: Recycle, bg: "#f0fdf4", color: "var(--g-600)" },
          { label: "Verified rate", value: "96%", icon: CheckCircle2, bg: "#eff6ff", color: "#2563eb" },
          { label: "Pending review", value: "1", icon: Clock3, bg: "#fffbeb", color: "#d97706" },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div className="kpi-card" key={label}>
            <div className="kpi-card-header">
              <div>
                <div className="kpi-label">{label}</div>
                <div className="kpi-value" style={{ marginTop: 6 }}>{value}</div>
              </div>
              <div className="kpi-icon" style={{ background: bg }}><Icon size={20} style={{ color }} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-header">
          <span className="section-title">Recycling Records</span>
          <button className="tag tag-inactive"><Filter size={13} /> Filter</button>
        </div>
        <div style={{ position: "relative", marginBottom: 16 }}>
          <input className="input" placeholder="Search submission, collection point, or material..." style={{ paddingLeft: 40 }} />
          <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-soft)" }} />
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>ID</th><th>Material</th><th>Collection Point</th><th>Weight</th><th>Points</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {SUBMISSIONS.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 800 }}>{s.id}</td>
                  <td>{s.type}</td>
                  <td style={{ color: "var(--text-muted)" }}>{s.point}</td>
                  <td>{s.kg} kg</td>
                  <td style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "var(--g-700)" }}>+{s.pts}</td>
                  <td><span className={`badge ${s.status === "Verified" ? "badge-green" : "badge-amber"}`}>{s.status}</span></td>
                  <td style={{ color: "var(--text-soft)" }}>{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
