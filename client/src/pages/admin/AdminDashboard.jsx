import { Users, School, Recycle, Star, BarChart2, AlertTriangle, Download, TrendingUp } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const TREND=[{m:"Jan",waste:240},{m:"Feb",waste:320},{m:"Mar",waste:280},{m:"Apr",waste:450},{m:"May",waste:520},{m:"Jun",waste:610}];
const WASTE_TYPES_DATA=[{name:"Plastic",value:42,color:"#16a34a"},{name:"Aluminium",value:28,color:"#3b82f6"},{name:"Paper",value:18,color:"#f59e0b"},{name:"Glass",value:12,color:"#8b5cf6"}];
const RECENT_USERS=[
  {name:"Amina Odhiambo",role:"student",school:"Westlands Academy",joined:"Today",av:"AO"},
  {name:"Brian Mutua",   role:"collector",school:"—",             joined:"Yesterday",av:"BM"},
  {name:"Chloe Wanjiku", role:"student",school:"Karen C School",  joined:"2 days ago",av:"CW"},
  {name:"David Kamau",   role:"student",school:"Strathmore Prep", joined:"3 days ago",av:"DK"},
];
const ROLE_COLOR={student:"badge-green",collector:"badge-blue",school_admin:"badge-gray",operations_admin:"badge-amber",super_admin:"badge-red"};

export default function AdminDashboard(){
  return(
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Platform-wide analytics and management overview.</p>
        </div>
        <button className="btn btn-outline" style={{gap:8}}><Download size={15}/> Export Report</button>
      </div>

      {/* KPIs */}
      <div className="dash-kpi-row">
        {[
          {icon:Users,      bg:"#eff6ff",ic:"#3b82f6", label:"Total Users",      v:"248",    trend:"↑ +12 this month",up:true},
          {icon:School,     bg:"#f0fdf4",ic:"var(--g-600)",label:"Partner Schools",v:"47",   trend:"↑ +3 this month",up:true},
          {icon:Recycle,    bg:"#fef9c3",ic:"#d97706", label:"Waste Collected",  v:"2.1 t",  trend:"↑ +340 kg",up:true},
          {icon:Star,       bg:"#fdf4ff",ic:"#a21caf", label:"Points Awarded",   v:"82,400", trend:"↑ +6,200 this week",up:true},
          {icon:AlertTriangle,bg:"#fef2f2",ic:"#ef4444",label:"Fraud Flags",    v:"3",      trend:"↑ Needs review",up:false},
          {icon:BarChart2,  bg:"#f0fdf4",ic:"var(--g-600)",label:"This Month Submissions",v:"384",trend:"↑ +42%",up:true},
        ].map(s=>(
          <div key={s.label} className="kpi-card animate-fade-up">
            <div className="kpi-card-header">
              <div><div className="kpi-label">{s.label}</div><div className="kpi-value" style={{marginTop:6}}>{s.v}</div></div>
              <div className="kpi-icon" style={{background:s.bg}}><s.icon size={20} style={{color:s.ic}}/></div>
            </div>
            <div className={`kpi-trend ${s.up?"up":"down"}`}>{s.trend}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid-2">
        <div className="chart-container">
          <div className="chart-title">Waste Collection Trend</div>
          <div className="chart-sub">Monthly kg collected (2025)</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={TREND}>
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--g-600)" stopOpacity=".2"/>
                  <stop offset="95%" stopColor="var(--g-600)" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{fontSize:12,fill:"var(--text-soft)"}}/>
              <YAxis hide/>
              <Tooltip contentStyle={{borderRadius:8,border:"1px solid var(--border)",fontSize:13}} formatter={v=>[`${v} kg`]}/>
              <Area type="monotone" dataKey="waste" stroke="var(--g-600)" strokeWidth={2} fill="url(#ag)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container">
          <div className="chart-title">Waste by Type</div>
          <div className="chart-sub">Distribution across all submissions</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={WASTE_TYPES_DATA} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={3}>
                {WASTE_TYPES_DATA.map((e,i)=><Cell key={i} fill={e.color}/>)}
              </Pie>
              <Legend iconType="circle" iconSize={10} wrapperStyle={{fontSize:13}}/>
              <Tooltip formatter={v=>[`${v}%`]}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fraud flags */}
      <div className="card" style={{border:"1px solid #fecaca"}}>
        <div className="section-header">
          <span className="section-title" style={{color:"var(--danger)",display:"flex",alignItems:"center",gap:6}}><AlertTriangle size={16}/> Fraud Alerts</span>
          <button className="btn btn-sm" style={{background:"#fef2f2",color:"#991b1b",border:"1px solid #fecaca"}}>View all</button>
        </div>
        {[
          {id:"P003",student:"Unknown",type:"Glass",weight:"4.2 kg",time:"38 min ago",reason:"Unregistered user"},
          {id:"P007",student:"Test User",type:"Plastic",weight:"15 kg",time:"2 hrs ago",reason:"Suspicious high volume"},
        ].map(f=>(
          <div key={f.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #fee2e2",flexWrap:"wrap",gap:8}}>
            <div>
              <div style={{fontWeight:600,fontSize:14,display:"flex",alignItems:"center",gap:8}}>
                <span className="fraud-badge"><AlertTriangle size={11}/> {f.reason}</span>
              </div>
              <div style={{fontSize:13,color:"var(--text-muted)",marginTop:3}}>{f.student} · {f.type} · {f.weight} · {f.time}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn btn-sm btn-danger">Block</button>
              <button className="btn btn-sm" style={{background:"var(--bg-subtle)",border:"1px solid var(--border)",color:"var(--text-muted)"}}>Dismiss</button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent users */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">Recent Registrations</span>
          <a href="/admin/users" className="section-action">View all →</a>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>User</th><th>Role</th><th>School</th><th>Joined</th></tr></thead>
            <tbody>
              {RECENT_USERS.map(u=>(
                <tr key={u.name}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,var(--g-600),var(--lime-dk))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff"}}>{u.av}</div>
                      <span style={{fontWeight:600,fontSize:14}}>{u.name}</span>
                    </div>
                  </td>
                  <td><span className={`badge ${ROLE_COLOR[u.role]||"badge-gray"}`}>{u.role}</span></td>
                  <td style={{color:"var(--text-muted)",fontSize:13}}>{u.school}</td>
                  <td style={{color:"var(--text-soft)",fontSize:13}}>{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
