import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, BarChart2, Download, Recycle, School, Star, TrendingUp, Users } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { getAdminDashboard } from "../../api/adminApi.js";

const ROLE_COLOR={student:"badge-green",collector:"badge-blue",school_admin:"badge-gray",operations_admin:"badge-amber",super_admin:"badge-red"};

const colorPalette = ["#16a34a", "#3b82f6", "#f59e0b", "#8b5cf6", "#06b6d4", "#ef4444"];

export default function AdminDashboard(){
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getAdminDashboard()
      .then(({ data }) => {
        if (!active) return;
        setAnalytics(data.data || data || null);
      })
      .catch(() => {
        if (active) setAnalytics(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const trendData = analytics?.monthlyTrend || [];
  const wasteData = (analytics?.wasteByType || []).map((item, index) => ({
    name: item.wasteType ? item.wasteType.replace(/_/g, " ") : "Other",
    value: Number(item.weight || 0),
    color: colorPalette[index % colorPalette.length],
  }));
  const recentUsers = analytics?.recentUsers || [];
  const recentSubmissions = analytics?.recentSubmissions || [];

  const stats = useMemo(() => ({
    students: analytics?.students || 0,
    schools: analytics?.schools || 0,
    submissions: analytics?.submissions || 0,
    totalWasteKg: Number(analytics?.totalWasteKg || 0),
  }), [analytics]);

  if (loading) {
    return <div className="loader"><span className="spinner" /> Loading admin dashboard...</div>;
  }

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
          {icon:Users,      bg:"#eff6ff",ic:"#3b82f6", label:"Total Students",      v:String(stats.students),    trend:"Live platform data",up:true},
          {icon:School,     bg:"#f0fdf4",ic:"var(--g-600)",label:"Partner Schools",v:String(stats.schools),   trend:"Live platform data",up:true},
          {icon:Recycle,    bg:"#fef9c3",ic:"#d97706", label:"Waste Collected",  v:`${stats.totalWasteKg.toFixed(1)} kg`,  trend:"Verified submissions",up:true},
          {icon:Star,       bg:"#fdf4ff",ic:"#a21caf", label:"Submissions",   v:String(stats.submissions), trend:"Live platform data",up:true},
          {icon:AlertTriangle,bg:"#fef2f2",ic:"#ef4444",label:"Recent reviews",    v:String(recentSubmissions.filter((submission) => submission.status === "pending").length),      trend:"Pending submissions",up:false},
          {icon:BarChart2,  bg:"#f0fdf4",ic:"var(--g-600)",label:"Dashboard months",v:String(trendData.length),trend:"Live trend series",up:true},
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
          <div className="chart-sub">Last six months of live waste data</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--g-600)" stopOpacity=".2"/>
                  <stop offset="95%" stopColor="var(--g-600)" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize:12,fill:"var(--text-soft)"}}/>
              <YAxis hide/>
              <Tooltip contentStyle={{borderRadius:8,border:"1px solid var(--border)",fontSize:13}} formatter={v=>[`${v} kg`]}/>
              <Area type="monotone" dataKey="waste" stroke="var(--g-600)" strokeWidth={2} fill="url(#ag)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container">
          <div className="chart-title">Waste by Type</div>
          <div className="chart-sub">Verified submissions by material</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={wasteData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={3}>
                {wasteData.map((e,i)=><Cell key={i} fill={e.color}/>) }
              </Pie>
              <Legend iconType="circle" iconSize={10} wrapperStyle={{fontSize:13}}/>
              <Tooltip formatter={v=>[`${Number(v).toFixed(1)} kg`]}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent submissions */}
      <div className="card">
        <div className="section-header">
          <span className="section-title" style={{display:"flex",alignItems:"center",gap:6}}><AlertTriangle size={16}/> Recent submissions</span>
          <span className="badge badge-amber">{recentSubmissions.length} live</span>
        </div>
        {recentSubmissions.length ? recentSubmissions.map((submission) => (
          <div key={submission._id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid var(--bg-subtle)",flexWrap:"wrap",gap:8}}>
            <div>
              <div style={{fontWeight:600,fontSize:14,display:"flex",alignItems:"center",gap:8}}>
                <span className={`badge ${submission.status === "verified" ? "badge-green" : submission.status === "pending" ? "badge-amber" : "badge-red"}`}>{submission.status}</span>
              </div>
              <div style={{fontSize:13,color:"var(--text-muted)",marginTop:3}}>{submission.student?.name || "Unknown student"} · {submission.wasteType} · {Number(submission.weightKg || 0).toFixed(1)} kg · {new Date(submission.createdAt).toLocaleString()}</div>
            </div>
            <div style={{color:"var(--text-soft)",fontSize:12}}>{submission.collectionPoint?.name || "No collection point"}</div>
          </div>
        )) : (
          <div className="empty-state" style={{ padding: "20px 0" }}>
            <div className="empty-state-title">No recent submissions</div>
            <div className="empty-state-sub">Live waste submissions will appear here once the platform is active.</div>
          </div>
        )}
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
              {recentUsers.map((u)=>(
                <tr key={u._id}>
                  <td>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,var(--g-600),var(--lime-dk))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"#fff"}}>{u.av}</div>
                      <span style={{fontWeight:600,fontSize:14}}>{u.name}</span>
                    </div>
                  </td>
                  <td><span className={`badge ${ROLE_COLOR[u.role]||"badge-gray"}`}>{u.role}</span></td>
                  <td style={{color:"var(--text-muted)",fontSize:13}}>{u.school?.name || "—"}</td>
                  <td style={{color:"var(--text-soft)",fontSize:13}}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
