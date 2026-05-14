import { useState } from "react";
import { registerUser } from "../../api/authApi.js";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await registerUser(form);
  };

  return (
    <form className="panel auth-card" onSubmit={handleSubmit}>
      <h1>Create account</h1>
      <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
        <option value="student">Student</option>
        <option value="collector">Collector</option>
        <option value="admin">Admin</option>
      </select>
      <button className="button" type="submit">Register</button>
    </form>
  );
}
