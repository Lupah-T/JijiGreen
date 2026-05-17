import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService.js";
import { validateRegisterForm } from "../../utils/validators.js";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    const validationErrors = validateRegisterForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      const result = await authService.register({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
      });

      if (result.success) {
        navigate("/login");
      }
    } catch (error) {
      setErrors(error.fieldErrors || {});
      setMessage(error.statusCode === 409 ? "User already exists" : error.statusCode === 500 ? "Something went wrong" : error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="panel auth-card" noValidate onSubmit={handleSubmit}>
      <h1>Create account</h1>

      {message && <p className={Object.keys(errors).length > 0 ? "alert error" : "alert success"}>{message}</p>}

      <label className="field">
        <span>Name</span>
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        {errors.name && <small className="field-error">{errors.name}</small>}
      </label>

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

      <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="student">Student</option>
        <option value="collector">Collector</option>
        <option value="admin">Admin</option>
      </select>
      <button className="button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
