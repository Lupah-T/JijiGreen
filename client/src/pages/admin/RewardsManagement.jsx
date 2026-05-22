import { BadgeCheck, Gift, Plus, Search, ShoppingBag, Smartphone, Sprout, TrendingUp } from "lucide-react";

const REWARDS = [
  { name: "Safaricom 50 Airtime", category: "Airtime", stock: 240, redeemed: 86, points: 200, icon: Smartphone, status: "Live" },
  { name: "Naivas KES 100 Voucher", category: "Shopping", stock: 120, redeemed: 42, points: 450, icon: ShoppingBag, status: "Live" },
  { name: "Tree Planting Sponsorship", category: "Impact", stock: 800, redeemed: 134, points: 300, icon: Sprout, status: "Live" },
  { name: "Green Ambassador Badge", category: "Badge", stock: 99, redeemed: 18, points: 500, icon: BadgeCheck, status: "Draft" },
];

export default function RewardsManagement() {
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
          { label: "Active rewards", value: "18", icon: Gift, bg: "#f0fdf4", color: "var(--g-600)" },
          { label: "Redemptions", value: "1,248", icon: TrendingUp, bg: "#eff6ff", color: "#2563eb" },
          { label: "Avg points cost", value: "420", icon: BadgeCheck, bg: "#fef9c3", color: "#d97706" },
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
            <input className="input" placeholder="Search rewards..." style={{ paddingLeft: 38 }} />
            <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--text-soft)" }} />
          </div>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Reward</th><th>Category</th><th>Points</th><th>Stock</th><th>Redeemed</th><th>Status</th><th>Health</th></tr></thead>
            <tbody>
              {REWARDS.map(({ name, category, stock, redeemed, points, icon: Icon, status }) => (
                <tr key={name}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 12, background: "var(--g-50)", color: "var(--g-700)", display: "grid", placeItems: "center" }}><Icon size={18} /></div>
                      <span style={{ fontWeight: 800 }}>{name}</span>
                    </div>
                  </td>
                  <td>{category}</td>
                  <td style={{ fontFamily: "var(--font-heading)", fontWeight: 900 }}>{points}</td>
                  <td>{stock}</td>
                  <td>{redeemed}</td>
                  <td><span className={`badge ${status === "Live" ? "badge-green" : "badge-gray"}`}>{status}</span></td>
                  <td>
                    <div className="progress-track" style={{ width: 120 }}>
                      <div className="progress-fill" style={{ width: `${Math.min((stock / (stock + redeemed)) * 100, 100)}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
