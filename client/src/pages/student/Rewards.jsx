import { useEffect, useMemo, useState } from "react";
import { Lock, RefreshCw, Star, Zap } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { getRewards, redeemReward } from "../../api/rewardsApi.js";

const CATEGORY_STYLE = {
  Airtime: { bg: "#dbeafe", color: "#1e3a8a" },
  Shopping: { bg: "var(--g-100)", color: "var(--g-800)" },
  Sustainability: { bg: "#dcfce7", color: "#166534" },
  Badge: { bg: "#fef3c7", color: "#92400e" },
  Food: { bg: "#fae8ff", color: "#86198f" },
  Premium: { bg: "#fdf4ff", color: "#7e22ce" },
  Reward: { bg: "var(--bg-subtle)", color: "var(--text-muted)" },
};

function deriveCategory(reward = {}) {
  const text = `${reward.title || ""} ${reward.description || ""}`.toLowerCase();
  if (text.includes("airtime")) return "Airtime";
  if (text.includes("voucher") || text.includes("shop") || text.includes("naivas") || text.includes("java")) return "Shopping";
  if (text.includes("tree") || text.includes("sustain")) return "Sustainability";
  if (text.includes("badge")) return "Badge";
  if (text.includes("premium")) return "Premium";
  if (text.includes("coffee") || text.includes("food")) return "Food";
  return "Reward";
}

function deriveEmoji(category, title = "") {
  if (category === "Airtime") return "📱";
  if (category === "Shopping") return "🛒";
  if (category === "Sustainability") return "🌳";
  if (category === "Badge") return "🏅";
  if (category === "Food") return "☕";
  if (category === "Premium") return "🎟️";
  return title.includes("Gift") ? "🎁" : "♻️";
}

export default function Rewards() {
  const { user, setUser } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [redeemingId, setRedeemingId] = useState(null);

  useEffect(() => {
    let active = true;

    getRewards()
      .then(({ data }) => {
        if (!active) return;
        setRewards(data.data || data || []);
      })
      .catch(() => {
        if (active) setRewards([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => ["All", ...new Set(rewards.map((reward) => deriveCategory(reward)))], [rewards]);
  const userPoints = Number(user?.ecoPoints || 0);

  const shown = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rewards
      .map((reward) => ({
        ...reward,
        category: deriveCategory(reward),
        emoji: deriveEmoji(deriveCategory(reward), reward.title),
      }))
      .filter((reward) => (selectedCategory === "All" || reward.category === selectedCategory) && (!query || `${reward.title} ${reward.description}`.toLowerCase().includes(query)));
  }, [rewards, search, selectedCategory]);

  const handleRedeem = async (reward) => {
    setMessage("");
    setRedeemingId(reward._id);
    try {
      await redeemReward(reward._id);
      setRewards((current) => current.map((item) => (item._id === reward._id ? { ...item, stock: Math.max(0, Number(item.stock || 0) - 1) } : item)));
      setUser((current) => (current ? { ...current, ecoPoints: Math.max(0, Number(current.ecoPoints || 0) - Number(reward.pointsCost || 0)) } : current));
      setMessage(`Redeemed ${reward.title}`);
    } catch (error) {
      setMessage(error?.message || "Could not redeem reward.");
    } finally {
      setRedeemingId(null);
    }
  };

  if (loading) {
    return <div className="loader"><span className="spinner" /> Loading rewards...</div>;
  }

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Rewards Marketplace</h1>
          <p className="page-subtitle">Exchange your eco-points for real rewards.</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,background:"var(--g-50)",border:"1px solid var(--g-200)",borderRadius:"var(--r-md)",padding:"10px 16px"}}>
          <Zap size={18} style={{color:"var(--lime-dk)"}}/>
          <div>
            <div style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:20,lineHeight:1,color:"var(--g-800)"}}>{userPoints.toLocaleString()}</div>
            <div style={{fontSize:11,color:"var(--text-muted)",fontWeight:600}}>Eco Points</div>
          </div>
        </div>
      </div>

      {message ? (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          {message}
        </div>
      ) : null}

      {/* Category filter */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {categories.map((category) => (
            <button key={category} className={`tag ${selectedCategory===category?"tag-active":"tag-inactive"}`} onClick={()=>setSelectedCategory(category)}>{category}</button>
          ))}
        </div>
        <label style={{display:"flex",alignItems:"center",gap:8,minWidth:260,flex:"1 1 280px"}}>
          <input className="input" placeholder="Search rewards..." value={search} onChange={(event) => setSearch(event.target.value)} />
        </label>
      </div>

      {!shown.length ? (
        <div className="empty-state" style={{marginTop:24}}>
          <div className="empty-state-title">No rewards found</div>
          <div className="empty-state-sub">Try a different search or category.</div>
        </div>
      ) : null}

      {/* Grid */}
      <div className="grid-auto">
        {shown.map((reward, index)=>{
          const canRedeem = userPoints >= Number(reward.pointsCost || 0) && Number(reward.stock || 0) > 0 && reward.active !== false;
          const accent = CATEGORY_STYLE[reward.category] || CATEGORY_STYLE.Reward;
          const gradient = reward.category === "Premium"
            ? "#fdf4ff,#ede9fe"
            : reward.category === "Shopping"
              ? "#f0fdf4,#dcfce7"
              : reward.category === "Sustainability"
                ? "#dcfce7,#bbf7d0"
                : reward.category === "Badge"
                  ? "#fefce8,#fef3c7"
                  : "var(--bg),var(--bg-subtle)";

          return(
            <div key={reward._id || reward.title} className={`reward-card animate-fade-up delay-${(index%3+1)*100}`}>
              <div className="reward-card-img" style={{background:`linear-gradient(135deg,${gradient})`}}>
                <span>{reward.emoji}</span>
                <span style={{position:"absolute",top:10,right:10,background:accent.bg,color:accent.color,borderRadius:100,padding:"2px 8px",fontSize:11,fontWeight:700}}>
                  {reward.category}
                </span>
              </div>
              <div className="reward-card-body">
                <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:15,marginBottom:6}}>{reward.title}</div>
                <p style={{fontSize:13,color:"var(--text-muted)",lineHeight:1.6,marginBottom:12}}>{reward.description || "Available through the JijiGreen reward marketplace."}</p>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div>
                    <div className="reward-pts">{Number(reward.pointsCost || 0).toLocaleString()}</div>
                    <div style={{fontSize:11,color:"var(--text-muted)",fontWeight:500}}>{Number(reward.stock || 0)} in stock</div>
                  </div>
                  <button
                    className={canRedeem?"btn btn-primary btn-sm":"btn btn-sm"}
                    disabled={!canRedeem || redeemingId === reward._id}
                    onClick={() => handleRedeem(reward)}
                    style={!canRedeem?{background:"var(--bg-subtle)",color:"var(--text-soft)",cursor:"not-allowed",border:"1px solid var(--border)"}:{}}
                    aria-label={`Redeem ${reward.title}`}
                  >
                    {redeemingId === reward._id ? <><RefreshCw size={12} className="spin" /> Redeeming</> : canRedeem ? <><Star size={12}/> Redeem</> : <><Lock size={12}/> {Math.max(0, Number(reward.pointsCost || 0) - userPoints)} more pts</>}
                  </button>
                </div>
                {!canRedeem && Number(reward.pointsCost || 0) > 0 && (
                  <div style={{marginTop:8}}>
                    <div className="progress-track">
                      <div className="progress-fill" style={{width:`${Math.min((userPoints / Number(reward.pointsCost || 1)) * 100, 100)}%`}}/>
                    </div>
                    <div style={{fontSize:11,color:"var(--text-soft)",marginTop:4}}>{Math.round((userPoints / Number(reward.pointsCost || 1)) * 100)}% there</div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
