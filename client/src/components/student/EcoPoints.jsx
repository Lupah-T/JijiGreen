import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

const LEVELS = [
  { name: "Seedling",  min: 0,    max: 500  },
  { name: "Sprouting", min: 500,  max: 1500 },
  { name: "Growing",   min: 1500, max: 3000 },
  { name: "Thriving",  min: 3000, max: 5000 },
  { name: "Champion",  min: 5000, max: 10000 },
];

function getLevel(points) {
  return LEVELS.find((l) => points >= l.min && points < l.max) || LEVELS[LEVELS.length - 1];
}

function AnimatedNumber({ target }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const step = 16;
    const increment = (target / (duration / step));
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setDisplay(target); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [target]);
  return <>{display.toLocaleString()}</>;
}

export default function EcoPoints({ points = 0 }) {
  const level   = getLevel(points);
  const progress = Math.min(((points - level.min) / (level.max - level.min)) * 100, 100);

  // SVG ring
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = ((100 - progress) / 100) * circumference;

  return (
    <article className="panel fade-in" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className="stat-label">Eco Points</div>
          <div className="stat-value" style={{ fontSize: 40, marginTop: 4 }}>
            <AnimatedNumber target={points} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
            <Zap size={14} style={{ color: "var(--clr-lime)" }} />
            <span style={{ fontSize: 13, color: "var(--clr-muted)" }}>
              Level: <strong style={{ color: "var(--clr-emerald)" }}>{level.name}</strong>
            </span>
          </div>
        </div>

        {/* SVG ring */}
        <svg width={130} height={130} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={65} cy={65} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={10} />
          <circle
            cx={65} cy={65} r={radius}
            fill="none"
            stroke="url(#eco-gradient)"
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDash}
            style={{ transition: "stroke-dashoffset 1.2s ease" }}
          />
          <defs>
            <linearGradient id="eco-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--clr-emerald)" />
              <stop offset="100%" stopColor="var(--clr-lime)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Progress to next level */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "var(--clr-muted)" }}>
          <span>{points.toLocaleString()} pts</span>
          <span>{level.max.toLocaleString()} pts to next level</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </article>
  );
}
