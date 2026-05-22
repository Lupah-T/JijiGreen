import { TrendingUp, TrendingDown } from "lucide-react";

const COLOR_CONFIGS = [
  { bg: "#f0fdf4", color: "#16a34a" },
  { bg: "#eff6ff", color: "#3b82f6" },
  { bg: "#fef9c3", color: "#a16207" },
  { bg: "#fdf2f8", color: "#a21caf" },
];

export default function AnalyticsCard({ label, value, trend, trendUp = true, icon, colorIndex = 0 }) {
  const cfg = COLOR_CONFIGS[colorIndex % COLOR_CONFIGS.length];

  return (
    <article className="stat-card fade-in">
      <div className="stat-card-header">
        <div className="stat-label">{label}</div>
        {icon && (
          <div style={{
            width: 42, height: 42, borderRadius: "var(--r-md)",
            background: cfg.bg, display: "flex", alignItems: "center",
            justifyContent: "center", color: cfg.color,
          }}>
            {icon}
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      {trend && (
        <div className={`stat-trend ${trendUp ? "up" : "down"}`}>
          {trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trend}
        </div>
      )}
    </article>
  );
}
