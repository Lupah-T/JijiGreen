import { useAuth } from "../../hooks/useAuth.js";
import EcoPoints from "../../components/student/EcoPoints.jsx";
import StudentCard from "../../components/student/StudentCard.jsx";
import Leaderboard from "../../components/student/Leaderboard.jsx";
import { Recycle, TrendingUp, Leaf } from "lucide-react";

// Demo leaderboard data for presentation
const DEMO_ENTRIES = [
  { _id: "1", user: { name: "Amina Odhiambo", school: "Westlands Academy" }, points: 3420 },
  { _id: "2", user: { name: "Brian Mutua",    school: "Nairobi High School" }, points: 2870 },
  { _id: "3", user: { name: "Chloe Wanjiku",  school: "Karen C School" },      points: 2150 },
  { _id: "4", user: { name: "David Kamau",    school: "Strathmore Prep" },      points: 1600 },
  { _id: "5", user: { name: "Eve Adhiambo",   school: "Lavington School" },     points: 980  },
];

const DEMO_ACTIVITY = [
  { id: 1, text: "Submitted 1.2 kg of plastic bottles", time: "Today, 10:34 AM", pts: "+24" },
  { id: 2, text: "Earned 'Recycler' badge",             time: "Yesterday, 4:10 PM", pts: "+10" },
  { id: 3, text: "Redeemed Safaricom 50 Airtime",       time: "Mon, 9:00 AM",     pts: "-200" },
  { id: 4, text: "Submitted 0.8 kg aluminium cans",    time: "Sun, 2:45 PM",      pts: "+16" },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const points = user?.ecoPoints || 0;

  return (
    <>
      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 className="page-title">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}! 👋
          </h1>
          <p style={{ color: "var(--clr-muted)", marginTop: 4 }}>
            Here&apos;s your recycling impact at a glance.
          </p>
        </div>
        <button className="button" style={{ flexShrink: 0 }}>
          <Recycle size={16} /> Submit Waste
        </button>
      </div>

      {/* Top stats row */}
      <div className="dashboard-grid-3">
        {[
          { icon: <Recycle  size={22} style={{ color: "#16a34a" }} />, bg: "#f0fdf4", label: "Total Submissions",   value: "12",     trend: "+3 this week" },
          { icon: <TrendingUp size={22} style={{ color: "#3b82f6" }} />, bg: "#eff6ff", label: "Kg Collected",       value: "8.4 kg", trend: "+1.2 kg this week" },
          { icon: <Leaf     size={22} style={{ color: "#84cc16" }} />, bg: "#f7fee7", label: "Trees Sponsored",    value: "2",      trend: "Keep going!" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card fade-in">
            <div className="stat-card-header">
              <div className="stat-label">{stat.label}</div>
              <div style={{ width: 40, height: 40, borderRadius: "var(--r-md)", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {stat.icon}
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-trend up">{stat.trend}</div>
          </div>
        ))}
      </div>

      {/* Main grid: EcoPoints + StudentCard */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <EcoPoints points={points} />
        <StudentCard student={user} points={points} />
      </div>

      {/* Bottom grid: Leaderboard + Activity */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <Leaderboard entries={DEMO_ENTRIES} title="Top Recyclers" />

        {/* Recent Activity */}
        <div className="panel">
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>
            Recent Activity
          </h3>
          {DEMO_ACTIVITY.map((a) => (
            <div key={a.id} className="activity-item">
              <div className="activity-dot" />
              <div style={{ flex: 1 }}>
                <div className="activity-text">{a.text}</div>
                <div className="activity-time">{a.time}</div>
              </div>
              <span style={{
                fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 14,
                color: a.pts.startsWith("+") ? "var(--clr-emerald)" : "var(--clr-danger)",
              }}>
                {a.pts} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
