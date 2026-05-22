import { useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck, UserPlus, XCircle } from "lucide-react";
import { createPrivilegedUser, getCollectorApplications, getUsers, reviewCollectorApplication } from "../../api/adminApi.js";
import { useAuth } from "../../hooks/useAuth.js";

const INITIAL_USER = { name: "", email: "", password: "", role: "collector" };

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState(INITIAL_USER);
  const [message, setMessage] = useState("");

  const isSuperAdmin = user?.role === "super_admin";

  const load = () => {
    getUsers().then(({ data }) => setUsers(data.data || data)).catch(() => setUsers([]));
    getCollectorApplications().then(({ data }) => setApplications(data.data || [])).catch(() => setApplications([]));
  };

  useEffect(() => {
    load();
  }, []);

  const set = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await createPrivilegedUser(form);
      setForm(INITIAL_USER);
      setMessage("Privileged user created and audit logged.");
      load();
    } catch (error) {
      setMessage(error.message || "Could not create user.");
    }
  };

  const review = async (id, status) => {
    await reviewCollectorApplication(id, { status, moderationNotes: status === "approved" ? "Approved from admin console" : "Rejected from admin console" });
    load();
  };

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Users & Access</h1>
          <p className="page-subtitle">Create privileged users and review collector applications.</p>
        </div>
      </div>

      {isSuperAdmin ? (
        <div className="card">
          <div className="section-header"><span className="section-title"><UserPlus size={16} /> Create privileged user</span></div>
          {message ? <div className={message.includes("created") ? "alert alert-success" : "alert alert-error"} style={{ marginBottom: 14 }}>{message}</div> : null}
          <form onSubmit={submit} className="grid-4" style={{ alignItems: "end" }}>
            <div className="field"><label className="field-label">Name</label><input className="input" required value={form.name} onChange={set("name")} /></div>
            <div className="field"><label className="field-label">Email</label><input className="input" type="email" required value={form.email} onChange={set("email")} /></div>
            <div className="field"><label className="field-label">Password</label><input className="input" type="password" required value={form.password} onChange={set("password")} /></div>
            <div className="field">
              <label className="field-label">Role</label>
              <select className="input" value={form.role} onChange={set("role")}>
                <option value="collector">Collector</option>
                <option value="school_admin">School admin</option>
                <option value="operations_admin">Operations admin</option>
              </select>
            </div>
            <button className="btn btn-primary"><ShieldCheck size={15} /> Create securely</button>
          </form>
        </div>
      ) : null}

      <div className="card">
        <div className="section-header"><span className="section-title">Collector applications</span></div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Applicant</th><th>Collection point</th><th>County</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id}>
                  <td>{app.fullName}<div style={{ color: "var(--text-soft)", fontSize: 12 }}>{app.userId?.email}</div></td>
                  <td>{app.collectionPointName}</td>
                  <td>{app.county}</td>
                  <td><span className={`badge ${app.status === "approved" ? "badge-green" : app.status === "rejected" ? "badge-red" : "badge-amber"}`}>{app.status}</span></td>
                  <td>
                    {app.status === "pending" ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-primary btn-sm" onClick={() => review(app._id, "approved")}><CheckCircle2 size={13} /> Approve</button>
                        <button className="btn btn-sm" style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }} onClick={() => review(app._id, "rejected")}><XCircle size={13} /> Reject</button>
                      </div>
                    ) : "Reviewed"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="section-header"><span className="section-title">Platform users</span></div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id || u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className="badge badge-gray">{u.role}</span></td>
                  <td><span className={u.isActive === false ? "badge badge-red" : "badge badge-green"}>{u.isActive === false ? "Inactive" : "Active"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
