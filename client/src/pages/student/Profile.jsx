import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { getProfile, updateProfile } from "../../api/studentApi.js";
import { Camera, Save, User, Mail, Phone, FileText, Award, Zap, CheckCircle, AlertCircle } from "lucide-react";

function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "U";
}

function getTier(points = 0) {
  if (points >= 5000) return { label: "Gold",   bg: "#fef9c3", color: "#a16207" };
  if (points >= 1000) return { label: "Silver", bg: "#f1f5f9", color: "#475569" };
  return                     { label: "Bronze", bg: "#fef3c7", color: "#92400e" };
}

export default function Profile() {
  const { user, setUser } = useAuth();
  const fileRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", bio: "", avatarUrl: "" });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }

  // Load profile
  useEffect(() => {
    getProfile()
      .then(({ data }) => {
        const u = data.data || data;
        setProfile(u);
        setForm({
          name:      u.name      || "",
          phone:     u.phone     || "",
          bio:       u.bio       || "",
          avatarUrl: u.avatarUrl || "",
        });
        if (u.avatarUrl) setPreview(u.avatarUrl);
      })
      .catch(() => {
        // Fallback to context user
        if (user) {
          setProfile(user);
          setForm({ name: user.name || "", phone: user.phone || "", bio: user.bio || "", avatarUrl: user.avatarUrl || "" });
          if (user.avatarUrl) setPreview(user.avatarUrl);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Handle local file → base64 preview (no backend upload needed for demo)
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast("error", "Image must be under 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target.result;
      setPreview(base64);
      setForm((f) => ({ ...f, avatarUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateProfile(form);
      const updated = data.data || data;
      setProfile(updated);
      if (setUser) setUser((prev) => ({ ...prev, ...updated }));
      showToast("success", "Profile updated successfully!");
    } catch {
      showToast("error", "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  if (loading) {
    return (
      <div className="loader">
        <span className="spinner spinner-green" />
        Loading profile…
      </div>
    );
  }

  const tier   = getTier(profile?.ecoPoints || 0);
  const initials = getInitials(form.name || profile?.name);

  return (
    <>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 999,
          background: toast.type === "success" ? "#f0fdf4" : "#fef2f2",
          border: `1px solid ${toast.type === "success" ? "#bbf7d0" : "#fecaca"}`,
          borderRadius: "var(--r-md)",
          padding: "12px 20px",
          display: "flex", alignItems: "center", gap: 10,
          boxShadow: "var(--shadow-md)",
          color: toast.type === "success" ? "#15803d" : "#991b1b",
          fontWeight: 600, fontSize: 14,
          animation: "fade-in 250ms ease-out",
        }}>
          {toast.type === "success"
            ? <CheckCircle size={18} />
            : <AlertCircle size={18} />}
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="page-title">My Profile</h1>
        <p style={{ color: "var(--clr-muted)", marginTop: 4 }}>
          View and update your personal details
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>
        {/* ── Left: Avatar card ── */}
        <div className="panel" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          {/* Avatar */}
          <div style={{ position: "relative", display: "inline-block" }}>
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                style={{
                  width: 120, height: 120, borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid var(--clr-border)",
                  boxShadow: "var(--shadow-md)",
                }}
              />
            ) : (
              <div style={{
                width: 120, height: 120, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--clr-emerald), var(--clr-lime))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 36,
                color: "white",
                boxShadow: "var(--shadow-md)",
              }}>
                {initials}
              </div>
            )}
            {/* Camera button */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Change profile photo"
              style={{
                position: "absolute", bottom: 4, right: 4,
                width: 34, height: 34, borderRadius: "50%",
                background: "var(--clr-emerald)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", cursor: "pointer", border: "2px solid white",
                boxShadow: "var(--shadow-sm)",
                transition: "transform var(--t-fast)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <Camera size={16} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
          </div>

          <div>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18 }}>
              {form.name || "Your Name"}
            </div>
            <div style={{ color: "var(--clr-muted)", fontSize: 13, marginTop: 2 }}>
              {profile?.email}
            </div>
          </div>

          {/* Tier badge */}
          <span style={{
            background: tier.bg, color: tier.color,
            border: `1px solid ${tier.color}40`,
            borderRadius: 100, padding: "5px 16px",
            fontSize: 13, fontWeight: 700,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <Award size={14} /> {tier.label} Member
          </span>

          {/* Eco points */}
          <div style={{
            background: "var(--clr-surface)", borderRadius: "var(--r-md)",
            padding: "14px 20px", width: "100%",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <Zap size={20} style={{ color: "var(--clr-lime)", flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 22, color: "var(--clr-forest)", lineHeight: 1 }}>
                {(profile?.ecoPoints || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: "var(--clr-muted)", marginTop: 2 }}>Eco Points</div>
            </div>
          </div>

          <div style={{ fontSize: 12, color: "var(--clr-subtle)", lineHeight: 1.5 }}>
            Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-KE", { year: "numeric", month: "long" }) : "—"}
          </div>
        </div>

        {/* ── Right: Edit form ── */}
        <form onSubmit={handleSave} style={{ display: "grid", gap: 20 }}>
          {/* Personal info panel */}
          <div className="panel" style={{ display: "grid", gap: 18 }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              <User size={18} style={{ color: "var(--clr-emerald)" }} /> Personal Information
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <label className="field">
                <span>Full Name</span>
                <input
                  className="input"
                  value={form.name}
                  placeholder="Your full name"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>

              <label className="field">
                <span>Email Address</span>
                <input
                  className="input"
                  value={profile?.email || ""}
                  disabled
                  style={{ background: "#f8fafc", color: "var(--clr-muted)", cursor: "not-allowed" }}
                  title="Email cannot be changed"
                />
              </label>

              <label className="field">
                <span>Phone Number</span>
                <div style={{ position: "relative" }}>
                  <input
                    className="input"
                    value={form.phone}
                    placeholder="+254 7XX XXX XXX"
                    style={{ paddingLeft: 44 }}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  <Phone size={16} style={{
                    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                    color: "var(--clr-subtle)",
                  }} />
                </div>
              </label>

              <label className="field">
                <span>Role</span>
                <input
                  className="input"
                  value={profile?.role || "student"}
                  disabled
                  style={{ background: "#f8fafc", color: "var(--clr-muted)", cursor: "not-allowed", textTransform: "capitalize" }}
                />
              </label>
            </div>

            <label className="field">
              <span>Bio</span>
              <div style={{ position: "relative" }}>
                <textarea
                  className="input"
                  value={form.bio}
                  placeholder="Tell us a bit about yourself and your recycling journey…"
                  rows={3}
                  maxLength={300}
                  style={{ resize: "vertical", paddingTop: 10 }}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
                <FileText size={16} style={{
                  position: "absolute", right: 14, top: 14,
                  color: "var(--clr-subtle)",
                }} />
              </div>
              <small style={{ color: "var(--clr-subtle)", textAlign: "right" }}>
                {form.bio.length}/300
              </small>
            </label>
          </div>

          {/* Photo URL panel */}
          <div className="panel" style={{ display: "grid", gap: 16 }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
              <Camera size={18} style={{ color: "var(--clr-emerald)" }} /> Profile Photo
            </h3>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                className="button-outline"
                onClick={() => fileRef.current?.click()}
                style={{ gap: 8 }}
              >
                <Camera size={16} /> Upload Photo
              </button>
              <span style={{ color: "var(--clr-muted)", fontSize: 13 }}>
                JPEG or PNG, max 2 MB
              </span>
            </div>
            <label className="field">
              <span>Or paste an image URL</span>
              <div style={{ position: "relative" }}>
                <input
                  className="input"
                  value={form.avatarUrl.startsWith("data:") ? "" : form.avatarUrl}
                  placeholder="https://example.com/your-photo.jpg"
                  onChange={(e) => {
                    setForm({ ...form, avatarUrl: e.target.value });
                    setPreview(e.target.value || null);
                  }}
                />
                <Mail size={16} style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  color: "var(--clr-subtle)",
                }} />
              </div>
            </label>
          </div>

          {/* Save button */}
          <button
            className="button"
            type="submit"
            disabled={saving}
            style={{ justifyContent: "center", padding: "13px" }}
          >
            {saving ? <><span className="spinner" /> Saving…</> : <><Save size={17} /> Save Changes</>}
          </button>
        </form>
      </div>
    </>
  );
}
