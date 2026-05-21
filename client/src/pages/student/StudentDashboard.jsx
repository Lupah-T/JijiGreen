import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import EcoPoints from "../../components/student/EcoPoints.jsx";
import StudentCard from "../../components/student/StudentCard.jsx";
import Leaderboard from "../../components/student/Leaderboard.jsx";
import { Recycle, TrendingUp, Leaf, X, QrCode, Scale, CheckCircle } from "lucide-react";

// Demo leaderboard data for presentation
const DEMO_ENTRIES = [
  { _id: "1", user: { name: "Amina Odhiambo", school: "Westlands Academy" }, points: 3420 },
  { _id: "2", user: { name: "Brian Mutua",    school: "Nairobi High School" }, points: 2870 },
  { _id: "3", user: { name: "Chloe Wanjiku",  school: "Karen C School" },      points: 2150 },
  { _id: "4", user: { name: "David Kamau",    school: "Strathmore Prep" },      points: 1600 },
  { _id: "5", user: { name: "Eve Adhiambo",   school: "Lavington School" },     points: 980  },
];

const DEMO_ACTIVITY = [
  { id: 1, text: "Submitted 1.2 kg of plastic bottles", time: "Today, 10:34 AM",   pts: "+24" },
  { id: 2, text: "Earned 'Recycler' badge",             time: "Yesterday, 4:10 PM", pts: "+10" },
  { id: 3, text: "Redeemed Safaricom 50 Airtime",       time: "Mon, 9:00 AM",       pts: "-200" },
  { id: 4, text: "Submitted 0.8 kg aluminium cans",    time: "Sun, 2:45 PM",        pts: "+16" },
];

const WASTE_TYPES = [
  { value: "plastic",   label: "Plastic Bottles",  emoji: "🧴", pts: "20 pts/kg" },
  { value: "aluminium", label: "Aluminium Cans",   emoji: "🥤", pts: "30 pts/kg" },
  { value: "paper",     label: "Paper / Cardboard",emoji: "📄", pts: "10 pts/kg" },
  { value: "glass",     label: "Glass",            emoji: "🫙", pts: "15 pts/kg" },
];

/* ── Simple Modal wrapper ── */
function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(10,34,24,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="panel scale-in"
        style={{ maxWidth: 520, width: "100%", padding: 28, position: "relative" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 20, fontWeight: 700, margin: 0 }}>{title}</h2>
          <button onClick={onClose} className="button-ghost" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Waste Submission Modal ── */
function SubmitWasteModal({ open, onClose, userName }) {
  const [wasteType, setWasteType] = useState("plastic");
  const [weight, setWeight]       = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!weight || parseFloat(weight) <= 0) return;
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setWeight(""); onClose(); }, 2200);
  };

  return (
    <Modal open={open} onClose={onClose} title="Submit Recyclables">
      {submitted ? (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <CheckCircle size={48} style={{ color: "var(--clr-emerald)", margin: "0 auto 12px" }} />
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
            Submission Sent!
          </div>
          <p style={{ color: "var(--clr-muted)", fontSize: 14 }}>
            A collector will verify your waste and award your eco-points shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
          <p style={{ color: "var(--clr-muted)", fontSize: 14, margin: 0 }}>
            Select the type of waste and enter the weight. A verified collector at your nearest drop-off point will confirm your submission.
          </p>

          {/* Waste type */}
          <div className="field">
            <span>Waste Type</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {WASTE_TYPES.map((w) => (
                <button key={w.value} type="button"
                  onClick={() => setWasteType(w.value)}
                  style={{
                    border: wasteType === w.value ? "2px solid var(--clr-emerald)" : "2px solid #e2e8f0",
                    background: wasteType === w.value ? "var(--clr-success-bg)" : "var(--clr-white)",
                    borderRadius: "var(--r-md)", padding: "10px 12px", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 8, transition: "all 180ms",
                    color: wasteType === w.value ? "var(--clr-emerald)" : "var(--clr-muted)",
                    fontWeight: 600, fontSize: 13,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{w.emoji}</span>
                  <div>
                    <div>{w.label}</div>
                    <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.7 }}>{w.pts}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Weight */}
          <label className="field">
            <span>Estimated Weight (kg)</span>
            <div style={{ position: "relative" }}>
              <input className="input" type="number" min="0.1" step="0.1"
                placeholder="e.g. 1.5"
                value={weight}
                style={{ paddingRight: 44 }}
                onChange={(e) => setWeight(e.target.value)}
              />
              <Scale size={17} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--clr-subtle)" }} />
            </div>
          </label>

          {weight && parseFloat(weight) > 0 && (
            <div style={{
              background: "var(--clr-success-bg)", border: "1px solid var(--clr-border)",
              borderRadius: "var(--r-md)", padding: "10px 14px", fontSize: 13,
              color: "var(--clr-emerald)", fontWeight: 600,
            }}>
              Estimated reward: ~{Math.round(parseFloat(weight) * { plastic: 20, aluminium: 30, paper: 10, glass: 15 }[wasteType])} eco-points
            </div>
          )}

          <button className="button" type="submit" style={{ justifyContent: "center", padding: "12px" }}>
            <Recycle size={16} /> Submit Waste
          </button>
        </form>
      )}
    </Modal>
  );
}

/* ── QR Code Modal ── */
function QrModal({ open, onClose, user }) {
  // Simple SVG QR placeholder — in production use qrcode library
  const userId = user?.id || user?._id || "DEMO-USER";
  const displayId = typeof userId === "string" ? userId.slice(-8).toUpperCase() : "DEMO";

  return (
    <Modal open={open} onClose={onClose} title="Your Eco ID & QR Code">
      <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
        {/* QR visual */}
        <div style={{
          width: 200, height: 200, margin: "0 auto 20px",
          border: "3px solid var(--clr-forest)",
          borderRadius: "var(--r-md)",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "white", position: "relative", overflow: "hidden",
        }}>
          <QrCode size={140} style={{ color: "var(--clr-forest)", opacity: 0.85 }} />
          {/* Corner marks */}
          {[
            { top: 8,   left: 8,   borderTop: "3px solid var(--clr-emerald)",   borderLeft:   "3px solid var(--clr-emerald)" },
            { top: 8,   right: 8,  borderTop: "3px solid var(--clr-emerald)",   borderRight:  "3px solid var(--clr-emerald)" },
            { bottom: 8, left: 8,  borderBottom: "3px solid var(--clr-emerald)", borderLeft:  "3px solid var(--clr-emerald)" },
            { bottom: 8, right: 8, borderBottom: "3px solid var(--clr-emerald)", borderRight: "3px solid var(--clr-emerald)" },
          ].map((style, i) => (
            <div key={i} style={{ position: "absolute", width: 20, height: 20, ...style }} />
          ))}
        </div>

        <div style={{
          fontFamily: "monospace", fontSize: 18, fontWeight: 700,
          letterSpacing: "0.15em", color: "var(--clr-forest)",
          background: "var(--clr-surface)", borderRadius: "var(--r-sm)",
          padding: "6px 16px", display: "inline-block", marginBottom: 12,
        }}>
          ECO-{displayId}
        </div>

        <p style={{ color: "var(--clr-muted)", fontSize: 13, maxWidth: 320, margin: "0 auto 20px" }}>
          Show this QR code to any verified collector when dropping off recyclables.
          They will scan it to award your eco-points instantly.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            className="button"
            onClick={() => window.print()}
            style={{ fontSize: 13, padding: "9px 20px" }}
          >
            Print / Save
          </button>
          <button className="button-outline" onClick={onClose} style={{ fontSize: 13, padding: "9px 20px" }}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ── Main Dashboard ── */
export default function StudentDashboard() {
  const { user } = useAuth();
  const points = user?.ecoPoints || 0;

  const [wasteOpen, setWasteOpen] = useState(false);
  const [qrOpen,    setQrOpen]    = useState(false);

  return (
    <>
      {/* Modals */}
      <SubmitWasteModal open={wasteOpen} onClose={() => setWasteOpen(false)} userName={user?.name} />
      <QrModal         open={qrOpen}    onClose={() => setQrOpen(false)}    user={user} />

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
        <button id="submit-waste-btn" className="button" onClick={() => setWasteOpen(true)}>
          <Recycle size={16} /> Submit Waste
        </button>
      </div>

      {/* Top stats row */}
      <div className="dashboard-grid-3">
        {[
          { icon: <Recycle    size={22} style={{ color: "#16a34a" }} />, bg: "#f0fdf4", label: "Total Submissions",  value: "12",     trend: "+3 this week"    },
          { icon: <TrendingUp size={22} style={{ color: "#3b82f6" }} />, bg: "#eff6ff", label: "Kg Collected",      value: "8.4 kg", trend: "+1.2 kg this week" },
          { icon: <Leaf       size={22} style={{ color: "#84cc16" }} />, bg: "#f7fee7", label: "Trees Sponsored",   value: "2",      trend: "Keep going!"       },
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
        <StudentCard student={user} points={points} onViewQr={() => setQrOpen(true)} />
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
