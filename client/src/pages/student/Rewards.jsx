import { useEffect, useMemo, useState } from "react";
import { Award, Baby, CheckCircle2, Gift, Lock, Printer, RefreshCw, Search, Star, Ticket, UserRound, X, Zap } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { getMyRewards, getRewards, redeemReward } from "../../api/rewardsApi.js";

const CHILD_MIN = 60;
const MILESTONE = 500;

const CATEGORY_STYLE = {
  Airtime: { bg: "#dbeafe", color: "#1e3a8a", grad: "#eff6ff,#dbeafe" },
  Data: { bg: "#e0e7ff", color: "#3730a3", grad: "#eef2ff,#e0e7ff" },
  Vouchers: { bg: "#dcfce7", color: "#166534", grad: "#f0fdf4,#dcfce7" },
  "Eco Impact": { bg: "#d1fae5", color: "#065f46", grad: "#ecfdf5,#bbf7d0" },
  Toys: { bg: "#ffedd5", color: "#9a3412", grad: "#fff7ed,#fed7aa" },
  Storybooks: { bg: "#fce7f3", color: "#9d174d", grad: "#fdf2f8,#fbcfe8" },
  Stationery: { bg: "#fef9c3", color: "#854d0e", grad: "#fefce8,#fef08a" },
  Games: { bg: "#ede9fe", color: "#5b21b6", grad: "#f5f3ff,#ddd6fe" },
  Sports: { bg: "#cffafe", color: "#155e75", grad: "#ecfeff,#a5f3fc" },
};
const FALLBACK_STYLE = { bg: "var(--bg-subtle)", color: "var(--text-muted)", grad: "#f8fafc,#f1f5f9" };

function Certificate({ name, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ width: "min(100%, 640px)" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Your Certificate</span>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="certificate" id="jg-certificate">
          <div className="certificate-inner">
            <div className="certificate-brand">🌱 JijiGreen</div>
            <div className="certificate-kicker">Certificate of Recognition</div>
            <p className="certificate-small">This is proudly awarded to</p>
            <div className="certificate-name">{name || "Eco Champion"}</div>
            <p className="certificate-small" style={{ maxWidth: 380 }}>
              for earning {MILESTONE} eco-points through verified recycling and helping build a cleaner, greener Kenya.
            </p>
            <div className="certificate-seal">🏆<span>Eco Champion</span></div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 16 }}>
          <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
          <button className="btn btn-primary btn-sm" onClick={() => window.print()}><Printer size={14} /> Print / Save PDF</button>
        </div>
      </div>
    </div>
  );
}

export default function Rewards() {
  const { user, setUser } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [mine, setMine] = useState({ progress: null, vouchers: [] });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null); // { type, text }
  const [redeemingId, setRedeemingId] = useState(null);
  const [showCert, setShowCert] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.allSettled([getRewards(), getMyRewards()]).then(([r, m]) => {
      if (!active) return;
      if (r.status === "fulfilled") setRewards(r.value.data.data || r.value.data || []);
      if (m.status === "fulfilled") setMine(m.value.data.data || { progress: null, vouchers: [] });
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const progress = mine.progress;
  const ageGroup = progress?.ageGroup || user?.ageGroup || "adult";
  const isChild = ageGroup === "child";
  const userPoints = Number(progress?.ecoPoints ?? user?.ecoPoints ?? 0);
  const lifetime = Math.max(Number(progress?.lifetimePoints ?? user?.lifetimePoints ?? 0), userPoints);
  const milestoneReached = Boolean(progress?.milestoneReached) || lifetime >= MILESTONE;

  const grandRewards = useMemo(() => rewards.filter((r) => r.kind === "milestone"), [rewards]);
  const standard = useMemo(() => rewards.filter((r) => r.kind !== "milestone"), [rewards]);
  const categories = useMemo(() => ["All", ...new Set(standard.map((r) => r.category || "General"))], [standard]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return standard.filter((r) =>
      (selectedCategory === "All" || (r.category || "General") === selectedCategory) &&
      (!q || `${r.title} ${r.description}`.toLowerCase().includes(q)));
  }, [standard, search, selectedCategory]);

  const costOf = (r) => Math.max(Number(r.pointsCost || 0), isChild ? CHILD_MIN : 0);

  const handleRedeem = async (reward) => {
    setMessage(null);
    setRedeemingId(reward._id);
    try {
      const { data } = await redeemReward(reward._id);
      const newBalance = data.ecoPoints ?? Math.max(0, userPoints - costOf(reward));
      setRewards((cur) => cur.map((r) => (r._id === reward._id ? { ...r, stock: Math.max(0, Number(r.stock || 0) - 1) } : r)));
      setMine((cur) => ({
        ...cur,
        progress: cur.progress ? { ...cur.progress, ecoPoints: newBalance } : cur.progress,
        vouchers: [{ _id: data._id || data.code, code: data.code, reward, createdAt: new Date().toISOString() }, ...cur.vouchers],
      }));
      setUser((cur) => (cur ? { ...cur, ecoPoints: newBalance } : cur));
      setMessage({ type: "success", text: `🎉 You redeemed “${reward.title}”! Your voucher code is ${data.code}.` });
    } catch (error) {
      setMessage({ type: "error", text: error?.message || "Could not redeem reward." });
    } finally {
      setRedeemingId(null);
    }
  };

  if (loading) return <div className="loader"><span className="spinner" /> Loading rewards...</div>;

  const toGrand = Math.max(0, MILESTONE - lifetime);
  const grandPct = Math.min((lifetime / MILESTONE) * 100, 100);
  const childPct = Math.min((userPoints / CHILD_MIN) * 100, 100);
  const grandVouchers = mine.vouchers.filter((v) => v.reward?.kind === "milestone");
  const otherVouchers = mine.vouchers.filter((v) => v.reward?.kind !== "milestone");

  return (
    <>
      {showCert && <Certificate name={user?.name} onClose={() => setShowCert(false)} />}

      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Rewards Marketplace</h1>
          <p className="page-subtitle">
            {isChild ? "Swap your eco-points for toys, storybooks and games." : "Exchange your eco-points for airtime, vouchers and more."}
          </p>
          <span className={`badge ${isChild ? "badge-amber" : "badge-green"}`} style={{ marginTop: 10 }}>
            {isChild ? <Baby size={13} /> : <UserRound size={13} />} {isChild ? "Junior Recycler · under 16" : "Adult Recycler · 16+"}
          </span>
        </div>
        <div className="points-pill">
          <Zap size={18} style={{ color: "var(--lime-dk)" }} />
          <div>
            <div className="points-pill-value">{userPoints.toLocaleString()}</div>
            <div className="points-pill-label">Spendable points</div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`} role="status">{message.text}</div>
      )}

      {/* Grand award: 500 lifetime points */}
      <section className={`milestone-card${milestoneReached ? " reached" : ""}`}>
        <div className="milestone-head">
          <div>
            <span className="milestone-kicker"><Award size={14} /> Grand award · {MILESTONE} total points</span>
            <h2 className="milestone-title">
              {milestoneReached ? "Congratulations, Eco Champion! 🎉" : `${toGrand.toLocaleString()} more points to win the Eco Champion pack`}
            </h2>
            <p className="milestone-sub">
              {milestoneReached
                ? "Your watch, bag and certificate have been awarded. Show your voucher codes to a JijiGreen collector to collect them."
                : "Every point you ever earn counts towards this (spending points on rewards will not reduce your progress)."}
            </p>
          </div>
          {milestoneReached && (
            <button className="btn btn-sm milestone-btn" onClick={() => setShowCert(true)}><Award size={14} /> View certificate</button>
          )}
        </div>

        <div className="progress-track milestone-track"><div className="progress-fill" style={{ width: `${grandPct}%` }} /></div>
        <div className="milestone-meta"><span>{lifetime.toLocaleString()} pts earned</span><span>{MILESTONE} pts</span></div>

        <div className="milestone-items">
          {(grandRewards.length ? grandRewards : [
            { _id: "w", title: "Eco Champion Watch", emoji: "⌚" },
            { _id: "b", title: "Eco Champion Bag", emoji: "🎒" },
            { _id: "c", title: "Eco Champion Certificate", emoji: "🏆" },
          ]).map((r) => {
            const got = grandVouchers.find((v) => v.reward?._id === r._id || v.reward?.title === r.title);
            return (
              <div key={r._id} className={`milestone-item${milestoneReached ? " got" : ""}`}>
                <span className="milestone-emoji">{r.emoji || "🎁"}</span>
                <div>
                  <div className="milestone-item-title">{r.title.replace("Eco Champion ", "")}</div>
                  <div className="milestone-item-state">
                    {milestoneReached ? <><CheckCircle2 size={12} /> Awarded{got ? ` · ${got.code}` : ""}</> : <><Lock size={12} /> Locked</>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Children: unlock banner */}
      {isChild && userPoints < CHILD_MIN && (
        <div className="unlock-banner">
          <div style={{ flex: 1 }}>
            <strong>Rewards unlock at {CHILD_MIN} points! 🎈</strong>
            <div style={{ fontSize: 13, color: "var(--text-muted)", margin: "2px 0 8px" }}>
              You need {CHILD_MIN - userPoints} more point{CHILD_MIN - userPoints === 1 ? "" : "s"} to start choosing toys and storybooks.
            </div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${childPct}%` }} /></div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filter-row">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {categories.map((c) => (
            <button key={c} className={`tag ${selectedCategory === c ? "tag-active" : "tag-inactive"}`} onClick={() => setSelectedCategory(c)}>{c}</button>
          ))}
        </div>
        <div className="search-box">
          <Search size={15} />
          <input className="input" placeholder="Search rewards..." aria-label="Search rewards" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {!shown.length && (
        <div className="empty-state">
          <div className="empty-state-icon">🎁</div>
          <div className="empty-state-title">No rewards found</div>
          <div className="empty-state-sub">{standard.length ? "Try a different search or category." : "New rewards are coming soon. Check back later!"}</div>
        </div>
      )}

      <div className="grid-auto">
        {shown.map((reward, index) => {
          const cost = costOf(reward);
          const inStock = Number(reward.stock || 0) > 0;
          const canRedeem = userPoints >= cost && inStock && reward.active !== false;
          const style = CATEGORY_STYLE[reward.category] || FALLBACK_STYLE;
          const pct = Math.min((userPoints / (cost || 1)) * 100, 100);
          return (
            <div key={reward._id || reward.title} className={`reward-card animate-fade-up delay-${(index % 3 + 1) * 100}`}>
              <div className="reward-card-img" style={{ background: `linear-gradient(135deg,${style.grad})`, position: "relative" }}>
                <span>{reward.emoji || "🎁"}</span>
                <span className="reward-chip" style={{ background: style.bg, color: style.color }}>{reward.category || "Reward"}</span>
              </div>
              <div className="reward-card-body">
                <div className="reward-title">{reward.title}</div>
                <p className="reward-desc">{reward.description || "Available through the JijiGreen reward marketplace."}</p>
                <div className="reward-foot">
                  <div>
                    <div className="reward-pts">{cost.toLocaleString()} <small>pts</small></div>
                    <div className="reward-stock">{inStock ? `${Number(reward.stock)} in stock` : "Out of stock"}</div>
                  </div>
                  <button
                    className={canRedeem ? "btn btn-primary btn-sm" : "btn btn-sm btn-locked"}
                    disabled={!canRedeem || redeemingId === reward._id}
                    onClick={() => handleRedeem(reward)}
                    aria-label={`Redeem ${reward.title}`}
                  >
                    {redeemingId === reward._id ? <><RefreshCw size={12} className="spin" /> Redeeming</>
                      : canRedeem ? <><Star size={12} /> Redeem</>
                      : !inStock ? "Sold out"
                      : <><Lock size={12} /> {Math.max(0, cost - userPoints)} more</>}
                  </button>
                </div>
                {!canRedeem && inStock && (
                  <div style={{ marginTop: 10 }}>
                    <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
                    <div style={{ fontSize: 11, color: "var(--text-soft)", marginTop: 4 }}>{Math.round(pct)}% there</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Voucher wallet */}
      {otherVouchers.length > 0 && (
        <div className="card">
          <div className="section-header"><span className="section-title"><Ticket size={15} style={{ display: "inline", marginRight: 6 }} />My vouchers</span></div>
          {otherVouchers.slice(0, 6).map((v) => (
            <div key={v._id} className="activity-item">
              <div style={{ fontSize: 22 }}>{v.reward?.emoji || <Gift size={18} />}</div>
              <div style={{ flex: 1 }}>
                <div className="activity-text">{v.reward?.title || "Reward"}</div>
                <div className="activity-meta">{new Date(v.createdAt).toLocaleDateString("en-KE", { dateStyle: "medium" })}</div>
              </div>
              <code className="voucher-code">{v.code}</code>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
