import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  XCircle,
} from "lucide-react";
import {
  getCollectionHistory,
  verifyWaste,
} from "../../api/collectorApi.js";

export default function VerifyWaste() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    try {
      setError("");
      const response = await getCollectionHistory();
      const records = Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      setSubmissions(records.filter((item) => item.status === "pending"));
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load pending submissions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const processSubmission = async (id, status) => {
    setProcessingId(id);
    setError("");
    setNotice("");

    try {
      const response = await verifyWaste(id, { status });
      setNotice(response.data?.message || "Submission processed.");
      await refresh();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to process this submission."
      );
    } finally {
      setProcessingId("");
    }
  };

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Verify Waste</h1>
          <p className="page-subtitle">
            Review submitted waste records and confirm or reject each one.
          </p>
        </div>
        <button className="btn btn-sm" onClick={refresh} disabled={loading}>
          Refresh queue
        </button>
      </div>

      {error && (
        <div className="alert" style={{ color: "#b91c1c", marginBottom: 14 }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {notice && (
        <div className="alert success" style={{ marginBottom: 14 }}>
          {notice}
        </div>
      )}

      <div className="card">
        <div className="section-header">
          <span className="section-title">Pending Approval Queue</span>
          <span className="badge badge-amber">
            {loading ? "Loading..." : `${submissions.length} pending`}
          </span>
        </div>

        {loading && (
          <div className="empty-state">
            <LoaderCircle size={25} className="animate-spin" />
            <div>Loading submissions...</div>
          </div>
        )}

        {!loading && submissions.length === 0 && (
          <div className="empty-state">
            <Clock3 size={30} />
            <div className="empty-state-title">Queue is clear</div>
            <div className="empty-state-sub">
              There are no pending submissions assigned to your account.
            </div>
          </div>
        )}

        {submissions.map((item) => {
          const materialAI = item.aiMaterialPrediction;
          const brandAI = item.aiBrandPrediction;

          return (
            <article
              key={item._id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--r-md)",
                padding: 16,
                marginBottom: 12,
                display: "grid",
                gap: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <strong>{item.student?.name || "Student"}</strong>
                  <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                    {item.student?.email || ""}
                  </div>
                </div>
                <span className="badge badge-amber">Pending review</span>
              </div>

              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <span>
                  **Material:** {item.materialCategory || item.wasteType}
                </span>
                <span>**Weight:** {item.weightKg} kg</span>
                <span>
                  **Submitted:** {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>

              {item.imageUrl && (
                <a
                  href={`${import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:5000"}${item.imageUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View submitted image
                </a>
              )}

              {materialAI && (
                <div
                  style={{
                    background: "var(--g-50)",
                    borderRadius: 8,
                    padding: 10,
                    fontSize: 13,
                  }}
                >
                  <strong>AI material suggestion:</strong>{" "}
                  {materialAI.predicted_material ||
                    materialAI.material ||
                    "Not specified"}
                  {typeof materialAI.confidence === "number" &&
                    ` · ${(materialAI.confidence * 100).toFixed(1)}% confidence`}
                  <div style={{ color: "var(--text-muted)", marginTop: 4 }}>
                    AI output is advisory; verify against the actual item.
                  </div>
                </div>
              )}

              {brandAI && (
                <div style={{ fontSize: 13 }}>
                  <strong>Experimental brand suggestion:</strong>{" "}
                  {brandAI.predicted_brand || brandAI.brand || "Available"}
                  <div style={{ color: "var(--text-muted)" }}>
                    Not a confirmed brand record.
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={processingId === item._id}
                  onClick={() => processSubmission(item._id, "verified")}
                >
                  {processingId === item._id ? (
                    <LoaderCircle size={14} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                  Verify and award points
                </button>

                <button
                  className="btn btn-sm"
                  disabled={processingId === item._id}
                  onClick={() => processSubmission(item._id, "rejected")}
                  style={{
                    background: "var(--bg-subtle)",
                    color: "var(--text-muted)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}


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
