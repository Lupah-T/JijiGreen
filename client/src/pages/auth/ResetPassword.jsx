import { useState } from "react";
import { Link, useNavigate, useSearchParams, useParams } from "react-router-dom";
import { ArrowLeft, Leaf } from "lucide-react";
import { authService } from "../../services/authService.js";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const token = params.token || searchParams.get("token");
  const email = searchParams.get("email") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!token) return setErr("Missing token");
    if (password !== confirmPassword) return setErr("Passwords do not match");
    setBusy(true);
    try {
      await authService.resetPassword({ token, password });
      setSuccess(true);
      navigate("/login", { state: { resetSuccess: true, message: "Password updated — please sign in" } });
    } catch (ex) {
      setErr(ex.message || "Could not reset password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <Leaf size={28} style={{ color: "var(--g-400)" }} />
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 22, color: "#fff" }}>JijiGreen</span>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form">
          <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontWeight: 700, fontSize: 14 }}>
            <ArrowLeft size={16} /> Back to login
          </Link>

          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 30, fontWeight: 900, marginBottom: 6 }}>Set a new password</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Enter a new password for <strong>{email}</strong>.</p>
          </div>

          {success && <div className="alert alert-success">Password updated — redirecting to login…</div>}
          {err && <div className="alert alert-error">{err}</div>}

          <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
            <div className="field">
              <label className="field-label">New password</label>
              <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="field">
              <label className="field-label">Confirm password</label>
              <input className="input" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary" type="submit" disabled={busy}>{busy ? "Saving…" : "Save new password"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
