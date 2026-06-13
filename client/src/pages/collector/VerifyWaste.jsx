

    import { useEffect, useState } from "react";
    import { AlertTriangle, CheckSquare, Clock3, QrCode, Scale, ScanLine, X } from "lucide-react";
    import { getPendingSubmissions } from "../../api/collectorApi.js";

    const calculatePoints = (submission) => Math.max(0, Math.round(Number(submission.weightKg || 0) * 10));

    export default function VerifyWaste() {
      const [queue, setQueue] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        let active = true;

        getPendingSubmissions()
          .then(({ data }) => {
            if (!active) return;
            setQueue(data.data || data || []);
          })
          .catch(() => {
            if (active) setQueue([]);
          })
          .finally(() => {
            if (active) setLoading(false);
          });

        return () => {
          active = false;
        };
      }, []);

      return (
        <>
          <div className="dashboard-header">
            <div>
              <h1 className="page-title">Verify Waste</h1>
              <p className="page-subtitle">Fast QR scanning and approval workflow for collection agents.</p>
            </div>
          </div>

          <div className="grid-2">
            <div className="card" style={{ minHeight: 420 }}>
              <div className="section-header">
                <span className="section-title">Scanner</span>
                <span className="badge badge-green">Ready</span>
              </div>
              <div style={{ border: "1.5px dashed var(--border-g)", borderRadius: 24, minHeight: 280, display: "grid", placeItems: "center", background: "linear-gradient(135deg,var(--g-50),rgba(255,255,255,.75))" }}>
                <div style={{ textAlign: "center", display: "grid", gap: 12, justifyItems: "center" }}>
                  <div style={{ width: 86, height: 86, borderRadius: 28, background: "#fff", display: "grid", placeItems: "center", boxShadow: "var(--shadow-md)" }}>
                    <ScanLine size={38} style={{ color: "var(--g-700)" }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 20 }}>Scan student QR</div>
                    <p style={{ color: "var(--text-muted)", maxWidth: 300, marginTop: 4 }}>Use a connected device camera or manually enter Eco ID below.</p>
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>
                <div className="field">
                  <label className="field-label">Eco ID</label>
                  <div style={{ position: "relative" }}>
                    <input className="input" placeholder="ECO-9A31C2" style={{ paddingRight: 42 }} />
                    <QrCode size={16} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-soft)" }} />
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">Weight</label>
                  <div style={{ position: "relative" }}>
                    <input className="input" placeholder="0.0 kg" style={{ paddingRight: 42 }} />
                    <Scale size={16} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-soft)" }} />
                  </div>
                </div>
              </div>
              <button className="btn btn-primary" style={{ width: "100%", marginTop: 16 }}><CheckSquare size={16} /> Approve verified waste</button>
            </div>

            <div className="card">
              <div className="section-header">
                <span className="section-title">Approval Queue</span>
                <span className="badge badge-amber">{queue.length} pending</span>
              </div>
              {loading ? (
                <div className="loader" style={{ minHeight: 180 }}><span className="spinner" /> Loading queue...</div>
              ) : queue.length ? queue.map((item) => (
                <div key={item._id} style={{ padding: 14, border: `1px solid ${Number(item.weightKg || 0) >= 3 ? "#fecaca" : "var(--border)"}`, borderRadius: 16, marginBottom: 12, background: Number(item.weightKg || 0) >= 3 ? "#fef2f2" : "var(--bg-card)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontWeight: 900 }}>{item.student?.name || "Unknown student"}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{item.wasteType} · {Number(item.weightKg || 0).toFixed(1)} kg · {new Date(item.createdAt).toLocaleString()}</div>
                      <div style={{ color: "var(--text-soft)", fontSize: 12, marginTop: 2 }}>{item.collectionPoint?.name || "Assigned collection point"}</div>
                    </div>
                    {Number(item.weightKg || 0) >= 3 ? <span className="fraud-badge"><AlertTriangle size={12} /> High risk</span> : <span className="badge badge-green">Low risk</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, color: "var(--g-700)" }}>{calculatePoints(item)} pts</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-primary btn-sm"><CheckSquare size={13} /> Approve</button>
                      <button className="btn btn-sm" style={{ background: "var(--bg-subtle)", color: "var(--text-muted)", border: "1px solid var(--border)" }}><X size={13} /> Reject</button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="empty-state" style={{ padding: "22px 12px" }}>
                  <Clock3 size={28} style={{ color: "var(--text-soft)", marginBottom: 8 }} />
                  <div className="empty-state-title" style={{ fontSize: 15 }}>No pending submissions</div>
                  <div className="empty-state-sub">Pending waste drops assigned to this collector will appear here.</div>
                </div>
              )}
            </div>
          </div>
        </>
      );
    }
