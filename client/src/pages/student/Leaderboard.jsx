import { useState } from "react";
import { Trophy, Users, School, Star, Filter, Search } from "lucide-react";

const MEDALS = ["🥇","🥈","🥉"];
const ALL_ENTRIES = [
  {id:"1",name:"Amina Odhiambo",school:"Westlands Academy",pts:3420,kg:171,av:"AO",badge:"Gold"},
  {id:"2",name:"Brian Mutua",school:"Nairobi High School",pts:2870,kg:143.5,av:"BM",badge:"Gold"},
  {id:"3",name:"Chloe Wanjiku",school:"Karen C School",pts:2150,kg:107.5,av:"CW",badge:"Silver"},
  {id:"4",name:"David Kamau",school:"Strathmore Prep",pts:1600,kg:80,av:"DK",badge:"Silver"},
  {id:"5",name:"Eve Adhiambo",school:"Lavington School",pts:980,kg:49,av:"EA",badge:"Bronze"},
  {id:"6",name:"Felix Omondi",school:"University of Nairobi",pts:840,kg:42,av:"FO",badge:"Bronze"},
  {id:"7",name:"Grace Njeri",school:"Kenyatta University",pts:620,kg:31,av:"GN",badge:"Bronze"},
  {id:"8",name:"Hassan Ali",school:"Moi University",pts:510,kg:25.5,av:"HA",badge:"Bronze"},
];
const SCHOOL_RANKS = [
  {name:"Westlands Academy",total:12480,members:24},
  {name:"Nairobi High School",total:10240,members:19},
  {name:"University of Nairobi",total:8960,members:32},
  {name:"Karen C School",total:7120,members:15},
  {name:"Strathmore Prep",total:5840,members:12},
];
const CHALLENGES = [
  {title:"Plastic Free Week",desc:"Submit 5 kg plastic this week",progress:62,reward:"500 pts",ends:"3 days"},
  {title:"Aluminium Sprint",desc:"Collect 3 kg aluminium",progress:38,reward:"300 pts",ends:"5 days"},
  {title:"School Champion",desc:"Be top recycler in your school",progress:80,reward:"1000 pts + Gold Badge",ends:"7 days"},
];
const BADGE_COLORS={Gold:"#fef9c3",Silver:"#f1f5f9",Bronze:"#fef3c7"};
const BADGE_TEXT={Gold:"#713f12",Silver:"#334155",Bronze:"#92400e"};

export default function LeaderboardPage() {
  const [tab, setTab] = useState("individual");
  const [q, setQ] = useState("");
  const filtered = ALL_ENTRIES.filter(e =>
    e.name.toLowerCase().includes(q.toLowerCase()) ||
    e.school.toLowerCase().includes(q.toLowerCase())
  );

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
          {icon:Trophy, bg:"#fef9c3",ic:"#d97706", label:"Your Rank",   v:"#14"},
          {icon:Users,  bg:"#eff6ff",ic:"#3b82f6", label:"Participants",v:"248"},
          {icon:School, bg:"#f0fdf4",ic:"var(--g-600)",label:"Schools",v:"47"},
          {icon:Star,   bg:"#fdf4ff",ic:"#a21caf", label:"Active Challenges",v:"3"},
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
          <span className="section-title">🔥 Active Challenges</span>
        </div>
        <div className="grid-3">
          {CHALLENGES.map(c=>(
            <div key={c.title} className="challenge-card">
              <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:15,marginBottom:4}}>{c.title}</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,.65)",marginBottom:12}}>{c.desc}</div>
              <div style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"rgba(255,255,255,.6)",marginBottom:6}}>
                  <span>{c.progress}%</span><span>Ends in {c.ends}</span>
                </div>
                <div style={{height:6,background:"rgba(255,255,255,.15)",borderRadius:100,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${c.progress}%`,background:"linear-gradient(90deg,var(--g-400),var(--lime))",borderRadius:100,transition:"width 1s ease"}}/>
                </div>
              </div>
              <div style={{fontSize:12,color:"rgba(255,255,255,.7)",fontWeight:600}}>🏆 Reward: {c.reward}</div>
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
                <thead><tr><th>Rank</th><th>Recycler</th><th>School</th><th>Points</th><th>Kg</th><th>Tier</th></tr></thead>
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
                      <td style={{color:"var(--text-muted)"}}>{e.kg} kg</td>
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
                {SCHOOL_RANKS.map((s,i)=>(
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
