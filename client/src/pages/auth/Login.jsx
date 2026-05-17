import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { validateLoginForm } from "../../utils/validators.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const validationErrors = validateLoginForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const data = await login({
        ...form,
        email: form.email.trim(),
      });

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
    <form className="panel auth-card" noValidate onSubmit={handleSubmit}>
      <h1>Login</h1>

      {message && <p className="alert error">{message}</p>}

      <label className="field">
        <span>Email</span>
        <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        {errors.email && <small className="field-error">{errors.email}</small>}
      </label>

      <label className="field">
        <span>Password</span>
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {errors.password && <small className="field-error">{errors.password}</small>}
      </label>

      <button className="button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
