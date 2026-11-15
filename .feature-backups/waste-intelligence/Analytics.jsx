import { useEffect, useState } from "react";
import { BarChart3, CircleDollarSign, Factory, Leaf, TrendingUp, Inbox } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { getWasteIntelligence } from "../../api/adminApi.js";

const CHART_COLORS = ["#16a34a", "#3b82f6", "#f59e0b", "#8b5cf6", "#10b981", "#ef4444"];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getWasteIntelligence()
      .then((response) => {
        if (active) setData(response.data?.data || null);
      })
      .catch(() => {
        if (active) setError("Unable to load waste intelligence right now.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <section className="panel"><h1>Waste Intelligence</h1><p>Loading analytics…</p></section>;
  }

  if (error || !data) {
    return <section className="panel"><h1>Waste Intelligence</h1><p>{error || "No verified data available."}</p></section>;
  }

  const materialChart = data.materialBreakdown || [];
  const brandChart = (data.brands?.breakdown || []).slice(0, 5);

  return (
    <section className="panel">
      <div className="dashboard-header" style={{ marginBottom: 16 }}>
        <div>
          <h1 className="page-title">Waste Intelligence</h1>
          <p className="page-subtitle">Verified waste material and brand analytics for operational reporting.</p>
        </div>
      </div>

      <div className="dash-kpi-row">
        {[
          { icon: Leaf, bg: "#f0fdf4", ic: "var(--g-600)", label: "Verified Waste", value: `${data.summary?.totalVerifiedWasteKg ?? 0} kg`, trend: "Verified records only" },
          { icon: Inbox, bg: "#eff6ff", ic: "#3b82f6", label: "Transactions", value: data.summary?.verifiedTransactionCount ?? 0, trend: "Duplicate-free count" },
          { icon: BarChart3, bg: "#fef9c3", ic: "#d97706", label: "Materials", value: materialChart.length, trend: "Categories tracked" },
          { icon: TrendingUp, bg: "#fdf4ff", ic: "#a21caf", label: "Avg / Txn", value: `${data.summary?.averageWeightPerTransactionKg ?? 0} kg`, trend: "Per verified submission" },
        ].map((item) => (
          <div key={item.label} className="kpi-card animate-fade-up">
            <div className="kpi-card-header">
              <div>
                <div className="kpi-label">{item.label}</div>
                <div className="kpi-value" style={{ marginTop: 6 }}>{item.value}</div>
              </div>
              <div className="kpi-icon" style={{ background: item.bg }}><item.icon size={20} style={{ color: item.ic }} /></div>
            </div>
            <div className="kpi-trend up">{item.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="chart-container">
          <div className="chart-title">Material composition</div>
          <div className="chart-sub">Verified collection share by material</div>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={materialChart} dataKey="percentage" nameKey="material" innerRadius={40} outerRadius={75} paddingAngle={3}>
                {materialChart.map((entry, index) => <Cell key={entry.material} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <div className="chart-title">Material quantities</div>
          <div className="chart-sub">Total verified kilograms by material</div>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={materialChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="material" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} kg`, "Total"]} />
              <Bar dataKey="totalKg" fill="#22c55e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="card">
          <div className="section-header"><span className="section-title">Top brands by verified quantity</span></div>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Brand</th><th>Weight</th><th>Transactions</th></tr></thead>
              <tbody>
                {brandChart.map((brand) => (
                  <tr key={brand.brandName}>
                    <td>{brand.brandName}</td>
                    <td>{brand.totalKg} kg</td>
                    <td>{brand.transactionCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="section-header"><span className="section-title">Insights</span></div>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
            <li>
              {data.insights?.highestWeightBrand
                ? `${data.insights.highestWeightBrand.brandName} leads by verified waste weight.`
                : "No verified brand contribution is available yet."}
            </li>
            <li>
              {data.insights?.mostFrequentlyIdentifiedBrand
                ? `${data.insights.mostFrequentlyIdentifiedBrand.brandName} is the most frequently identified brand.`
                : "No recurring brand pattern is visible in confirmed records."}
            </li>
            <li>{`Unknown or unconfirmed brand share: ${data.brands?.unknownBrandShare ?? 0}%`}</li>
            <li>{`Average verified quantity per transaction: ${data.summary?.averageWeightPerTransactionKg ?? 0} kg`}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
