import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { Recycle, TrendingUp, Leaf, X, QrCode, Scale, CheckCircle,
         AlertCircle, Zap, Award, MapPin, ChevronRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

/* ────────────────────────────────── Demo data */
const CHART_DATA = [
  {w:"Mon",kg:1.2},{w:"Tue",kg:0.8},{w:"Wed",kg:2.1},{w:"Thu",kg:1.5},{w:"Fri",kg:0.9},{w:"Sat",kg:3.2},{w:"Sun",kg:1.8},
];
const LEADERBOARD = [
  {id:"1",name:"Amina Odhiambo",school:"Westlands Academy",pts:3420,av:"AO"},
  {id:"2",name:"Brian Mutua",school:"Nairobi High School",pts:2870,av:"BM"},
  {id:"3",name:"Chloe Wanjiku",school:"Karen C School",pts:2150,av:"CW"},
  {id:"4",name:"David Kamau",school:"Strathmore Prep",pts:1600,av:"DK"},
  {id:"5",name:"Eve Adhiambo",school:"Lavington School",pts:980,av:"EA"},
];
const ACTIVITY = [
  {id:1,text:"Submitted 1.2 kg plastic bottles",time:"Today, 10:34 AM",pts:"+24"},
  {id:2,text:"Earned 'First Recycler' badge",time:"Yesterday, 4:10 PM",pts:"+10"},
  {id:3,text:"Redeemed Safaricom 50 Airtime",time:"Mon, 9:00 AM",pts:"-200"},
  {id:4,text:"Submitted 0.8 kg aluminium cans",time:"Sun, 2:45 PM",pts:"+16"},
];
const NEARBY = [
  {name:"Naivas Westlands",type:"Supermarket",dist:"0.4 km",open:true},
  {name:"UoN Main Campus",type:"University",dist:"1.1 km",open:true},
  {name:"Sarit Centre Kiosk",type:"Kiosk",dist:"1.8 km",open:false},
];
const WASTE_TYPES = [
  {v:"plastic",l:"Plastic Bottles",e:"🧴",pts:20},
  {v:"aluminium",l:"Aluminium Cans",e:"🥤",pts:30},
  {v:"paper",l:"Paper / Cardboard",e:"📄",pts:10},
  {v:"glass",l:"Glass",e:"🫙",pts:15},
];
const LEVELS=[
  {name:"Seedling",min:0,max:500},
  {name:"Sprouting",min:500,max:1500},
  {name:"Growing",min:1500,max:3000},
  {name:"Thriving",min:3000,max:5000},
  {name:"Champion",min:5000,max:10000},
];
const MEDALS=["🥇","🥈","🥉"];

/* ── Helpers ── */
function getLevel(pts){return LEVELS.find(l=>pts>=l.min&&pts<l.max)||LEVELS[LEVELS.length-1];}
function initials(n=""){return n.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase()||"U";}
function getTier(pts){
  if(pts>=5000)return{label:"Gold",bg:"#fef9c3",color:"#713f12"};
  if(pts>=1000)return{label:"Silver",bg:"#f1f5f9",color:"#334155"};
  return{label:"Bronze",bg:"#fef3c7",color:"#92400e"};
}

/* ── Animated counter ── */
function Counter({to}){
  const[v,setV]=useState(0);
  useEffect(()=>{
    let cur=0; const inc=to/60;
    const t=setInterval(()=>{ cur+=inc; if(cur>=to){setV(to);clearInterval(t);}else setV(Math.floor(cur)); },16);
    return()=>clearInterval(t);
  },[to]);
  return <>{v.toLocaleString()}</>;
}

/* ── Modal shell ── */
function Modal({open,onClose,title,children}){
  useEffect(()=>{
    const fn=e=>{if(e.key==="Escape")onClose();};
    if(open)document.addEventListener("keydown",fn);
    return()=>document.removeEventListener("keydown",fn);
  },[open,onClose]);
  if(!open)return null;
  return(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e=>e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button onClick={onClose} className="btn btn-ghost btn-icon"><X size={18}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Submit Waste Modal ── */
function SubmitModal({open,onClose}){
  const[type,setType]=useState("plastic");
  const[weight,setWeight]=useState("");
  const[done,setDone]=useState(false);
  const pts=weight?Math.round(parseFloat(weight)||0)*WASTE_TYPES.find(w=>w.v===type)?.pts:0;
  const submit=e=>{
    e.preventDefault();
    if(!weight||parseFloat(weight)<=0)return;
    setDone(true);
    setTimeout(()=>{setDone(false);setWeight("");onClose();},2400);
  };
  return(
    <Modal open={open} onClose={onClose} title="Submit Recyclables">
      {done?(
        <div style={{textAlign:"center",padding:"24px 0"}}>
          <CheckCircle size={52} style={{color:"var(--g-600)",margin:"0 auto 12px"}}/>
          <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:18,marginBottom:8}}>Submission Sent!</div>
          <p style={{color:"var(--text-muted)",fontSize:14}}>A collector will verify and award your {pts} eco-points shortly.</p>
        </div>
      ):(
        <form onSubmit={submit} style={{display:"grid",gap:18}}>
          <p style={{color:"var(--text-muted)",fontSize:14,margin:0}}>Select waste type and estimated weight. A collector at your nearest drop-off will confirm.</p>
          <div className="field">
            <span className="field-label">Waste Type</span>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {WASTE_TYPES.map(w=>(
                <button key={w.v} type="button" onClick={()=>setType(w.v)} style={{
                  border:`2px solid ${type===w.v?"var(--g-600)":"var(--border)"}`,
                  background:type===w.v?"var(--g-50)":"#fff",
                  borderRadius:"var(--r-md)",padding:"10px 12px",cursor:"pointer",
                  display:"flex",alignItems:"center",gap:8,transition:"all 180ms",
                  color:type===w.v?"var(--g-700)":"var(--text-muted)",fontWeight:600,fontSize:13,
                }}>
                  <span style={{fontSize:20}}>{w.e}</span>
                  <div><div>{w.l}</div><div style={{fontSize:11,opacity:.7}}>{w.pts} pts/kg</div></div>
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <span className="field-label">Weight (kg)</span>
            <div style={{position:"relative"}}>
              <input className="input" type="number" min=".1" step=".1" placeholder="e.g. 1.5" value={weight} style={{paddingRight:44}} onChange={e=>setWeight(e.target.value)}/>
              <Scale size={16} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:"var(--text-soft)"}}/>
            </div>
          </div>
          {pts>0&&(
            <div style={{background:"var(--g-50)",border:"1px solid var(--g-200)",borderRadius:"var(--r-md)",padding:"10px 14px",fontSize:13,color:"var(--g-800)",fontWeight:600}}>
              Estimated reward: ~{pts} eco-points 🌱
            </div>
          )}
          <button className="btn btn-primary" type="submit" style={{justifyContent:"center",padding:13}}>
            <Recycle size={16}/> Submit Waste
          </button>
        </form>
      )}
    </Modal>
  );
}

/* ── QR Modal ── */
function QrModal({open,onClose,user}){
  const id=(user?.id||user?._id||"DEMO").toString().slice(-8).toUpperCase();
  return(
    <Modal open={open} onClose={onClose} title="Your Eco ID">
      <div style={{textAlign:"center",padding:"8px 0 16px"}}>
        <div className="qr-frame" style={{width:180,height:180,margin:"0 auto 20px"}}>
          <QrCode size={130} style={{color:"var(--g-900)",opacity:.9}}/>
          <div className="qr-corner qr-corner-tl"/><div className="qr-corner qr-corner-tr"/>
          <div className="qr-corner qr-corner-bl"/><div className="qr-corner qr-corner-br"/>
        </div>
        <div style={{fontFamily:"monospace",fontSize:18,fontWeight:700,letterSpacing:".15em",background:"var(--bg-subtle)",borderRadius:"var(--r-sm)",padding:"6px 16px",display:"inline-block",marginBottom:12}}>
          ECO-{id}
        </div>
        <p style={{color:"var(--text-muted)",fontSize:13,maxWidth:300,margin:"0 auto 20px"}}>
          Show this QR code to any verified collector when dropping off recyclables. They'll scan it to award your points instantly.
        </p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button className="btn btn-primary btn-sm" onClick={()=>window.print()}>Print / Save</button>
          <button className="btn btn-outline btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
}

/* ── Eco Ring SVG ── */
function EcoRing({points}){
  const lvl=getLevel(points);
  const pct=Math.min(((points-lvl.min)/(lvl.max-lvl.min))*100,100);
  const R=52, C=2*Math.PI*R;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:20}}>
      <div style={{display:"flex",alignItems:"center",gap:24}}>
        <svg width={130} height={130} style={{transform:"rotate(-90deg)",flexShrink:0}}>
          <circle cx={65} cy={65} r={R} fill="none" stroke="var(--bg-muted)" strokeWidth={10}/>
          <circle cx={65} cy={65} r={R} fill="none"
            stroke="url(#eco-gr)" strokeWidth={10} strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C*(1-pct/100)}
            style={{transition:"stroke-dashoffset 1.2s ease"}}
          />
          <defs>
            <linearGradient id="eco-gr" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--g-600)"/>
              <stop offset="100%" stopColor="var(--lime-dk)"/>
            </linearGradient>
          </defs>
        </svg>
        <div className="eco-ring-wrap">
          <span className="eco-ring-label">Eco Points</span>
          <div className="eco-ring-value"><Counter to={points}/></div>
          <div className="eco-ring-level"><Zap size={13} style={{color:"var(--lime-dk)"}}/> {lvl.name}</div>
        </div>
      </div>
      <div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--text-muted)",marginBottom:6}}>
          <span>{points.toLocaleString()} pts</span>
          <span>Next: {lvl.max.toLocaleString()}</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{width:`${pct}%`}}/>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function StudentDashboard(){
  const{user}=useAuth();
  const pts=user?.ecoPoints||0;
  const tier=getTier(pts);
  const[waste,setWaste]=useState(false);
  const[qr,setQr]=useState(false);

  return(
    <>
      <SubmitModal open={waste} onClose={()=>setWaste(false)}/>
      <QrModal     open={qr}   onClose={()=>setQr(false)} user={user}/>

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Welcome back{user?.name?`, ${user.name.split(" ")[0]}`:""}! 👋</h1>
          <p className="page-subtitle">Your recycling impact at a glance.</p>
        </div>
        <button className="btn btn-primary" id="submit-waste-btn" onClick={()=>setWaste(true)}>
          <Recycle size={15}/> Submit Waste
        </button>
      </div>

      {/* KPI row */}
      <div className="dash-kpi-row">
        {[
          {icon:Recycle,   bg:"#f0fdf4",ic:"var(--g-600)", label:"Total Submissions",  v:"12",     trend:"+3 this week",  up:true},
          {icon:TrendingUp,bg:"#eff6ff",ic:"#3b82f6",       label:"Kg Collected",       v:"8.4 kg", trend:"+1.2 kg",       up:true},
          {icon:Leaf,      bg:"#f7fee7",ic:"var(--lime-dk)", label:"Trees Sponsored",   v:"2",      trend:"Keep going!",   up:true},
          {icon:Award,     bg:"#fef9c3",ic:"#d97706",        label:"Badges Earned",     v:"5",      trend:"+1 this month", up:true},
        ].map(s=>(
          <div key={s.label} className="kpi-card animate-fade-up">
            <div className="kpi-card-header">
              <div>
                <div className="kpi-label">{s.label}</div>
                <div className="kpi-value" style={{marginTop:6}}>{s.v}</div>
              </div>
              <div className="kpi-icon" style={{background:s.bg}}>
                <s.icon size={20} style={{color:s.ic}}/>
              </div>
            </div>
            <div className={`kpi-trend ${s.up?"up":"down"}`}>{s.up?"↑":"↓"} {s.trend}</div>
          </div>
        ))}
      </div>

      {/* Eco ring + Identity card */}
      <div className="grid-2">
        <div className="card"><EcoRing points={pts}/></div>
        <div className="card" style={{display:"flex",flexDirection:"column",gap:16}}>
          {/* Avatar row */}
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            {user?.avatarUrl?(
              <img src={user.avatarUrl} alt="avatar" style={{width:52,height:52,borderRadius:"50%",objectFit:"cover",border:"2px solid var(--border-g)"}}/>
            ):(
              <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,var(--g-600),var(--lime-dk))",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-heading)",fontWeight:700,fontSize:18,color:"#fff",flexShrink:0}}>
                {initials(user?.name||"")}
              </div>
            )}
            <div style={{flex:1}}>
              <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:17}}>{user?.name||"Student"}</div>
              <div style={{fontSize:13,color:"var(--text-muted)"}}>{user?.email||"—"}</div>
            </div>
            <span style={{background:tier.bg,color:tier.color,borderRadius:100,padding:"4px 12px",fontSize:12,fontWeight:700,flexShrink:0}}>
              <Award size={11} style={{display:"inline",marginRight:4}}/>{tier.label}
            </span>
          </div>
          {/* QR placeholder */}
          <div style={{border:"1.5px dashed var(--border-g)",borderRadius:"var(--r-md)",padding:"12px 16px",background:"var(--g-50)",display:"flex",alignItems:"center",gap:12}}>
            <QrCode size={26} style={{color:"var(--g-600)",flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13}}>Your QR Code</div>
              <div style={{fontSize:12,color:"var(--text-muted)"}}>Show at any collection point</div>
            </div>
            <button id="view-qr-btn" className="btn btn-primary btn-sm" onClick={()=>setQr(true)}>
              <QrCode size={13}/> View QR
            </button>
          </div>
          {/* Nearby points */}
          <div>
            <div style={{fontSize:13,fontWeight:700,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>
              <MapPin size={13} style={{color:"var(--g-600)"}}/> Nearby Collection Points
            </div>
            {NEARBY.map(p=>(
              <div key={p.name} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid var(--bg-subtle)"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600}}>{p.name}</div>
                  <div style={{fontSize:11,color:"var(--text-soft)"}}>{p.type} · {p.dist}</div>
                </div>
                <span className={`badge ${p.open?"badge-green":"badge-gray"}`}>{p.open?"Open":"Closed"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly chart + Activity */}
      <div className="grid-2">
        <div className="chart-container">
          <div className="chart-title">Weekly Recycling</div>
          <div className="chart-sub">Kg collected this week</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--g-600)" stopOpacity=".25"/>
                  <stop offset="95%" stopColor="var(--g-600)" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <XAxis dataKey="w" axisLine={false} tickLine={false} tick={{fontSize:12,fill:"var(--text-soft)"}}/>
              <Tooltip contentStyle={{borderRadius:8,border:"1px solid var(--border)",fontSize:13}} formatter={v=>[`${v} kg`]}/>
              <Area type="monotone" dataKey="kg" stroke="var(--g-600)" strokeWidth={2} fill="url(#cg)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <div className="section-header">
            <span className="section-title">Recent Activity</span>
          </div>
          {ACTIVITY.map(a=>(
            <div key={a.id} className="activity-item">
              <div className="activity-dot"/>
              <div style={{flex:1}}>
                <div className="activity-text">{a.text}</div>
                <div className="activity-meta">{a.time}</div>
              </div>
              <span style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:13,color:a.pts.startsWith("+")?"var(--g-700)":"var(--danger)",flexShrink:0}}>
                {a.pts} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">Top Recyclers</span>
          <a href="/student/leaderboard" className="section-action">View all <ChevronRight size={13} style={{display:"inline"}}/></a>
        </div>
        {LEADERBOARD.map((e,i)=>(
          <div key={e.id} className="lb-item">
            <div className="lb-rank">{i<3?MEDALS[i]:<span style={{color:"var(--text-soft)"}}>{i+1}</span>}</div>
            <div className="lb-avatar" style={{background:i===0?"linear-gradient(135deg,#f59e0b,#d97706)":i===1?"linear-gradient(135deg,#94a3b8,#64748b)":i===2?"linear-gradient(135deg,#c2830b,#a16207)":"linear-gradient(135deg,var(--g-600),var(--lime-dk))"}}>{e.av}</div>
            <div style={{flex:1}}>
              <div className="lb-name">{e.name}</div>
              <div className="lb-sub">{e.school}</div>
            </div>
            <div className="lb-pts">{e.pts.toLocaleString()} pts</div>
          </div>
        ))}
      </div>
    </>
  );
}
