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
