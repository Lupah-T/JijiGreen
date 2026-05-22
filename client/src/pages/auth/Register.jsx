import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff, ArrowRight, QrCode } from "lucide-react";
import { authService } from "../../services/authService.js";
import { validateRegisterForm } from "../../utils/validators.js";
import { useAuth } from "../../hooks/useAuth.js";

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
  const [form, setForm] = useState({ name:"", email:"", password:"" });
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
      const r = await authService.register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      if (r.success) {
        if (r.user) setUser(r.user);
        localStorage.setItem("role", r.user?.role || "student");
        navigate("/student/dashboard");
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
            {["Student by default","QR Eco ID","RBAC protected"].map(s=>(
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

            <div style={{display:"flex",gap:12,alignItems:"flex-start",background:"var(--g-50)",border:"1px solid var(--g-100)",borderRadius:"var(--r-md)",padding:14}}>
              <QrCode size={20} style={{color:"var(--g-700)",flexShrink:0,marginTop:2}}/>
              <div>
                <div style={{fontWeight:800,fontSize:14}}>All public accounts start as students</div>
                <p style={{fontSize:13,color:"var(--text-muted)",marginTop:2}}>
                  Collector and admin access is assigned later through secure review by authorized staff.
                </p>
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
