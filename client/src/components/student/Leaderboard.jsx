const MEDALS = ["🥇", "🥈", "🥉"];

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "?";
}

export default function Leaderboard({ entries = [], title = "Leaderboard", limit = 5 }) {
  const shown = entries.slice(0, limit);

  return (
    <section className="panel" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 17, fontWeight: 700, margin: 0 }}>
          {title}
        </h3>
        <span className="badge badge-green">{entries.length} participants</span>
      </div>

      {shown.length === 0 ? (
        <p style={{ color: "var(--clr-muted)", fontSize: 14, textAlign: "center", padding: "20px 0" }}>
          No entries yet. Be the first to recycle!
        </p>
      ) : (
        shown.map((entry, i) => (
          <div key={entry._id || entry.rank || i} className={`leaderboard-item fade-in delay-${(i + 1) * 100}`}>
            <div className="leaderboard-rank">
              {i < 3 ? MEDALS[i] : <span style={{ color: "var(--clr-subtle)" }}>{i + 1}</span>}
            </div>

            <div className="leaderboard-avatar" style={{
              background: i === 0
                ? "linear-gradient(135deg, #f59e0b, #d97706)"
                : i === 1
                  ? "linear-gradient(135deg, #94a3b8, #64748b)"
                  : i === 2
                    ? "linear-gradient(135deg, #c2830b, #a16207)"
                    : "linear-gradient(135deg, var(--clr-emerald), var(--clr-lime))",
            }}>
              {getInitials(entry.user?.name)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="leaderboard-name">{entry.user?.name || "Student"}</div>
              {entry.user?.school && (
                <div className="leaderboard-school">{entry.user.school}</div>
              )}
            </div>

            <div className="leaderboard-pts">{(entry.points || 0).toLocaleString()} pts</div>
          </div>
        ))
      )}
    </section>
  );
}
