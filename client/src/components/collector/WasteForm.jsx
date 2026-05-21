import { useState } from "react";
import { Save, QrCode, Scale, Recycle } from "lucide-react";

const WASTE_TYPES = [
  { value: "plastic",   label: "Plastic",   emoji: "🧴", pts: "20 pts/kg" },
  { value: "aluminium", label: "Aluminium", emoji: "🥤", pts: "30 pts/kg" },
  { value: "paper",     label: "Paper",     emoji: "📄", pts: "10 pts/kg" },
  { value: "glass",     label: "Glass",     emoji: "🫙", pts: "15 pts/kg" },
];

export default function WasteForm({ onSubmit }) {
  const [form, setForm] = useState({ student: "", wasteType: "plastic", weightKg: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onSubmit) await onSubmit(form);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setForm({ student: "", wasteType: "plastic", weightKg: "" }); }, 2500);
  };

  return (
    <form className="panel form" onSubmit={handleSubmit} id="waste-form"
      style={{ display: "grid", gap: 20, maxWidth: 480 }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <div style={{
          width: 44, height: 44, borderRadius: "var(--r-md)",
          background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--clr-emerald)",
        }}>
          <Recycle size={22} />
        </div>
        <div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 17 }}>Log Submission</h3>
          <p style={{ fontSize: 13, color: "var(--clr-muted)" }}>Verify a student&apos;s waste drop-off</p>
        </div>
      </div>

      {submitted && (
        <div className="alert success">✅ Submission logged successfully! Points awarded.</div>
      )}

      {/* Student lookup */}
      <label className="field">
        <span>Student ID or QR Code</span>
        <div style={{ position: "relative" }}>
          <input
            className="input"
            name="student"
            placeholder="Scan QR or enter Student ID"
            value={form.student}
            style={{ paddingRight: 44 }}
            onChange={(e) => setForm({ ...form, student: e.target.value })}
          />
          <QrCode size={18} style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            color: "var(--clr-subtle)",
          }} />
        </div>
      </label>

      {/* Waste type */}
      <div className="field">
        <span>Waste Type</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {WASTE_TYPES.map((w) => (
            <button
              key={w.value}
              type="button"
              onClick={() => setForm({ ...form, wasteType: w.value })}
              style={{
                border: form.wasteType === w.value ? "2px solid var(--clr-emerald)" : "2px solid #e2e8f0",
                background: form.wasteType === w.value ? "var(--clr-success-bg)" : "var(--clr-white)",
                borderRadius: "var(--r-md)",
                padding: "10px 12px",
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                transition: "all 180ms",
                color: form.wasteType === w.value ? "var(--clr-emerald)" : "var(--clr-muted)",
                fontWeight: 600, fontSize: 13, textAlign: "left",
              }}
            >
              <span style={{ fontSize: 20 }}>{w.emoji}</span>
              <div>
                <div>{w.label}</div>
                <div style={{ fontSize: 11, fontWeight: 400, opacity: 0.7 }}>{w.pts}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Weight */}
      <label className="field">
        <span>Weight (kg)</span>
        <div style={{ position: "relative" }}>
          <input
            className="input"
            name="weightKg"
            placeholder="0.0"
            type="number"
            min="0.1"
            step="0.1"
            value={form.weightKg}
            style={{ paddingRight: 44 }}
            onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
          />
          <Scale size={18} style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            color: "var(--clr-subtle)",
          }} />
        </div>
      </label>

      <button className="button" type="submit" style={{ justifyContent: "center", padding: "12px" }}>
        <Save size={17} /> Confirm Submission
      </button>
    </form>
  );
}
