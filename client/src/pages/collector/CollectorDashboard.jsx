import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Recycle,
  Scale,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getCollectionHistory, getPendingSubmissions } from "../../api/collectorApi.js";
import { getCollectionPoints } from "../../api/collectionPointApi.js";
import WasteForm from "../../components/collector/WasteForm.jsx";

const unwrap = (response) =>
  Array.isArray(response?.data?.data) ? response.data.data : [];

const buildChartData = (submissions = []) => {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const totals = new Map(labels.map((label) => [label, 0]));

  submissions
    .filter((submission) => submission.status === "verified")
    .forEach((submission) => {
      const label = new Date(submission.verifiedAt || submission.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
      });

      if (totals.has(label)) {
        totals.set(label, totals.get(label) + Number(submission.weightKg || 0));
      }
    });

  return labels.map((label) => ({
    day: label,
    kg: Number((totals.get(label) || 0).toFixed(2)),
  }));
};

export default function CollectorDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [pending, setPending] = useState([]);
  const [collectionPoints, setCollectionPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setError("");
      const [historyRes, pendingRes, pointsRes] = await Promise.all([
        getCollectionHistory(),
        getPendingSubmissions(),
        getCollectionPoints(),
      ]);

      setSubmissions(unwrap(historyRes));
      setPending(unwrap(pendingRes));
      setCollectionPoints(unwrap(pointsRes));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load collector activity.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = window.setInterval(refresh, 10000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  const today = new Date();
  const verifiedToday = submissions.filter((item) => {
    if (item.status !== "verified" || !item.verifiedAt) return false;
    const date = new Date(item.verifiedAt);
    return date.toDateString() === today.toDateString();
  });

  const totalVerifiedKg = submissions
    .filter((item) => item.status === "verified")
    .reduce((total, item) => total + Number(item.weightKg || 0), 0);

  const totalPoints = submissions
    .filter((item) => item.status === "verified")
    .reduce((total, item) => total + Number(item.pointsAwarded || 0), 0);

  const chartData = useMemo(() => buildChartData(submissions), [submissions]);

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Collector Dashboard</h1>
          <p className="page-subtitle">
            Record collections, review AI suggestions and verify submissions.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert" style={{ color: "#b91c1c", marginBottom: 16 }}>
          <AlertCircle size={15} /> {error}
          <button className="btn btn-sm" onClick={refresh}>Retry</button>
        </div>
      )}

      <div className="dash-kpi-row">
        {[
          {
            icon: CheckCircle2,
            label: "Verified Today",
            value: loading ? "—" : verifiedToday.length,
            color: "var(--g-600)",
            bg: "#f0fdf4",
          },
          {
            icon: Scale,
            label: "Verified Weight",
            value: loading ? "—" : `${totalVerifiedKg.toFixed(1)} kg`,
            color: "#2563eb",
            bg: "#eff6ff",
          },
          {
            icon: Clock,
            label: "Pending",
            value: loading ? "—" : pending.length,
            color: "#d97706",
            bg: "#fffbeb",
          },
          {
            icon: Recycle,
            label: "Eco-points Awarded",
            value: loading ? "—" : totalPoints.toLocaleString(),
            color: "var(--g-600)",
            bg: "#f0fdf4",
          },
        ].map((item) => (
          <div className="kpi-card animate-fade-up" key={item.label}>
            <div className="kpi-card-header">
              <div>
                <div className="kpi-label">{item.label}</div>
                <div className="kpi-value" style={{ marginTop: 6 }}>
                  {item.value}
                </div>
              </div>
              <div className="kpi-icon" style={{ background: item.bg }}>
                <item.icon size={20} style={{ color: item.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <WasteForm
          collectionPoints={collectionPoints.filter((point) => point.status === "active")}
          onSubmitted={refresh}
        />

        <div className="card">
          <div className="section-header">
            <span className="section-title">Pending Verifications</span>
            <span className="badge badge-amber">
              {loading ? "Loading..." : `${pending.length} pending`}
            </span>
          </div>

          {!loading && pending.length === 0 && (
            <div className="empty-state">
              <Clock size={28} />
              <div className="empty-state-title">No pending submissions</div>
              <div className="empty-state-sub">
                New submissions awaiting review will appear here.
              </div>
            </div>
          )}

          {!loading && pending.slice(0, 5).map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--r-md)",
                padding: 13,
                marginBottom: 10,
              }}
            >
              <strong>{item.student?.name || "Student"}</strong>
              <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                {item.wasteType || item.materialCategory || "Waste"} · {Number(item.weightKg || 0).toFixed(1)} kg
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          ))}

          <a
            href="/collector/verify-waste"
            className="btn btn-primary btn-sm"
            style={{ display: "inline-flex", marginTop: 8 }}
          >
            Review submissions
          </a>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-title">Weekly Collection Volume</div>
        <div className="chart-sub">
          Verified kilograms over the last seven days
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barSize={32}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--text-soft)" }}
            />
            <YAxis hide />
            <Tooltip formatter={(value) => [`${value} kg`, "Verified weight"]} />
            <Bar dataKey="kg" fill="var(--g-600)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
