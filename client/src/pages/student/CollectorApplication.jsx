import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardCheck, MapPin, ShieldCheck, Send } from "lucide-react";
import { applyForCollector, getMyCollectorApplication } from "../../api/collectorApi.js";

const INITIAL_FORM = {
  fullName: "",
  phone: "",
  county: "",
  collectionPointName: "",
  location: "",
  nationalId: "",
  documentUrl: "",
  reason: "",
};

export default function CollectorApplication() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [application, setApplication] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getMyCollectorApplication()
      .then(({ data }) => setApplication(data.data || null))
      .catch(() => setApplication(null));
  }, []);

  const set = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const { data } = await applyForCollector(form);
      setApplication(data.data);
      setForm(INITIAL_FORM);
      setMessage("Application submitted for operations review.");
    } catch (error) {
      setMessage(error.message || "Could not submit application.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Apply to Become a Collector</h1>
          <p className="page-subtitle">Collectors are approved by operations staff before they can verify waste.</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-header">
            <span className="section-title">Collector application</span>
            {application ? <span className={`badge ${application.status === "approved" ? "badge-green" : application.status === "rejected" ? "badge-red" : "badge-amber"}`}>{application.status}</span> : null}
          </div>

          {application?.status === "pending" ? (
            <div className="empty-state">
              <ClipboardCheck size={42} style={{ color: "var(--g-700)", marginBottom: 12 }} />
              <div className="empty-state-title">Application under review</div>
              <div className="empty-state-sub">Operations will verify your collection point, ID details, and suitability before granting collector access.</div>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
              {message ? <div className={message.includes("submitted") ? "alert alert-success" : "alert alert-error"}>{message}</div> : null}
              <div className="grid-2" style={{ gap: 12 }}>
                <div className="field"><label className="field-label">Full name</label><input className="input" required value={form.fullName} onChange={set("fullName")} /></div>
                <div className="field"><label className="field-label">Phone</label><input className="input" required value={form.phone} onChange={set("phone")} placeholder="+254..." /></div>
                <div className="field"><label className="field-label">County</label><input className="input" required value={form.county} onChange={set("county")} placeholder="Nairobi" /></div>
                <div className="field"><label className="field-label">Collection point</label><input className="input" required value={form.collectionPointName} onChange={set("collectionPointName")} /></div>
                <div className="field"><label className="field-label">Location</label><input className="input" required value={form.location} onChange={set("location")} placeholder="Westlands, near..." /></div>
                <div className="field"><label className="field-label">National ID / Passport</label><input className="input" required value={form.nationalId} onChange={set("nationalId")} /></div>
              </div>
              <div className="field">
                <label className="field-label">Verification document URL</label>
                <input className="input" type="url" value={form.documentUrl} onChange={set("documentUrl")} placeholder="https://..." />
              </div>
              <div className="field">
                <label className="field-label">Reason for applying</label>
                <textarea className="input" rows={4} required minLength={20} maxLength={1000} value={form.reason} onChange={set("reason")} />
              </div>
              <button className="btn btn-primary" disabled={busy} style={{ justifyContent: "center" }}>
                {busy ? <span className="spinner spinner-white" /> : <><Send size={15} /> Submit application</>}
              </button>
            </form>
          )}
        </div>

        <div className="card" style={{ display: "grid", gap: 18 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <ShieldCheck size={24} style={{ color: "var(--g-700)", flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: 18 }}>Why approval is required</h3>
              <p style={{ color: "var(--text-muted)", marginTop: 6 }}>Collectors can award eco-points, so JijiGreen verifies identity, collection point legitimacy, and operational fit before granting access.</p>
            </div>
          </div>
          {[
            "Students cannot self-promote into collector roles.",
            "Collectors cannot create or approve other collectors.",
            "Every approval or rejection is audit logged.",
            "Suspicious or duplicate applications are blocked.",
          ].map((item) => (
            <div key={item} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <CheckCircle2 size={17} style={{ color: "var(--g-700)", marginTop: 2 }} />
              <span style={{ color: "var(--text-muted)" }}>{item}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, display: "flex", gap: 10, color: "var(--text-muted)" }}>
            <MapPin size={18} style={{ color: "var(--g-700)" }} />
            <span>Approved collectors get access to the scanner, verification queue, and collection history dashboard.</span>
          </div>
        </div>
      </div>
    </>
  );
}
