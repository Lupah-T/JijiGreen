import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Leaf, Mail, QrCode, ShieldCheck } from "lucide-react";
import { authService } from "../../services/authService.js";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const submit = (event) => {
    event.preventDefault();
    setErr("");
    setBusy(true);
    authService
      .forgotPassword({ email })
      .then(() => setSent(true))
      .catch((ex) => setErr(ex.message || "Could not send reset link"))
      .finally(() => setBusy(false));
  };

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <Leaf size={28} style={{ color: "var(--g-400)" }} />
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 22, color: "#fff" }}>JijiGreen</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 40, fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 16 }}>
            Secure access<br />for your impact wallet.
          </h2>
          <p style={{ color: "rgba(255,255,255,.65)", fontSize: 15, lineHeight: 1.7, maxWidth: 340 }}>
            Reset your password and keep your Eco ID, reward balance, and verified recycling history protected.
          </p>
          <div className="auth-qr-card">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(74,222,128,.14)", display: "grid", placeItems: "center" }}>
                <QrCode size={24} style={{ color: "var(--g-300)" }} />
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 800 }}>Eco ID recovery</div>
                <div style={{ color: "rgba(255,255,255,.55)", fontSize: 13 }}>QR-linked accounts stay recoverable through verified email.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form">
          <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontWeight: 700, fontSize: 14 }}>
            <ArrowLeft size={16} /> Back to login
          </Link>
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 30, fontWeight: 900, marginBottom: 6 }}>Reset password</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              Enter your account email and we will send password reset instructions.
            </p>
          </div>

          {sent ? (
            <div className="alert alert-success" style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <ShieldCheck size={18} />
              <span>Check your email for a reset link.</span>
            </div>
          ) : null}
          {err && <div className="alert alert-error">{err}</div>}

          <form onSubmit={submit} style={{ display: "grid", gap: 16 }}>
            <div className="field">
              <label className="field-label" htmlFor="reset-email">Email address</label>
              <div style={{ position: "relative" }}>
                <input
                  id="reset-email"
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  value={email}
                  style={{ paddingRight: 44 }}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Mail size={17} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-soft)" }} />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={busy} style={{ justifyContent: "center", padding: 13 }}>
              {busy ? "Sending…" : "Send reset link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
