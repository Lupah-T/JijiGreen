import { Link } from "react-router-dom";
import { Leaf, Twitter, Github, Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <h3><Leaf size={20} /> JijiGreen</h3>
          <p>
            Community-powered recycling &amp; environmental engagement platform.
            Making sustainability rewarding across Kenya.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            {[
              { icon: <Twitter size={16} />, href: "#", label: "Twitter" },
              { icon: <Github  size={16} />, href: "#", label: "GitHub"  },
              { icon: <Mail    size={16} />, href: "mailto:hello@jijigreen.co.ke", label: "Email" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.6)",
                  transition: "background 200ms, color 200ms",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(74,222,128,0.2)"; e.currentTarget.style.color = "#4ade80"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Platform links */}
        <div className="footer-col">
          <h4>Platform</h4>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/register">Get Started</Link>
          <Link to="/login">Login</Link>
        </div>

        {/* Legal */}
        <div className="footer-col">
          <h4>Legal</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} JijiGreen. All rights reserved.</span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#4ade80" }}>🌱</span> SDG 11 · 12 · 13
        </span>
      </div>
    </footer>
  );
}
