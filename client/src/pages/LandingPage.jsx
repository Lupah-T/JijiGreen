import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle2,
  Gift,
  Leaf,
  MapPin,
  QrCode,
  Recycle,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  WalletCards,
  Zap,
} from "lucide-react";

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const METRICS = [
  { value: "2.8T", label: "Waste diverted", detail: "Verified recyclables logged across pilot communities" },
  { value: "82K", label: "Eco-points issued", detail: "Points earned through QR-verified submissions" },
  { value: "47", label: "Partner institutions", detail: "Schools, supermarkets, and community hubs" },
  { value: "91%", label: "Verification accuracy", detail: "Operational checks for trusted reward issuance" },
];

const STEPS = [
  { I: QrCode, title: "Register once", text: "Students and community members receive a personal Eco ID and QR code." },
  { I: MapPin, title: "Drop off recyclables", text: "Submit plastic, aluminium, paper, and glass at verified collection points." },
  { I: ScanLine, title: "Collector verifies", text: "Agents scan the QR, weigh materials, and approve the submission in seconds." },
  { I: Gift, title: "Redeem rewards", text: "Eco-points convert into airtime, shopping vouchers, badges, and tree sponsorships." },
];

const FEATURES = [
  { I: ShieldCheck, title: "Fraud-aware verification", text: "QR identity, weight checks, and risk labels keep reward issuance reliable." },
  { I: WalletCards, title: "Reward wallet", text: "A clear balance, redemption progress, and premium marketplace experience." },
  { I: Trophy, title: "Positive competition", text: "Leaderboards, school rankings, challenges, and achievement tiers." },
  { I: BarChart3, title: "Impact analytics", text: "Track kilograms recycled, CO2 equivalent, trees sponsored, and community trends." },
  { I: Building2, title: "Partner operations", text: "Collector and admin dashboards for supermarkets, schools, and NGOs." },
  { I: Users, title: "Community loops", text: "Designed for student groups, youth communities, recycling agents, and sponsors." },
];

const PARTNERS = ["UoN Clubs", "Naivas", "County Hubs", "Green Kenya", "Campus SACCOs", "NEMA Programs"];

const TESTIMONIALS = [
  {
    name: "Amina Odhiambo",
    role: "University student",
    quote: "It feels like a proper wallet for impact. I can see my points, my QR, and exactly what my recycling is doing.",
  },
  {
    name: "Brian Mutua",
    role: "Collection agent",
    quote: "The verification flow is fast on mobile. I scan, weigh, approve, and the queue stays under control.",
  },
  {
    name: "Chloe Wanjiku",
    role: "Environmental coordinator",
    quote: "The school rankings made participation visible without turning the program into noise. It feels grown up.",
  },
];

function PhoneMockup() {
  return (
    <motion.div
      className="phone-mockup"
      initial={{ opacity: 0, y: 28, rotate: 2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, delay: 0.15 }}
    >
      <div className="phone-screen">
        <div className="phone-top">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.72 }}>Good morning</div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: 20 }}>Amina</div>
            </div>
            <div style={{ width: 42, height: 42, borderRadius: 14, background: "rgba(255,255,255,.14)", display: "grid", placeItems: "center" }}>
              <QrCode size={21} />
            </div>
          </div>
          <div style={{ marginTop: 22, display: "flex", alignItems: "end", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Eco-points</div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 38, lineHeight: 1 }}>3,420</div>
            </div>
            <span style={{ background: "rgba(163,230,53,.18)", border: "1px solid rgba(163,230,53,.28)", color: "#d9f99d", borderRadius: 999, padding: "5px 10px", fontSize: 12, fontWeight: 800 }}>
              Gold tier
            </span>
          </div>
        </div>
        <div className="phone-widget">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <strong>Impact this month</strong>
            <Leaf size={18} color="#16a34a" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              ["24.8 kg", "recycled"],
              ["18.2 kg", "CO2e saved"],
              ["4", "badges"],
              ["#3", "campus rank"],
            ].map(([v, l]) => (
              <div key={l} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: 10 }}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900 }}>{v}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="phone-widget">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <strong>Nearby points</strong>
            <span style={{ fontSize: 11, color: "#166534", fontWeight: 800 }}>3 open</span>
          </div>
          {["Naivas Westlands", "UoN Main Campus", "Sarit Centre Kiosk"].map((point, index) => (
            <div key={point} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderTop: index ? "1px solid #f1f5f9" : 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: index === 2 ? "#f1f5f9" : "#dcfce7", display: "grid", placeItems: "center" }}>
                <MapPin size={15} color={index === 2 ? "#64748b" : "#166534"} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 13 }}>{point}</div>
                <div style={{ color: "#64748b", fontSize: 11 }}>{0.4 + index * 0.7} km away</div>
              </div>
            </div>
          ))}
        </div>
        <div className="phone-widget" style={{ background: "#052e16", color: "#fff" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(255,255,255,.12)", display: "grid", placeItems: "center" }}>
              <Gift size={22} color="#a3e635" />
            </div>
            <div>
              <div style={{ fontWeight: 900 }}>KES 100 voucher</div>
              <div style={{ fontSize: 12, opacity: 0.65 }}>80 points to unlock</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content container hero-grid">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div className="hero-badge" variants={fade}>
              <Sparkles size={14} /> Climate-tech rewards infrastructure for Kenya
            </motion.div>
            <motion.h1 className="hero-title" variants={fade}>
              Recycle more.<br />
              Earn smarter.<br />
              <span className="accent">Prove the impact.</span>
            </motion.h1>
            <motion.p className="hero-p" variants={fade}>
              JijiGreen gives students, youth communities, recycling agents, and partners a verified way to turn sustainable behavior into rewards, rankings, and measurable environmental progress.
            </motion.p>
            <motion.div className="hero-ctas" variants={fade}>
              <Link to="/register" className="btn btn-primary btn-lg">
                Start earning <ArrowRight size={18} />
              </Link>
              <Link to="/student/dashboard" className="btn btn-lg" style={{ background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.9)", border: "1px solid rgba(255,255,255,.22)" }}>
                View product demo
              </Link>
            </motion.div>
            <motion.div className="hero-stat-row" variants={fade}>
              {METRICS.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <div className="hero-stat-val">{s.value}</div>
                  <div className="hero-stat-lbl">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
          <PhoneMockup />
        </div>
      </section>

      <section className="startup-section">
        <div className="container">
          <div style={{ maxWidth: 720 }}>
            <span className="section-kicker"><Recycle size={14} /> How it works</span>
            <h2 className="section-heading">A clean operational loop from QR identity to verified rewards.</h2>
            <p className="section-copy">The experience is simple for students and communities, efficient for collectors, and measurable for institutions funding environmental programs.</p>
          </div>
          <motion.div className="grid-4" style={{ marginTop: 34 }} variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
            {STEPS.map(({ I, title, text }, index) => (
              <motion.div className="feature-tile" key={title} variants={fade}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 15, background: "var(--g-50)", color: "var(--g-700)", display: "grid", placeItems: "center" }}>
                    <I size={22} />
                  </div>
                  <span style={{ fontFamily: "var(--font-heading)", fontWeight: 900, color: "var(--text-soft)" }}>0{index + 1}</span>
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>{title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="startup-section impact-band">
        <div className="container">
          <span className="section-kicker" style={{ background: "rgba(255,255,255,.1)", color: "#d9f99d", borderColor: "rgba(255,255,255,.16)" }}>
            <BarChart3 size={14} /> Live impact layer
          </span>
          <h2 className="section-heading" style={{ color: "#fff", maxWidth: 760 }}>Built for measurable sustainability, not vanity dashboards.</h2>
          <div className="grid-4" style={{ marginTop: 34 }}>
            {METRICS.map((m) => (
              <div className="metric-card" key={m.label}>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 900, fontSize: 38, lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontWeight: 800, marginTop: 10 }}>{m.label}</div>
                <p style={{ color: "rgba(255,255,255,.62)", fontSize: 13, marginTop: 7 }}>{m.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="startup-section" style={{ background: "var(--bg-subtle)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, .82fr) minmax(0, 1.18fr)", gap: 36, alignItems: "start" }} className="responsive-split">
            <div>
              <span className="section-kicker"><Zap size={14} /> Product system</span>
              <h2 className="section-heading">Dashboards for every stakeholder in the recycling network.</h2>
              <p className="section-copy">Student engagement, collector workflows, admin analytics, reward operations, and community competition share one consistent design system.</p>
            </div>
            <div className="grid-2">
              {FEATURES.map(({ I, title, text }) => (
                <div className="feature-tile" key={title}>
                  <I size={23} style={{ color: "var(--g-700)", marginBottom: 14 }} />
                  <h3 style={{ fontSize: 16, marginBottom: 7 }}>{title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: 13 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="startup-section">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 34px" }}>
            <span className="section-kicker"><BadgeCheck size={14} /> Trusted network</span>
            <h2 className="section-heading">Designed for campuses, supermarkets, NGOs, and youth groups.</h2>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {PARTNERS.map((p) => <span className="partner-pill" key={p}>{p}</span>)}
          </div>
          <div className="grid-3" style={{ marginTop: 42 }}>
            {TESTIMONIALS.map((t) => (
              <div className="feature-tile" key={t.name}>
                <div style={{ display: "flex", gap: 3, color: "#d97706", marginBottom: 18 }}>
                  {[1, 2, 3, 4, 5].map((n) => <CheckCircle2 key={n} size={15} />)}
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7 }}>"{t.quote}"</p>
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontWeight: 900 }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: "var(--text-soft)" }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "78px 0", background: "linear-gradient(135deg, var(--g-900), #0f172a)" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <h2 style={{ color: "#fff", fontFamily: "var(--font-heading)", fontSize: "clamp(28px,4vw,44px)", fontWeight: 900, maxWidth: 690 }}>
              Give sustainable behavior the product experience it deserves.
            </h2>
            <p style={{ color: "rgba(255,255,255,.62)", maxWidth: 580, marginTop: 12 }}>
              Launch a modern recycling rewards platform for Kenyan communities, partners, and institutions.
            </p>
          </div>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create account <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
