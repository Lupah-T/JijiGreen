const REWARD_EMOJIS = ["📱", "🛒", "🌳", "🏅", "☕", "🎟️"];

export default function RewardsPanel({ rewards = [], userPoints = 0 }) {
  if (rewards.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--clr-muted)" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎁</div>
        <p style={{ fontWeight: 600 }}>No rewards available yet.</p>
        <p style={{ fontSize: 14 }}>Check back soon — new rewards are added regularly!</p>
      </div>
    );
  }

  return (
    <div className="dashboard-grid">
      {rewards.map((reward, i) => {
        const canRedeem = userPoints >= (reward.pointsCost || 0);
        return (
          <div key={reward._id || i} className={`reward-card fade-in-up delay-${(i % 4 + 1) * 100}`}>
            <div className="reward-card-icon">
              {REWARD_EMOJIS[i % REWARD_EMOJIS.length]}
            </div>
            <div className="reward-card-body">
              <div className="reward-card-title">{reward.title}</div>
              <div className="reward-card-desc">{reward.description || "Redeem with your eco-points."}</div>
              <div className="reward-card-footer">
                <div>
                  <div className="reward-pts">{(reward.pointsCost || 0).toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: "var(--clr-muted)" }}>eco-points</div>
                </div>
                <button
                  className="button"
                  disabled={!canRedeem}
                  style={{ fontSize: 13, padding: "8px 16px" }}
                  aria-label={`Redeem ${reward.title}`}
                >
                  {canRedeem ? "Redeem" : "Not enough pts"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
