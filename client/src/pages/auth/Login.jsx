import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff, ArrowRight, Recycle, Star, Shield } from "lucide-react";
import { authService } from "../../services/authService.js";
import { useAuth } from "../../hooks/useAuth.js";

const dashboardForRole = (role) => {
  if (role === "collector") return "/collector/dashboard";
  if (["school_admin", "operations_admin", "super_admin"].includes(role)) return "/admin/dashboard";
  return "/student/dashboard";
};

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm]   = useState({ email: "", password: "" });
  const [show, setShow]   = useState(false);
  const [err, setErr]     = useState("");
  const [busy, setBusy]   = useState(false);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const r = await authService.login(form);
      if (r.success && r.user) {
        setUser(r.user);
        localStorage.setItem("role", r.user.role);
        navigate(dashboardForRole(r.user.role));
      }
    } catch (ex) {
      setErr(ex.message || "Invalid email or password.");
    } finally { setBusy(false); }
  };

  return (
    <div className="auth-shell">
      {/* Brand panel */}
      <div className="auth-panel">
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:40 }}>
            <Leaf size={28} style={{ color:"var(--g-400)" }} />
            <span style={{ fontFamily:"var(--font-heading)", fontWeight:800, fontSize:22, color:"#fff" }}>JijiGreen</span>
          </div>
          <h2 style={{ fontFamily:"var(--font-heading)", fontSize:40, fontWeight:900, color:"#fff", lineHeight:1.1, marginBottom:16 }}>
            Recycling<br/>rewarded.
          </h2>
          <p style={{ color:"rgba(255,255,255,.65)", fontSize:15, lineHeight:1.7, maxWidth:320, marginBottom:40 }}>
            Join 500+ Kenyans earning eco-points for verified recycling. Real rewards, real impact.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {[
              { I:Recycle, t:"Submit recyclables at 50+ verified points across Kenya" },
              { I:Star,    t:"Earn points instantly — redeemable for airtime & vouchers" },
              { I:Shield,  t:"QR-verified submissions, fraud-proof and transparent" },
            ].map(({ I, t }) => (
              <div key={t} style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:8, background:"rgba(74,222,128,.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <I size={16} style={{ color:"var(--g-400)" }} />
                </div>
                <p style={{ fontSize:13, color:"rgba(255,255,255,.6)", lineHeight:1.6 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-form-panel">
        <div className="auth-form">
          <div>
            <h1 style={{ fontFamily:"var(--font-heading)", fontSize:28, fontWeight:800, marginBottom:6 }}>Welcome back</h1>
            <p style={{ color:"var(--text-muted)", fontSize:14 }}>
              Don't have an account? <Link to="/register" style={{ color:"var(--g-700)", fontWeight:600 }}>Sign up free</Link>
            </p>
          </div>

          {err && <div className="alert alert-error">{err}</div>}

          <form onSubmit={submit} style={{ display:"grid", gap:16 }}>
            <div className="field">
              <label className="field-label" htmlFor="login-email">Email address</label>
              <input id="login-email" className="input" type="email" placeholder="you@example.com" autoComplete="email" required value={form.email} onChange={set("email")} />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="login-password">Password</label>
              <div style={{ position:"relative" }}>
                <input id="login-password" className="input" type={show?"text":"password"} placeholder="••••••••" autoComplete="current-password" required value={form.password} style={{ paddingRight:44 }} onChange={set("password")} />
                <button type="button" onClick={()=>setShow(!show)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", color:"var(--text-soft)", background:"none", border:"none", cursor:"pointer" }}>
                  {show ? <EyeOff size={17}/> : <Eye size={17}/>}
                </button>
              </div>
              <div style={{ textAlign:"right" }}>
                <Link to="/forgot-password" style={{ fontSize:13, color:"var(--g-700)", fontWeight:600 }}>Forgot password?</Link>
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={busy} style={{ justifyContent:"center", padding:13, marginTop:4 }}>
              {busy ? <span className="spinner spinner-white"/> : <><ArrowRight size={16}/> Sign in</>}
            </button>
          </form>

          <p style={{ fontSize:12, color:"var(--text-soft)", textAlign:"center" }}>
            By signing in you agree to our <a href="#" style={{ color:"var(--g-700)" }}>Terms</a> and <a href="#" style={{ color:"var(--g-700)" }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
