import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = await login(form);
    localStorage.setItem("role", data.user.role);
    navigate(`/${data.user.role}/dashboard`);
  };

  return (
    <form className="panel auth-card" onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button className="button" type="submit">Login</button>
    </form>
  );
}
