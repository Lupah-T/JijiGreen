import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff, ArrowRight, GraduationCap, Truck, ShieldCheck } from "lucide-react";
import { authService } from "../../services/authService.js";
import { validateRegisterForm } from "../../utils/validators.js";
import { useAuth } from "../../hooks/useAuth.js";

const ROLES = [
  { value:"student",  label:"Student",   Icon:GraduationCap, desc:"Earn eco-points by recycling" },
  { value:"collector",label:"Collector", Icon:Truck,         desc:"Verify waste submissions" },
  { value:"admin",    label:"Admin",     Icon:ShieldCheck,   desc:"Manage the platform" },
];

function PasswordStrength({ pw }) {
  const score = [/.{8,}/,/[A-Z]/,/[0-9]/,/[^A-Za-z0-9]/].filter(r=>r.test(pw)).length;
  const colors = ["","#ef4444","#f59e0b","#3b82f6","var(--g-600)"];
  const labels = ["","Weak","Fair","Good","Strong"];
  if (!pw) return null;
  return (
    <div style={{marginTop:6}}>
      <div style={{display:"flex",gap:4,marginBottom:4}}>
        {[1,2,3,4].map(i=><div key={i} style={{flex:1,height:4,borderRadius:4,background:i<=score?colors[score]:"var(--bg-muted)",transition:"background 300ms"}}/>)}
      </div>
      <span style={{fontSize:12,color:colors[score],fontWeight:600}}>{labels[score]}</span>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ name:"", email:"", password:"", role:"student" });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  const set = (k) => (e) => setForm(p=>({...p,[k]:e.target.value}));

  const submit = async (e) => {
    e.preventDefault(); setMsg("");
    const v = validateRegisterForm(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setBusy(true);
    try {
      const r = await authService.register({...form, name:form.name.trim(), email:form.email.trim()});
      if (r.success) {
        if (r.user) setUser(r.user);
        localStorage.setItem("role", r.user?.role || form.role);
        navigate(`/${r.user?.role || form.role}/dashboard`);
      }
    } catch (ex) {
      const code = ex.statusCode;
      setMsg(code===409?"An account with this email already exists.":code===422?(ex.message||"Invalid form data."):"Something went wrong. Please try again.");
      setErrors(ex.fieldErrors || {});
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-shell">
      {/* Brand panel */}
      <div className="auth-panel">
        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:40}}>
            <Leaf size={28} style={{color:"var(--g-400)"}}/> 
            <span style={{fontFamily:"var(--font-heading)",fontWeight:800,fontSize:22,color:"#fff"}}>JijiGreen</span>
          </div>
          <h2 style={{fontFamily:"var(--font-heading)",fontSize:38,fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:16}}>
            Start your<br/>green journey.
          </h2>
          <p style={{color:"rgba(255,255,255,.65)",fontSize:15,lineHeight:1.7,maxWidth:320,marginBottom:40}}>
            Create your free account, get your personal QR code, and start earning eco-points for every recycling drop-off.
          </p>
          {/* SDG chips */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {["SDG 11","SDG 12","SDG 13"].map(s=>(
              <span key={s} style={{background:"rgba(74,222,128,.15)",border:"1px solid rgba(74,222,128,.25)",borderRadius:100,padding:"5px 14px",fontSize:13,color:"var(--g-300)",fontWeight:600}}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="auth-form-panel">
        <div className="auth-form">
          <div>
            <h1 style={{fontFamily:"var(--font-heading)",fontSize:28,fontWeight:800,marginBottom:6}}>Create your account</h1>
            <p style={{color:"var(--text-muted)",fontSize:14}}>
              Already have one? <Link to="/login" style={{color:"var(--g-700)",fontWeight:600}}>Sign in</Link>
            </p>
          </div>

          {msg && <div className="alert alert-error">{msg}</div>}

          <form onSubmit={submit} style={{display:"grid",gap:16}}>
            {/* Name */}
            <div className="field">
              <label className="field-label" htmlFor="reg-name">Full name</label>
              <input id="reg-name" className="input" placeholder="Amina Odhiambo" required value={form.name} onChange={set("name")}/>
              {errors.name&&<span className="field-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="field">
              <label className="field-label" htmlFor="reg-email">Email address</label>
              <input id="reg-email" className="input" type="email" placeholder="you@example.com" required value={form.email} onChange={set("email")}/>
              {errors.email&&<span className="field-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="field">
              <label className="field-label" htmlFor="reg-pass">Password</label>
              <div style={{position:"relative"}}>
                <input id="reg-pass" className="input" type={show?"text":"password"} placeholder="Min 8 chars, uppercase, number" required value={form.password} style={{paddingRight:44}} onChange={set("password")}/>
                <button type="button" onClick={()=>setShow(!show)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",color:"var(--text-soft)",background:"none",border:"none",cursor:"pointer"}}>
                  {show?<EyeOff size={17}/>:<Eye size={17}/>}
                </button>
              </div>
              <PasswordStrength pw={form.password}/>
              {errors.password&&<span className="field-error">{errors.password}</span>}
            </div>

            {/* Role */}
            <div className="field">
              <span className="field-label">I am a…</span>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
                {ROLES.map(({value,label,Icon,desc})=>(
                  <button key={value} type="button" onClick={()=>setForm(p=>({...p,role:value}))} style={{
                    border:`2px solid ${form.role===value?"var(--g-600)":"var(--border)"}`,
                    background:form.role===value?"var(--g-50)":"#fff",
                    borderRadius:"var(--r-md)",padding:"12px 8px",cursor:"pointer",
                    display:"flex",flexDirection:"column",alignItems:"center",gap:6,
                    transition:"all 180ms",color:form.role===value?"var(--g-700)":"var(--text-muted)",
                    fontSize:12,fontWeight:600,
                  }}>
                    <Icon size={18}/>{label}
                    <span style={{fontSize:10,fontWeight:400,opacity:.7,lineHeight:1.3,textAlign:"center"}}>{desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" type="submit" disabled={busy} style={{justifyContent:"center",padding:13,marginTop:4}}>
              {busy?<span className="spinner spinner-white"/>:<><ArrowRight size={16}/> Create account</>}
            </button>
          </form>

          <p style={{fontSize:12,color:"var(--text-soft)",textAlign:"center"}}>
            By creating an account you agree to our <a href="#" style={{color:"var(--g-700)"}}>Terms</a> and <a href="#" style={{color:"var(--g-700)"}}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
