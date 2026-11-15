import { useEffect, useState } from "react";
import { BarChart3, Inbox, Leaf, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  XAxis, YAxis, CartesianGrid, LineChart, Line,
} from "recharts";
import { getWasteIntelligence } from "../../api/adminApi.js";

const COLORS = ["#16a34a", "#3b82f6", "#f59e0b", "#8b5cf6", "#10b981", "#ef4444"];

const formatKg = (value) => `${Number(value || 0).toLocaleString()} kg`;

function BrandTable({ title, records, description }) {
  return (
    <div className="card">
      <div className="section-header">
        <span className="section-title">{title}</span>
      </div>
      <p className="chart-sub">{description}</p>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>Brand</th><th>Weight</th><th>Submissions</th></tr>
          </thead>
          <tbody>
            {records.length ? records.map((brand) => (
              <tr key={brand.brandName}>
                <td>{brand.brandName}</td>
                <td>{formatKg(brand.totalKg)}</td>
                <td>{brand.transactionCount}</td>
              </tr>
            )) : (
              <tr><td colSpan="3">No records available.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getWasteIntelligence()
      .then((response) => {
        if (active) setData(response.data?.data ?? null);
      })
      .catch((err) => {
        if (active) {
          setError(
            err.response?.data?.message ||
            "Unable to load waste intelligence right now."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  if (loading) {
    return <section className="panel"><h1>Waste Intelligence</h1><p>Loading analytics…</p></section>;
  }

  if (error || !data) {
    return <section className="panel"><h1>Waste Intelligence</h1><p>{error || "No analytics data available."}</p></section>;
  }

  const summary = data.summary ?? {};
  const materials = data.materialBreakdown ?? [];
  const brands = data.brands ?? {};
  const trends = data.timeBreakdown ?? [];

  const kpis = [
    { icon: Leaf, label: "Verified Waste", value: formatKg(summary.totalVerifiedWasteKg), note: "Verified submissions only", bg: "#f0fdf4", color: "#16a34a" },
    { icon: Inbox, label: "Transactions", value: summary.verifiedTransactionCount ?? 0, note: "Verified submissions", bg: "#eff6ff", color: "#3b82f6" },
    { icon: BarChart3, label: "Materials", value: materials.length, note: "Material categories recorded", bg: "#fef9c3", color: "#d97706" },
    { icon: TrendingUp, label: "Average / transaction", value: formatKg(summary.averageWeightPerTransactionKg), note: "Average verified weight", bg: "#fdf4ff", color: "#a21caf" },
  ];

  return (
    <section className="panel">
      <div className="dashboard-header" style={{ marginBottom: 16 }}>
        <div>
          <h1 className="page-title">Waste Intelligence</h1>
          <p className="page-subtitle">
            Analytics calculated from verified waste submissions.
          </p>
          {data.generatedAt && (
            <p className="chart-sub">
              Generated: {new Date(data.generatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="dash-kpi-row">
        {kpis.map((item) => (
          <div key={item.label} className="kpi-card animate-fade-up">
            <div className="kpi-card-header">
              <div>
                <div className="kpi-label">{item.label}</div>
                <div className="kpi-value" style={{ marginTop: 6 }}>{item.value}</div>
              </div>
              <div className="kpi-icon" style={{ background: item.bg }}>
                <item.icon size={20} style={{ color: item.color }} />
              </div>
            </div>
            <div className="kpi-trend">{item.note}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="chart-container">
          <div className="chart-title">Material composition</div>
          <div className="chart-sub">Share of verified waste by weight</div>
          {materials.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={materials} dataKey="percentage" nameKey="material" innerRadius={42} outerRadius={78}>
                  {materials.map((item, index) => (
                    <Cell key={item.material} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p>No verified material data yet.</p>}
        </div>

        <div className="chart-container">
          <div className="chart-title">Material quantities</div>
          <div className="chart-sub">Verified kilograms by material</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={materials}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="material" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => [formatKg(value), "Weight"]} />
              <Bar dataKey="totalKg" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container" style={{ marginTop: 20 }}>
        <div className="chart-title">Collection trend</div>
        <div className="chart-sub">Verified waste weight by collection month</div>
        {trends.length ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => [formatKg(value), "Weight"]} />
              <Line type="monotone" dataKey="totalKg" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        ) : <p>No dated verified records are available for the trend chart.</p>}
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <BrandTable
          title="Collector-confirmed brands"
          description="Brands explicitly recorded by collectors. These are separate from model predictions."
          records={brands.confirmedBreakdown ?? []}
        />
        <BrandTable
          title="AI-predicted brands"
          description="Experimental model predictions above the configured confidence threshold. These are not collector-confirmed."
          records={brands.predictedBreakdown ?? []}
        />
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-header">
          <span className="section-title">Brand identification quality</span>
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
          <li>Collector-confirmed: {brands.confirmedShare ?? 0}% of verified submissions.</li>
          <li>AI-predicted: {brands.predictedShare ?? 0}% of verified submissions.</li>
          <li>Unknown: {brands.unknownBrandShare ?? 0}% of verified submissions.</li>
          <li>
            {data.insights?.highestWeightConfirmedBrand
              ? `${data.insights.highestWeightConfirmedBrand.brandName} has the highest collector-confirmed brand weight.`
              : "There are no collector-confirmed brand records yet."}
          </li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-header">
          <span className="section-title">Environmental impact estimates</span>
        </div>
        <p>
          {data.environmentalImpact?.message ||
            "Environmental impact estimates are currently unavailable."}
        </p>
        <p className="chart-sub">
          Waste weight is not automatically equivalent to emissions avoided.
          No carbon savings are claimed by this dashboard.
        </p>
      </div>
    </section>
  );
}
