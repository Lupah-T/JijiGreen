import { QrCode, Medal } from "lucide-react";

const TIER_CONFIG = {
  bronze: { label: "Bronze",  bg: "#fef3c7", color: "#92400e", border: "#fcd34d" },
  silver: { label: "Silver",  bg: "#f1f5f9", color: "#475569", border: "#cbd5e1" },
  gold:   { label: "Gold",    bg: "#fef9c3", color: "#a16207", border: "#fde047" },
};

function getTier(points = 0) {
  if (points >= 5000) return "gold";
  if (points >= 1000) return "silver";
  return "bronze";
}

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "U";
}

export default function StudentCard({ student, points = 0 }) {
  const name   = student?.name   || "Student";
  const school = student?.school || "School not set";
  const tier   = getTier(points);
  const cfg    = TIER_CONFIG[tier];

  return (
    <article className="panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Avatar */}
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--clr-emerald), var(--clr-lime))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 20,
          color: "white", flexShrink: 0,
        }}>
          {getInitials(name)}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700, margin: 0 }}>
            {name}
          </h3>
          <p style={{ color: "var(--clr-muted)", fontSize: 13, margin: "2px 0 0" }}>{school}</p>
        </div>

        {/* Tier badge */}
        <span style={{
          background: cfg.bg, color: cfg.color,
          border: `1px solid ${cfg.border}`,
          borderRadius: 100, padding: "4px 12px",
          fontSize: 12, fontWeight: 700,
          display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
        }}>
          <Medal size={12} /> {cfg.label}
        </span>
      </div>

      {/* QR placeholder */}
      <div style={{
        border: "1.5px dashed var(--clr-border)",
        borderRadius: "var(--r-md)",
        padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 12,
        background: "#f8fff9",
      }}>
        <QrCode size={28} style={{ color: "var(--clr-emerald)", flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "var(--clr-text)" }}>Your QR Code</div>
          <div style={{ fontSize: 12, color: "var(--clr-muted)" }}>Show this at any collection point</div>
        </div>
        <button className="button" style={{ marginLeft: "auto", fontSize: 12, padding: "6px 14px" }}>
          View QR
        </button>
      </div>
    </article>
  );
}
