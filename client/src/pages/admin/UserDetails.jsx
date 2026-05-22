import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, User as UserIcon, Calendar, Phone, Mail, Award, Coins, Trash2, Package } from "lucide-react";
import { getUserDetails } from "../../api/adminApi.js";

export default function UserDetails() {
  const { userId } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getUserDetails(userId)
      .then((res) => {
        setDetails(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load user details.");
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div className="p-4">Loading user details...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!details) return null;

  const { profile, collections, vouchers, stats } = details;

  return (
    <>
      <div className="dashboard-header" style={{ marginBottom: 20 }}>
        <div>
          <Link to="/admin/users" className="btn btn-sm" style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={16} /> Back to Users
          </Link>
          <h1 className="page-title">User Details</h1>
          <p className="page-subtitle">Detailed statistics and profile for {profile.name}</p>
        </div>
      </div>

      <div className="grid-2">
        {/* Profile Details */}
        <div className="card">
          <div className="section-header">
            <span className="section-title"><UserIcon size={16} /> Profile Details</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border-color)" }}>
              <span style={{ color: "var(--text-soft)" }}>Name</span>
              <strong>{profile.name}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border-color)" }}>
              <span style={{ color: "var(--text-soft)" }}>Email</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Mail size={14} /> {profile.email}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border-color)" }}>
              <span style={{ color: "var(--text-soft)" }}>Phone</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Phone size={14} /> {profile.phone || "N/A"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border-color)" }}>
              <span style={{ color: "var(--text-soft)" }}>Role</span>
              <span className="badge badge-primary" style={{ textTransform: 'capitalize' }}>{profile.role.replace("_", " ")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border-color)" }}>
              <span style={{ color: "var(--text-soft)" }}>Status</span>
              <span className={profile.isActive === false ? "badge badge-red" : "badge badge-green"}>
                {profile.isActive === false ? "Inactive" : "Active"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border-color)" }}>
              <span style={{ color: "var(--text-soft)" }}>School</span>
              <strong>{profile.school ? profile.school.name : "N/A"}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "8px", borderBottom: "1px solid var(--border-color)" }}>
              <span style={{ color: "var(--text-soft)" }}>Joined</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} /> {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Statistics overview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", color: "white" }}>
            <Coins size={32} style={{ marginBottom: 12, opacity: 0.8 }} />
            <h2 style={{ fontSize: 36, margin: 0 }}>{profile.ecoPoints}</h2>
            <div style={{ opacity: 0.9, marginTop: 4 }}>Current Eco Points</div>
          </div>

          <div style={{ display: "flex", gap: 20 }}>
            <div className="card" style={{ flex: 1, textAlign: "center" }}>
              <div style={{ color: "var(--text-soft)", fontSize: 13, marginBottom: 8 }}>Total Points Earned</div>
              <div style={{ fontSize: 24, fontWeight: "bold", color: "#10b981" }}>{stats.totalPointsEarned}</div>
            </div>
            <div className="card" style={{ flex: 1, textAlign: "center" }}>
              <div style={{ color: "var(--text-soft)", fontSize: 13, marginBottom: 8 }}>Total Points Redeemed</div>
              <div style={{ fontSize: 24, fontWeight: "bold", color: "#f59e0b" }}>{stats.totalPointsRedeemed}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-header">
          <span className="section-title"><Trash2 size={16} /> Collections History</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Waste Type</th>
                <th>Weight (kg)</th>
                <th>Points Awarded</th>
                <th>Status</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {collections.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: "center", color: "var(--text-soft)" }}>No collections found.</td></tr>
              ) : (
                collections.map((c) => (
                  <tr key={c._id}>
                    <td style={{ textTransform: "capitalize" }}>{c.wasteType}</td>
                    <td>{c.weightKg} kg</td>
                    <td><span style={{ color: "#10b981", fontWeight: "bold" }}>+{c.pointsAwarded || 0}</span></td>
                    <td>
                      <span className={`badge ${c.status === "verified" ? "badge-green" : c.status === "rejected" ? "badge-red" : "badge-amber"}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>{new Date(c.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-header">
          <span className="section-title"><Award size={16} /> Rewards Earned</span>
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Reward Title</th>
                <th>Points Cost</th>
                <th>Redeemed Status</th>
                <th>Date & Time Awarded</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: "center", color: "var(--text-soft)" }}>No rewards earned yet.</td></tr>
              ) : (
                vouchers.map((v) => (
                  <tr key={v._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Package size={16} style={{ color: "var(--text-soft)" }} />
                        {v.reward?.title || "Unknown Reward"}
                      </div>
                    </td>
                    <td><span style={{ color: "#f59e0b", fontWeight: "bold" }}>-{v.reward?.pointsCost || 0}</span></td>
                    <td>
                      <span className={v.redeemed ? "badge badge-green" : "badge badge-amber"}>
                        {v.redeemed ? "Claimed" : "Unclaimed"}
                      </span>
                    </td>
                    <td>{new Date(v.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
