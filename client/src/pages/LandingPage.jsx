import { Link } from "react-router-dom";
import { Leaf, ArrowRight, Recycle, Star, Shield, Users, Trophy, MapPin, CheckCircle } from "lucide-react";

const stats = [
  { value: "10K+", label: "Eco Points Awarded" },
  { value: "500+", label: "Active Recyclers" },
  { value: "2 tons", label: "Waste Collected" },
  { value: "47",  label: "Partner Schools" },
];

const steps = [
  {
    icon: <Recycle size={28} />,
    number: "01",
    title: "Collect Recyclables",
    desc: "Gather plastic bottles, aluminium cans, and other recyclable materials from your community.",
  },
  {
    icon: <MapPin size={28} />,
    number: "02",
    title: "Submit at Collection Points",
    desc: "Drop off at verified kiosks, schools, supermarkets, or community centres near you.",
  },
  {
    icon: <Star size={28} />,
    number: "03",
    title: "Earn Eco-Points",
    desc: "Collectors verify your submission and eco-points are credited to your wallet instantly.",
  },
  {
    icon: <Trophy size={28} />,
    number: "04",
    title: "Redeem Rewards",
    desc: "Exchange points for airtime, shopping vouchers, digital badges, and sustainability certificates.",
  },
];

const features = [
  { icon: <Shield   size={24} />, title: "QR Verification",       desc: "Every submission is verified by authorised agents using QR-code scanning — no fraud, full transparency." },
  { icon: <Trophy   size={24} />, title: "Gamified Leaderboards",  desc: "Compete with schools, earn badges, and rise through Bronze → Silver → Gold tiers." },
  { icon: <Users    size={24} />, title: "Community Powered",      desc: "Decentralised collection points run by community partners — supermarkets, schools, and kiosks." },
  { icon: <Recycle  size={24} />, title: "Impact Tracking",        desc: "See exactly how much waste you've diverted, trees sponsored, and CO₂ offset." },
  { icon: <Star     size={24} />, title: "Instant Rewards",        desc: "Airtime bundles, shopping discounts, and tree-planting sponsorships redeemable in seconds." },
  { icon: <CheckCircle size={24} />, title: "SDG Aligned",         desc: "Directly supports UN Sustainable Development Goals 11, 12, and 13 for a greener Kenya." },
];

export default function LandingPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg-pattern" aria-hidden="true" />

        {/* Floating leaf particles */}
        {[...Array(6)].map((_, i) => (
          <span key={i} aria-hidden="true" style={{
            position: "absolute",
            left: `${10 + i * 15}%`,
            bottom: `-${20 + i * 5}%`,
            fontSize: `${16 + i * 4}px`,
            opacity: 0.15,
            animation: `leaf-drift ${8 + i * 2}s linear ${i * 1.5}s infinite`,
            userSelect: "none",
          }}>🌿</span>
        ))}

        <div className="hero-content">
          <div className="hero-badge fade-in">
            <Leaf size={14} />
            Community-Powered Recycling · Kenya
          </div>

          <h1 className="fade-in delay-100">
            Recycle.<br />
            <span className="highlight">Earn Points.</span><br />
            Build a Greener Kenya.
          </h1>

          <p className="fade-in delay-200">
            JijiGreen rewards students and communities for verified recycling.
            Submit recyclables, earn eco-points, and redeem real rewards — all
            while making your city cleaner.
          </p>

          <div className="hero-actions fade-in delay-300">
            <Link className="button" to="/register" id="hero-cta-register" style={{ fontSize: 16, padding: "13px 28px" }}>
              Get started free <ArrowRight size={18} />
            </Link>
            <Link className="button-outline" to="/about" id="hero-cta-learn"
              style={{ color: "rgba(255,255,255,0.85)", borderColor: "rgba(255,255,255,0.35)", fontSize: 16, padding: "11px 28px" }}
            >
              Learn more
            </Link>
          </div>

          <div className="hero-stats fade-in delay-400">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="hero-stat-value">{s.value}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{ padding: "96px 0", background: "var(--clr-white)" }}>
        <div className="page" style={{ padding: "0 0" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="section-title">Simple Process</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", marginTop: 8, color: "var(--clr-forest)" }}>
              How JijiGreen Works
            </h2>
            <p style={{ color: "var(--clr-muted)", marginTop: 12, fontSize: 17, maxWidth: 520, margin: "12px auto 0" }}>
              Four simple steps from collection to reward — designed to be effortless for everyone.
            </p>
          </div>

          <div className="dashboard-grid-4" style={{ gap: 24 }}>
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`panel fade-in-up delay-${(i + 1) * 100}`}
                style={{ position: "relative", overflow: "hidden" }}
              >
                <div style={{
                  position: "absolute", top: 16, right: 20,
                  fontFamily: "var(--font-heading)", fontSize: 52, fontWeight: 900,
                  color: "rgba(22,163,74,.07)", lineHeight: 1,
                }}>{step.number}</div>

                <div style={{
                  width: 52, height: 52, borderRadius: "var(--r-md)",
                  background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--clr-emerald)", marginBottom: 16,
                }}>
                  {step.icon}
                </div>

                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: "var(--clr-muted)", lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: "96px 0", background: "var(--clr-surface)" }}>
        <div className="page" style={{ padding: 0 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span className="section-title">Platform Features</span>
            <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", marginTop: 8, color: "var(--clr-forest)" }}>
              Everything You Need to Go Green
            </h2>
          </div>

          <div className="dashboard-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {features.map((f, i) => (
              <div key={f.title} className={`panel fade-in-up delay-${(i % 3 + 1) * 100}`}
                style={{ display: "flex", gap: 16 }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: "var(--r-md)", flexShrink: 0,
                  background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--clr-emerald)",
                }}>
                  {f.icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--clr-muted)", lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SDG Banner ── */}
      <section style={{
        background: "linear-gradient(135deg, var(--clr-forest) 0%, #0d3b26 100%)",
        padding: "72px 0", textAlign: "center",
      }}>
        <div className="page" style={{ padding: 0 }}>
          <span className="section-title" style={{ color: "rgba(255,255,255,0.5)" }}>UN Sustainable Development Goals</span>
          <h2 style={{
            fontFamily: "var(--font-heading)", fontSize: "clamp(26px, 4vw, 38px)",
            color: "var(--clr-white)", marginTop: 8, marginBottom: 24,
          }}>
            Aligned with Global Sustainability Goals
          </h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 40 }}>
            {["SDG 11 — Sustainable Cities", "SDG 12 — Responsible Consumption", "SDG 13 — Climate Action", "SDG 8 — Decent Work"].map((sdg) => (
              <span key={sdg} style={{
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 100, padding: "8px 18px", color: "rgba(255,255,255,0.85)",
                fontSize: 14, fontWeight: 600,
              }}>{sdg}</span>
            ))}
          </div>
          <Link className="button" to="/register"
            style={{ fontSize: 16, padding: "13px 32px", margin: "0 auto", display: "inline-flex" }}
          >
            Join JijiGreen today <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
