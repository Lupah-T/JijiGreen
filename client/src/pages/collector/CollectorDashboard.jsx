import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Recycle,
  Scale,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getCollectionHistory } from "../../api/collectorApi.js";
import WasteForm from "../../components/collector/WasteForm.jsx";

const unwrap = (response) =>
  Array.isArray(response.data?.data) ? response.data.data : [];

export default function CollectorDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setError("");
      const response = await getCollectionHistory();
      setSubmissions(unwrap(response));
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load collector activity."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const today = new Date();
  const verifiedToday = submissions.filter((item) => {
    if (item.status !== "verified" || !item.verifiedAt) return false;
    const date = new Date(item.verifiedAt);
    return date.toDateString() === today.toDateString();
  });

  const kgToday = verifiedToday.reduce(
    (total, item) => total + Number(item.weightKg || 0),
    0
  );

  const pending = submissions.filter((item) => item.status === "pending");

  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      return {
        date,
        day: date.toLocaleDateString("en", { weekday: "short" }),
        kg: 0,
      };
    });

    submissions
      .filter((item) => item.status === "verified")
      .forEach((item) => {
        const date = new Date(item.verifiedAt || item.createdAt);
        const day = days.find(
          (entry) => entry.date.toDateString() === date.toDateString()
        );
        if (day) day.kg += Number(item.weightKg || 0);
      });

    return days.map(({ day, kg }) => ({
      day,
      kg: Number(kg.toFixed(2)),
    }));
  }, [submissions]);

  const totalVerifiedKg = submissions
    .filter((item) => item.status === "verified")
    .reduce((total, item) => total + Number(item.weightKg || 0), 0);

  const totalPoints = submissions
    .filter((item) => item.status === "verified")
    .reduce((total, item) => total + Number(item.pointsAwarded || 0), 0);

  return (
import { useEffect, useMemo, useState } from "react";
import { CheckSquare, Recycle, Clock, AlertTriangle, QrCode, Scale, Save, X, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getCollectionPoints } from "../../api/collectionPointApi.js";
import { getCollectionHistory, getPendingSubmissions } from "../../api/collectorApi.js";

const WASTE_TYPES=[
  {v:"plastic",l:"Plastic Bottles",e:"🧴",pts:20},
  {v:"aluminium",l:"Aluminium Cans",e:"🥤",pts:30},
  {v:"paper",l:"Paper / Cardboard",e:"📄",pts:10},
  {v:"glass",l:"Glass",e:"🫙",pts:15},
];

const buildChartData = (submissions = []) => {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const totals = new Map(labels.map((label) => [label, 0]));

  submissions.forEach((submission) => {
    const label = new Date(submission.createdAt).toLocaleDateString("en-US", { weekday: "short" });
    if (totals.has(label)) {
      totals.set(label, totals.get(label) + Number(submission.weightKg || 0));
    }
  });

  return labels.map((label) => ({ d: label, kg: Number(totals.get(label).toFixed(1)) }));
};

export default function CollectorDashboard(){
  const[type,setType]=useState("plastic");
  const[weight,setWeight]=useState("");
  const[studentId,setStudentId]=useState("");
  const[collectionPoint,setCollectionPoint]=useState("");
  const[collectionPoints,setCollectionPoints]=useState([]);
  const[pending,setPending]=useState([]);
  const[history,setHistory]=useState([]);
  const[done,setDone]=useState(false);
  const[loading,setLoading]=useState(true);
  const pts=weight?Math.round(parseFloat(weight)||0)*WASTE_TYPES.find(w=>w.v===type)?.pts:0;
  const submit=e=>{e.preventDefault();if(!weight||!studentId||!collectionPoint)return;setDone(true);setTimeout(()=>{setDone(false);setWeight("");setStudentId("");},2500);};

  useEffect(()=>{
    let active = true;

    Promise.all([getCollectionPoints(), getPendingSubmissions(), getCollectionHistory()])
      .then(([pointsRes, pendingRes, historyRes])=>{
        if(!active)return;
        const points = pointsRes.data.data || pointsRes.data || [];
        setCollectionPoints(points);
        if(points[0]?._id) setCollectionPoint(points[0]._id);
        setPending(pendingRes.data.data || pendingRes.data || []);
        setHistory(historyRes.data.data || historyRes.data || []);
      })
      .catch(()=>{
        if(!active)return;
        setCollectionPoints([]);
        setPending([]);
        setHistory([]);
      })
      .finally(()=>{
        if(active)setLoading(false);
      });

    return ()=>{active=false;};
  },[]);

  const CHART_DATA=useMemo(()=>buildChartData(history),[history]);
  const livePending=pending.slice(0,3);
  const verifiedCount=history.filter((submission)=>submission.status==="verified").length;
  const collectedKg=history.reduce((sum,submission)=>sum+Number(submission.weightKg || 0),0);

  if(loading){
    return <div className="loader"><span className="spinner" /> Loading collector dashboard...</div>;
  }

  return(
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Collector Dashboard</h1>
          <p className="page-subtitle">
            Record collections, review AI suggestions and verify submissions.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert" style={{ color: "#b91c1c", marginBottom: 16 }}>
          <AlertCircle size={15} /> {error}
          <button className="btn btn-sm" onClick={refresh}>Retry</button>
        </div>
      )}

      <div className="dash-kpi-row">
        {[
          {
            icon: CheckCircle2,
            label: "Verified Today",
            value: loading ? "—" : verifiedToday.length,
            color: "var(--g-600)",
            bg: "#f0fdf4",
          },
          {
            icon: Scale,
            label: "Verified Weight",
            value: loading ? "—" : `${totalVerifiedKg.toFixed(1)} kg`,
            color: "#2563eb",
            bg: "#eff6ff",
          },
          {
            icon: Clock,
            label: "Pending",
            value: loading ? "—" : pending.length,
            color: "#d97706",
            bg: "#fffbeb",
          },
          {
            icon: Recycle,
            label: "Eco-points Awarded",
            value: loading ? "—" : totalPoints.toLocaleString(),
            color: "var(--g-600)",
            bg: "#f0fdf4",
          },
        ].map((item) => (
          <div className="kpi-card animate-fade-up" key={item.label}>
          {icon:CheckSquare,bg:"#f0fdf4",ic:"var(--g-600)",label:"Verified Today",v:String(verifiedCount),trend:"Live history",up:true},
          {icon:Recycle,    bg:"#eff6ff",ic:"#3b82f6",     label:"Kg Collected",  v:`${collectedKg.toFixed(1)} kg`,trend:"Live history",up:true},
          {icon:Clock,      bg:"#fffbeb",ic:"#d97706",     label:"Pending",       v:String(pending.length),trend:"Live queue",up:false},
          {icon:AlertTriangle,bg:"#fef2f2",ic:"#ef4444",  label:"Assigned Points",   v:String(collectionPoints.length),trend:"Live network",up:false},
        ].map(s=>(
          <div key={s.label} className="kpi-card animate-fade-up">
            <div className="kpi-card-header">
              <div>
                <div className="kpi-label">{item.label}</div>
                <div className="kpi-value" style={{ marginTop: 6 }}>
                  {item.value}
                </div>
              </div>
              <div className="kpi-icon" style={{ background: item.bg }}>
                <item.icon size={20} style={{ color: item.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <WasteForm onSubmitted={refresh} />
        {/* Verification form */}
        <div className="card">
          <div className="section-header"><span className="section-title">Log New Submission</span></div>
          {done?(
            <div style={{textAlign:"center",padding:"32px 0"}}>
              <CheckSquare size={44} style={{color:"var(--g-600)",margin:"0 auto 12px"}}/>
              <div style={{fontFamily:"var(--font-heading)",fontWeight:700,fontSize:17,marginBottom:6}}>Submission Verified!</div>
              <p style={{color:"var(--text-muted)",fontSize:14}}>{pts} eco-points awarded successfully.</p>
            </div>
          ):(
            <form onSubmit={submit} style={{display:"grid",gap:16}}>
              <div className="field">
                <span className="field-label">Student QR / ID</span>
                <div style={{position:"relative"}}>
                  <input className="input" placeholder="Scan QR code or enter Student ID" value={studentId} style={{paddingRight:44}} onChange={e=>setStudentId(e.target.value)} required/>
                  <QrCode size={17} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:"var(--text-soft)"}}/>
                </div>
              </div>
              <div className="field">
                <span className="field-label">Collection Point</span>
                <div style={{position:"relative"}}>
                  <select className="input" required value={collectionPoint} onChange={e=>setCollectionPoint(e.target.value)} style={{paddingRight:44}}>
                    <option value="">Select assigned point</option>
                    {collectionPoints.map(point=><option key={point._id} value={point._id}>{point.name} · {point.county}</option>)}
                  </select>
                  <MapPin size={17} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:"var(--text-soft)",pointerEvents:"none"}}/>
                </div>
              </div>
              <div className="field">
                <span className="field-label">Waste Type</span>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {WASTE_TYPES.map(w=>(
                    <button key={w.v} type="button" onClick={()=>setType(w.v)} style={{border:`2px solid ${type===w.v?"var(--g-600)":"var(--border)"}`,background:type===w.v?"var(--g-50)":"#fff",borderRadius:"var(--r-md)",padding:"9px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:8,transition:"all 180ms",color:type===w.v?"var(--g-700)":"var(--text-muted)",fontWeight:600,fontSize:13}}>
                      <span style={{fontSize:18}}>{w.e}</span>
                      <div><div>{w.l}</div><div style={{fontSize:11,opacity:.7}}>{w.pts} pts/kg</div></div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <span className="field-label">Weight (kg)</span>
                <div style={{position:"relative"}}>
                  <input className="input" type="number" min=".1" step=".1" placeholder="0.0" value={weight} style={{paddingRight:44}} onChange={e=>setWeight(e.target.value)} required/>
                  <Scale size={16} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:"var(--text-soft)"}}/>
                </div>
              </div>
              {pts>0&&(
                <div style={{background:"var(--g-50)",border:"1px solid var(--g-200)",borderRadius:"var(--r-md)",padding:"10px 14px",fontSize:13,color:"var(--g-800)",fontWeight:600}}>
                  Points to award: {pts} eco-points
                </div>
              )}
              <button className="btn btn-primary" type="submit" style={{justifyContent:"center",padding:12}}>
                <Save size={16}/> Confirm Submission
              </button>
            </form>
          )}
        </div>

        <div className="card">
          <div className="section-header">
            <span className="section-title">Pending Verifications</span>
            <span className="badge badge-amber">
              {loading ? "Loading..." : `${pending.length} pending`}
            </span>
          </div>

          {!loading && pending.length === 0 && (
            <div className="empty-state">
              <Clock size={28} />
              <div className="empty-state-title">No pending submissions</div>
              <div className="empty-state-sub">
                New submissions awaiting review will appear here.
            <span className="badge badge-amber">{pending.length} pending</span>
          </div>
          {livePending.map((p)=>(
            <div key={p._id} style={{border:`1px solid ${Number(p.weightKg || 0)>=3?"#fecaca":"var(--border)"}`,borderRadius:"var(--r-md)",padding:"14px",marginBottom:10,background:Number(p.weightKg || 0)>=3?"#fef2f2":"#fff"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontWeight:600,fontSize:14}}>{p.student?.name || "Unknown student"}</div>
                  <div style={{fontSize:12,color:"var(--text-muted)"}}>{p.wasteType} · {Number(p.weightKg || 0).toFixed(1)} kg · {new Date(p.createdAt).toLocaleString()}</div>
                </div>
                {Number(p.weightKg || 0)>=3&&<span className="fraud-badge"><AlertTriangle/>High Risk</span>}
              </div>
            </div>
          )}

          {pending.slice(0, 5).map((item) => (
            <div
              key={item._id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--r-md)",
                padding: 13,
                marginBottom: 10,
              }}
            >
              <strong>{item.student?.name || "Student"}</strong>
              <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                {item.materialCategory || item.wasteType} · {item.weightKg} kg
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
                {new Date(item.createdAt).toLocaleString()}
              </div>
            </div>
          ))}

          <a
            href="/collector/verify-waste"
            className="btn btn-primary btn-sm"
            style={{ display: "inline-flex", marginTop: 8 }}
          >
            Review submissions
          </a>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-title">Weekly Collection Volume</div>
        <div className="chart-sub">
          Verified kilograms over the last seven days
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barSize={32}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--text-soft)" }}
            />
            <YAxis hide />
            <Tooltip
              formatter={(value) => [`${value} kg`, "Verified weight"]}
            />
            <Bar dataKey="kg" fill="var(--g-600)" radius={[6, 6, 0, 0]} />
        <div className="chart-sub">Kilograms collected from live verified submissions</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={CHART_DATA} barSize={32}>
            <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontSize:12,fill:"var(--text-soft)"}}/>
            <YAxis hide/>
            <Tooltip contentStyle={{borderRadius:8,border:"1px solid var(--border)",fontSize:13}} formatter={v=>[`${v} kg`]}/>
            <Bar dataKey="kg" fill="var(--g-600)" radius={[6,6,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
