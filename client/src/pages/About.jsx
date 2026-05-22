import { Leaf, Target, Users, Globe } from "lucide-react";

const IMPACT = [
  { value: "2+ tons",  label: "Waste Diverted" },
  { value: "500+",     label: "Active Users"    },
  { value: "47",       label: "Partner Schools" },
  { value: "3 SDGs",   label: "Goals Aligned"  },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, var(--clr-forest) 0%, #0d3b26 100%)",
        padding: "80px 0",
      }}>
        <div className="page" style={{ padding: "0 0", textAlign: "center" }}>
          <span className="section-title" style={{ color: "rgba(255,255,255,0.5)" }}>Our Story</span>
          <h1 style={{
            fontFamily: "var(--font-heading)", fontSize: "clamp(36px, 6vw, 60px)",
            color: "white", marginTop: 8, marginBottom: 16,
          }}>About JijiGreen</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, maxWidth: 580, margin: "0 auto" }}>
            A technology-driven platform turning everyday recycling into meaningful rewards
            for communities across Kenya.
          </p>
        </div>
      </section>

      {/* Impact numbers */}
      <section style={{ background: "var(--clr-white)", padding: "60px 0" }}>
        <div className="page" style={{ padding: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {IMPACT.map((i) => (
              <div key={i.label} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "var(--font-heading)", fontSize: 40, fontWeight: 900,
                  color: "var(--clr-emerald)", lineHeight: 1,
                }}>{i.value}</div>
                <div style={{ color: "var(--clr-muted)", marginTop: 6, fontSize: 14 }}>{i.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section style={{ padding: "80px 0" }}>
        <div className="page" style={{ padding: 0 }}>
          <div className="dashboard-grid">
            {[
              {
                icon: <Target size={24} />, color: "#16a34a", bg: "#f0fdf4",
                title: "Our Mission",
                text: "To build a scalable environmental participation ecosystem that makes sustainability rewarding, trackable, and community-driven across Kenya.",
              },
              {
                icon: <Globe size={24} />, color: "#3b82f6", bg: "#eff6ff",
                title: "Our Vision",
                text: "A Kenya where every community member participates in recycling — not from obligation, but because it rewards them directly.",
              },
              {
                icon: <Users size={24} />, color: "#a16207", bg: "#fef9c3",
                title: "Our Community",
                text: "We partner with schools, supermarkets, telecom companies, and recycling firms to build the most accessible collection network in Kenya.",
              },
            ].map((c) => (
              <div key={c.title} className="panel" style={{ display: "flex", gap: 16 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: "var(--r-md)", flexShrink: 0,
                  background: c.bg, display: "flex", alignItems: "center", justifyContent: "center",
                  color: c.color,
                }}>
                  {c.icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                    {c.title}
                  </h3>
                  <p style={{ fontSize: 15, color: "var(--clr-muted)", lineHeight: 1.7 }}>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDG section */}
      <section style={{ background: "var(--clr-surface)", padding: "60px 0" }}>
        <div className="page" style={{ padding: 0, textAlign: "center" }}>
          <Leaf size={32} style={{ color: "var(--clr-emerald)", margin: "0 auto 12px" }} />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 26, marginBottom: 8, color: "var(--clr-forest)" }}>
            SDG Alignment
          </h2>
          <p style={{ color: "var(--clr-muted)", marginBottom: 28, maxWidth: 480, margin: "0 auto 28px" }}>
            JijiGreen is built around the United Nations Sustainable Development Goals.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {["SDG 11 — Sustainable Cities", "SDG 12 — Responsible Consumption", "SDG 13 — Climate Action", "SDG 8 — Decent Work"].map((s) => (
              <span key={s} className="badge badge-green" style={{ fontSize: 13, padding: "6px 14px" }}>{s}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
