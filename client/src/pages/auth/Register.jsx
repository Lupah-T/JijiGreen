import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService.js";
import { validateRegisterForm } from "../../utils/validators.js";
import { Leaf, Eye, EyeOff, GraduationCap, Truck, ShieldCheck } from "lucide-react";

const ROLES = [
  { value: "student",   label: "Student",   icon: <GraduationCap size={16} />, desc: "Earn eco-points by recycling" },
  { value: "collector", label: "Collector",  icon: <Truck         size={16} />, desc: "Verify waste submissions" },
  { value: "admin",     label: "Admin",      icon: <ShieldCheck   size={16} />, desc: "Manage the platform" },
];

function PasswordStrength({ password }) {
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) => r.test(password)).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#16a34a"];
  if (!password) return null;
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 4,
            background: i <= score ? colors[score] : "#e2e8f0",
            transition: "background 300ms",
          }} />
        ))}
      </div>
      <span style={{ fontSize: 12, color: colors[score], fontWeight: 600 }}>{labels[score]}</span>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const validationErrors = validateRegisterForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const result = await authService.register({ ...form, name: form.name.trim(), email: form.email.trim() });
      if (result.success) navigate("/login");
    } catch (error) {
      setErrors(error.fieldErrors || {});
      setMessage(
        error.statusCode === 409 ? "An account with this email already exists." :
        error.statusCode === 500 ? "Something went wrong. Please try again." :
        error.message,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      {/* Brand panel */}
      <div className="auth-brand-panel">
        <div className="auth-brand-logo">
          <Leaf size={24} /> JijiGreen
        </div>
        <h2>Start your<br />eco journey today.</h2>
        <p>
          Join thousands of Kenyans turning waste into rewards.
          Register in under 30 seconds — it&apos;s completely free.
        </p>
        <div className="auth-features" style={{ marginTop: 40 }}>
          {ROLES.map((r) => (
            <div className="auth-feature-item" key={r.value}>
              <div className="auth-feature-icon">{r.icon}</div>
              <div>
                <div style={{ color: "white", fontWeight: 600, fontSize: 14 }}>{r.label}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-form-panel">
        <form className="auth-card fade-in" noValidate onSubmit={handleSubmit} id="register-form">
          <div>
            <h1>Create account</h1>
            <p className="subtitle" style={{ marginTop: 6 }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "var(--clr-emerald)", fontWeight: 600 }}>Sign in</Link>
            </p>
          </div>

          {message && (
            <p className={`alert ${Object.keys(errors).length > 0 ? "error" : "success"}`} role="alert">
              {message}
            </p>
          )}

          <label className="field">
            <span>Full name</span>
            <input
              id="register-name"
              className="input"
              placeholder="Your full name"
              value={form.name}
              autoComplete="name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <small className="field-error">{errors.name}</small>}
          </label>

          <label className="field">
            <span>Email address</span>
            <input
              id="register-email"
              className="input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              autoComplete="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </label>

          <label className="field">
            <span>Password</span>
            <div style={{ position: "relative" }}>
              <input
                id="register-password"
                className="input"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={form.password}
                autoComplete="new-password"
                style={{ paddingRight: 44 }}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--clr-subtle)", display: "flex", alignItems: "center",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <PasswordStrength password={form.password} />
            {errors.password && <small className="field-error">{errors.password}</small>}
          </label>

          {/* Role selector pills */}
          <div className="field">
            <span>I am a…</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  id={`role-${r.value}`}
                  onClick={() => setForm({ ...form, role: r.value })}
                  style={{
                    border: form.role === r.value ? "2px solid var(--clr-emerald)" : "2px solid #e2e8f0",
                    background: form.role === r.value ? "var(--clr-success-bg)" : "var(--clr-white)",
                    borderRadius: "var(--r-md)",
                    padding: "10px 8px",
                    cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                    transition: "all 200ms",
                    color: form.role === r.value ? "var(--clr-emerald)" : "var(--clr-muted)",
                    fontWeight: 600, fontSize: 13,
                  }}
                >
                  {r.icon}
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <button
            id="register-submit"
            className="button"
            disabled={isSubmitting}
            type="submit"
            style={{ justifyContent: "center", padding: "13px" }}
          >
            {isSubmitting ? (
              <><span className="spinner" /> Creating account…</>
            ) : "Create free account"}
          </button>

          <p style={{ fontSize: 12, color: "var(--clr-subtle)", textAlign: "center" }}>
            By registering you agree to our{" "}
            <a href="#" style={{ color: "var(--clr-emerald)" }}>Terms of Service</a> and{" "}
            <a href="#" style={{ color: "var(--clr-emerald)" }}>Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
}
