import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Download, Filter, Recycle, Search } from "lucide-react";
import { getStudentHistory } from "../../api/studentApi.js";

const STATUS_LABEL = {
  verified: "Verified",
  pending: "Pending",
  rejected: "Rejected",
};

const statusClass = (status) => (status === "verified" ? "badge-green" : status === "pending" ? "badge-amber" : "badge-red");

const formatSubmissionId = (submission) => `JG-${String(submission._id || "").slice(-4).toUpperCase()}`;

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    getStudentHistory()
      .then(({ data }) => {
        if (!active) return;
        setHistory(data.data || data || []);
      })
      .catch(() => {
        if (active) setHistory([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const submissions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return history.filter((submission) => {
      const pointName = submission.collectionPoint?.name || "";
      const wasteType = submission.wasteType || "";
      return !query || pointName.toLowerCase().includes(query) || wasteType.toLowerCase().includes(query);
    });
  }, [history, search]);

  const stats = useMemo(() => {
    const verified = history.filter((submission) => submission.status === "verified");
    return {
      total: history.length,
      verifiedRate: history.length ? Math.round((verified.length / history.length) * 100) : 0,
      pending: history.filter((submission) => submission.status === "pending").length,
    };
  }, [history]);

  if (loading) {
    return <div className="loader"><span className="spinner" /> Loading history...</div>;
  }

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
          { label: "Total submissions", value: String(stats.total), icon: Recycle, bg: "#f0fdf4", color: "var(--g-600)" },
          { label: "Verified rate", value: `${stats.verifiedRate}%`, icon: CheckCircle2, bg: "#eff6ff", color: "#2563eb" },
          { label: "Pending review", value: String(stats.pending), icon: Clock3, bg: "#fffbeb", color: "#d97706" },
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
          <input className="input" placeholder="Search submission, collection point, or material..." value={search} onChange={(event) => setSearch(event.target.value)} style={{ paddingLeft: 40 }} />
          <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-soft)" }} />
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>ID</th><th>Material</th><th>Collection Point</th><th>Weight</th><th>Points</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id}>
                  <td style={{ fontWeight: 800 }}>{formatSubmissionId(submission)}</td>
                  <td>{submission.wasteType}</td>
                  <td style={{ color: "var(--text-muted)" }}>{submission.collectionPoint?.name || "—"}</td>
                  <td>{Number(submission.weightKg || 0).toFixed(1)} kg</td>
                  <td style={{ fontFamily: "var(--font-heading)", fontWeight: 800, color: "var(--g-700)" }}>+{submission.pointsAwarded || 0}</td>
                  <td><span className={`badge ${statusClass(submission.status)}`}>{STATUS_LABEL[submission.status] || submission.status}</span></td>
                  <td style={{ color: "var(--text-soft)" }}>{new Date(submission.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {!submissions.length ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "24px 12px", color: "var(--text-soft)" }}>
                    No submissions match this search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
