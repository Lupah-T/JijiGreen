import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Gift, Plus, Search, ShoppingBag, Smartphone, Sprout, TrendingUp } from "lucide-react";
import { getRewards } from "../../api/rewardsApi.js";

function deriveCategory(title = "") {
  const text = title.toLowerCase();
  if (text.includes("airtime")) return { label: "Airtime", icon: Smartphone };
  if (text.includes("voucher") || text.includes("shop")) return { label: "Shopping", icon: ShoppingBag };
  if (text.includes("tree") || text.includes("sponsor")) return { label: "Impact", icon: Sprout };
  return { label: "Badge", icon: BadgeCheck };
}

export default function RewardsManagement() {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    getRewards()
      .then(({ data }) => {
        if (!active) return;
        setRewards(data.data || data || []);
      })
      .catch(() => {
        if (active) setRewards([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const inventory = useMemo(() => rewards.filter((reward) => !search.trim() || reward.title.toLowerCase().includes(search.trim().toLowerCase())), [rewards, search]);
  const activeRewards = inventory.filter((reward) => reward.active !== false).length;
  const totalStock = inventory.reduce((sum, reward) => sum + Number(reward.stock || 0), 0);
  const avgCost = inventory.length ? Math.round(inventory.reduce((sum, reward) => sum + Number(reward.pointsCost || 0), 0) / inventory.length) : 0;

  if (loading) {
    return <div className="loader"><span className="spinner" /> Loading rewards...</div>;
  }

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Reward Management</h1>
          <p className="page-subtitle">Manage reward inventory, redemption economics, and marketplace visibility.</p>
        </div>
        <button className="btn btn-primary"><Plus size={15} /> New reward</button>
      </div>

      <div className="dash-kpi-row">
        {[
          { label: "Active rewards", value: String(activeRewards), icon: Gift, bg: "#f0fdf4", color: "var(--g-600)" },
          { label: "Total stock", value: String(totalStock), icon: TrendingUp, bg: "#eff6ff", color: "#2563eb" },
          { label: "Avg points cost", value: String(avgCost), icon: BadgeCheck, bg: "#fef9c3", color: "#d97706" },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div className="kpi-card" key={label}>
            <div className="kpi-card-header">
              <div><div className="kpi-label">{label}</div><div className="kpi-value" style={{ marginTop: 6 }}>{value}</div></div>
              <div className="kpi-icon" style={{ background: bg }}><Icon size={20} style={{ color }} /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-header">
          <span className="section-title">Marketplace Inventory</span>
          <div style={{ position: "relative", width: "min(100%, 280px)" }}>
            <input className="input" placeholder="Search rewards..." value={search} onChange={(event) => setSearch(event.target.value)} style={{ paddingLeft: 38 }} />
            <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-soft)" }} />
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Reward</th><th>Category</th><th>Points</th><th>Stock</th><th>Status</th><th>Health</th></tr></thead>
            <tbody>
              {inventory.map((reward) => {
                const { label, icon: Icon } = deriveCategory(reward.title || "");
                const status = reward.active === false ? "Draft" : "Live";
                return (
                <tr key={reward._id || reward.title}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 12, background: "var(--g-50)", color: "var(--g-700)", display: "grid", placeItems: "center" }}><Icon size={18} /></div>
                      <span style={{ fontWeight: 800 }}>{reward.title}</span>
                    </div>
                  </td>
                  <td>{label}</td>
                  <td style={{ fontFamily: "var(--font-heading)", fontWeight: 900 }}>{reward.pointsCost}</td>
                  <td>{reward.stock}</td>
                  <td><span className={`badge ${status === "Live" ? "badge-green" : "badge-gray"}`}>{status}</span></td>
                  <td>
                    <div className="progress-track" style={{ width: 120 }}>
                      <div className="progress-fill" style={{ width: `${Math.min(Number(reward.stock || 0) * 10, 100)}%` }} />
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
