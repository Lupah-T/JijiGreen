import { useEffect, useMemo, useState } from "react";
import { School, Search, Star, Trophy, Users } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";
import { getLeaderboard } from "../../api/rewardsApi.js";

const MEDALS = ["🥇", "🥈", "🥉"];
const BADGE_COLORS = { Gold: "#fef9c3", Silver: "#f1f5f9", Bronze: "#fef3c7" };
const BADGE_TEXT = { Gold: "#713f12", Silver: "#334155", Bronze: "#92400e" };

function initials(name = "") {
  return name.split(" ").slice(0, 2).map((word) => word[0]).join("").toUpperCase() || "U";
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("individual");
  const [q, setQ] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getLeaderboard()
      .then(({ data }) => {
        if (!active) return;
        setLeaderboard(data.data || data || []);
      })
      .catch(() => {
        if (active) setLeaderboard([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const individualEntries = useMemo(() => leaderboard.map((entry) => ({
    id: entry._id,
    name: entry.user?.name || "Unknown recycler",
    school: entry.school?.name || "Unassigned",
    pts: Number(entry.points ?? entry.user?.ecoPoints ?? 0),
    av: initials(entry.user?.name || "User"),
  })), [leaderboard]);

  const schoolRanks = useMemo(() => {
    const groups = new Map();

    individualEntries.forEach((entry) => {
      const current = groups.get(entry.school) || { name: entry.school, total: 0, members: 0 };
      current.total += entry.pts;
      current.members += 1;
      groups.set(entry.school, current);
    });

    return Array.from(groups.values()).sort((a, b) => b.total - a.total).slice(0, 8);
  }, [individualEntries]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return individualEntries.filter((entry) => !query || entry.name.toLowerCase().includes(query) || entry.school.toLowerCase().includes(query));
  }, [individualEntries, q]);

  const liveHighlights = useMemo(() => {
    const topRecycler = individualEntries[0];
    const topSchool = schoolRanks[0];
    const currentEntry = user?.id ? individualEntries.find((entry) => entry.id === user.id) : null;

    return [
      { title: "Top recycler", desc: topRecycler ? `${topRecycler.name} leads with ${topRecycler.pts.toLocaleString()} points.` : "Waiting for live rankings.", reward: topRecycler ? `#${1}` : "—", progress: 100 },
      { title: "Leading school", desc: topSchool ? `${topSchool.name} has ${topSchool.members} active members.` : "No school rankings yet.", reward: topSchool ? `${topSchool.total.toLocaleString()} pts` : "—", progress: topSchool ? 100 : 0 },
      { title: "Your standing", desc: currentEntry ? `You are ranked among ${individualEntries.length} live participants.` : "Log in to see your rank.", reward: currentEntry ? `${currentEntry.pts.toLocaleString()} pts` : "—", progress: currentEntry ? 100 : 0 },
    ];
  }, [individualEntries, schoolRanks, user?.id]);

  if (loading) {
    return <div className="loader"><span className="spinner" /> Loading leaderboard...</div>;
  }

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Leaderboard &amp; Community</h1>
          <p className="page-subtitle">Compete, collaborate, and celebrate sustainable impact.</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="dash-kpi-row">
        {[
          {icon: Trophy, bg: "#fef9c3", ic: "#d97706", label: "Your Rank", v: user?.id ? `#${Math.max(1, individualEntries.findIndex((entry) => entry.id === user.id) + 1)}` : "—" },
          {icon: Users, bg: "#eff6ff", ic: "#3b82f6", label: "Participants", v: String(individualEntries.length) },
          {icon: School, bg: "#f0fdf4", ic: "var(--g-600)", label: "Schools", v: String(schoolRanks.length) },
          {icon: Star, bg: "#fdf4ff", ic: "#a21caf", label: "Live highlights", v: String(liveHighlights.length) },
        ].map(s=>(
          <div key={s.label} className="kpi-card animate-fade-up">
            <div className="kpi-card-header">
              <div><div className="kpi-label">{s.label}</div><div className="kpi-value" style={{marginTop:6}}>{s.v}</div></div>
              <div className="kpi-icon" style={{background:s.bg}}><s.icon size={20} style={{color:s.ic}}/></div>
            </div>
          </div>
        ))}
      </div>

      {/* Active challenges */}
      <div className="card">
        <div className="section-header" style={{marginBottom:20}}>
          <span className="section-title">Live Highlights</span>
        </div>
        <div className="grid-3">
          {liveHighlights.map((item) => (
            <div key={item.title} className="challenge-card">
              <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:15,marginBottom:4}}>{item.title}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.65)",marginBottom:12}}>{item.desc}</div>
              <div style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"rgba(255,255,255,.6)",marginBottom:6}}>
                  <span>{item.progress}%</span><span>Live now</span>
                </div>
                <div style={{height:6,background:"rgba(255,255,255,.15)",borderRadius:100,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${item.progress}%`,background:"linear-gradient(90deg,var(--g-400),var(--lime))",borderRadius:100,transition:"width 1s ease"}}/>
                </div>
              </div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.7)",fontWeight:600}}>🏆 Live: {item.reward}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rankings */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">Rankings</span>
          <div style={{display:"flex",gap:8}}>
            {["individual","schools"].map(t=>(
              <button key={t} className={`tag ${tab===t?"tag-active":"tag-inactive"}`} onClick={()=>setTab(t)}>
                {t==="individual"?<Users size={13}/>:<School size={13}/>}
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {tab==="individual"&&(
          <>
            <div style={{position:"relative",marginBottom:16}}>
              <input className="input" placeholder="Search by name or school…" value={q} onChange={e=>setQ(e.target.value)} style={{paddingLeft:40}}/>
              <Search size={15} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"var(--text-soft)"}}/>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Rank</th><th>Recycler</th><th>School</th><th>Points</th><th>Tier</th></tr></thead>
                <tbody>
                  {filtered.map((e,i)=>(
                    <tr key={e.id}>
                      <td style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:15}}>{i<3?MEDALS[i]:i+1}</td>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,var(--g-600),var(--lime-dk))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff"}}>{e.av}</div>
                          <span style={{fontWeight:600,fontSize:14}}>{e.name}</span>
                        </div>
                      </td>
                      <td style={{color:"var(--text-muted)",fontSize:13}}>{e.school}</td>
                      <td style={{fontFamily:"var(--font-heading)",fontWeight:700,color:"var(--g-700)"}}>{e.pts.toLocaleString()}</td>
                      <td><span style={{background:BADGE_COLORS[e.badge],color:BADGE_TEXT[e.badge],borderRadius:100,padding:"3px 10px",fontSize:12,fontWeight:700}}>{e.badge}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab==="schools"&&(
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Rank</th><th>School</th><th>Total Points</th><th>Members</th></tr></thead>
              <tbody>
                {schoolRanks.map((s,i)=>(
                  <tr key={s.name}>
                    <td style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:15}}>{i<3?MEDALS[i]:i+1}</td>
                    <td><div style={{display:"flex",alignItems:"center",gap:10}}><School size={16} style={{color:"var(--g-600)"}}/><span style={{fontWeight:600}}>{s.name}</span></div></td>
                    <td style={{fontFamily:"var(--font-heading)",fontWeight:700,color:"var(--g-700)"}}>{s.total.toLocaleString()}</td>
                    <td><span className="badge badge-green">{s.members} members</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
