import AnalyticsCard from "../../components/admin/AnalyticsCard.jsx";
import { Users, School, Recycle, Star, Download } from "lucide-react";

const RECENT_USERS = [
  { name: "Amina Odhiambo", role: "student",   school: "Westlands Academy",  joined: "Today"      },
  { name: "Brian Mutua",    role: "collector",  school: "—",                  joined: "Yesterday"  },
  { name: "Chloe Wanjiku",  role: "student",   school: "Karen C School",      joined: "2 days ago" },
  { name: "David Kamau",    role: "student",   school: "Strathmore Prep",     joined: "3 days ago" },
];

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

export default function AdminDashboard() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p style={{ color: "var(--clr-muted)", marginTop: 4 }}>Platform overview and management</p>
        </div>
        <button className="button-outline" style={{ gap: 8 }}>
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="dashboard-grid-4">
        <AnalyticsCard label="Total Students"   value="248"     trend="+12 this month" trendUp colorIndex={0} icon={<Users    size={20} />} />
        <AnalyticsCard label="Partner Schools"  value="47"      trend="+3 this month"  trendUp colorIndex={1} icon={<School   size={20} />} />
        <AnalyticsCard label="Waste Collected"  value="2.1 t"   trend="+340 kg"        trendUp colorIndex={2} icon={<Recycle  size={20} />} />
        <AnalyticsCard label="Points Awarded"   value="82,400"  trend="+6,200 this week" trendUp colorIndex={3} icon={<Star    size={20} />} />
      </div>

      {/* Recent registrations */}
      <div className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 17, fontWeight: 700, margin: 0 }}>
            Recent Registrations
          </h3>
          <a href="/admin/users" style={{ fontSize: 13, color: "var(--clr-emerald)", fontWeight: 600 }}>View all →</a>
        </div>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>School</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_USERS.map((u) => (
                <tr key={u.name}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--clr-emerald), var(--clr-lime))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700, color: "white", flexShrink: 0,
                      }}>{getInitials(u.name)}</div>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${u.role === "admin" ? "badge-blue" : u.role === "collector" ? "badge-gold" : "badge-green"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ color: "var(--clr-muted)" }}>{u.school}</td>
                  <td style={{ color: "var(--clr-subtle)", fontSize: 13 }}>{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
