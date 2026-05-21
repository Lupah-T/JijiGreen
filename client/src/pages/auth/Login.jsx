import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { validateLoginForm } from "../../utils/validators.js";
import { Leaf, Eye, EyeOff, Recycle, Trophy, Shield } from "lucide-react";

const FEATURES = [
  { icon: <Recycle size={16} />, text: "Track every gram of recyclables you submit" },
  { icon: <Trophy  size={16} />, text: "Earn eco-points and climb the leaderboard" },
  { icon: <Shield  size={16} />, text: "Verified collection with QR-code technology" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const validationErrors = validateLoginForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const data = await login({ ...form, email: form.email.trim() });
      localStorage.setItem("role", data.user.role);
      navigate(`/${data.user.role}/dashboard`);
    } catch (error) {
      setErrors(error.fieldErrors || {});
      setMessage(error.message);
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
        <h2>Welcome back,<br />eco champion.</h2>
        <p>Sign in to track your recycling impact, claim rewards, and keep climbing the leaderboard.</p>
        <div className="auth-features">
          {FEATURES.map((f) => (
            <div className="auth-feature-item" key={f.text}>
              <div className="auth-feature-icon">{f.icon}</div>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-form-panel">
        <form className="auth-card fade-in" noValidate onSubmit={handleSubmit} id="login-form">
          <div>
            <h1>Sign in</h1>
            <p className="subtitle" style={{ marginTop: 6 }}>
              Don&apos;t have an account?{" "}
              <Link to="/register" style={{ color: "var(--clr-emerald)", fontWeight: 600 }}>
                Create one free
              </Link>
            </p>
          </div>

          {message && <p className="alert error" role="alert">{message}</p>}

          <label className="field">
            <span>Email address</span>
            <input
              id="login-email"
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
                id="login-password"
                className="input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                autoComplete="current-password"
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
            {errors.password && <small className="field-error">{errors.password}</small>}
          </label>

          <div style={{ textAlign: "right", marginTop: -8 }}>
            <Link to="/forgot-password" style={{ fontSize: 13, color: "var(--clr-emerald)", fontWeight: 600 }}>
              Forgot password?
            </Link>
          </div>

          <button
            id="login-submit"
            className="button"
            disabled={isSubmitting}
            type="submit"
            style={{ justifyContent: "center", padding: "13px" }}
          >
            {isSubmitting ? (
              <><span className="spinner" /> Signing in…</>
            ) : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
