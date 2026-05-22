import { Link } from "react-router-dom";
import { Leaf, Twitter, Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand-name"><Leaf size={20} style={{ color: "var(--g-400)" }} /> JijiGreen</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
              Community-powered recycling &amp; environmental engagement platform making sustainability rewarding across Kenya.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {[{ I: Twitter, href: "#" }, { I: Github, href: "#" }, { I: Mail, href: "mailto:hello@jijigreen.co.ke" }].map(({ I, href }) => (
                <a key={href} href={href}
                  style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,.07)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.5)", transition: "all 200ms" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(74,222,128,.2)"; e.currentTarget.style.color = "var(--g-400)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,.07)"; e.currentTarget.style.color = "rgba(255,255,255,.5)"; }}>
                  <I size={15} />
                </a>
              ))}
            </div>
          </div>
          {[
            { title: "Platform", links: [{ l: "About", to: "/about" }, { l: "Contact", to: "/contact" }, { l: "Get Started", to: "/register" }] },
            { title: "Roles", links: [{ l: "Students", to: "/register" }, { l: "Collectors", to: "/register" }, { l: "Organizations", to: "/contact" }] },
            { title: "Legal", links: [{ l: "Privacy Policy", to: "#" }, { l: "Terms of Service", to: "#" }] },
          ].map(({ title, links }) => (
            <div className="footer-col" key={title}>
              <h4>{title}</h4>
              {links.map(({ l, to }) => <Link key={l} to={to}>{l}</Link>)}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} JijiGreen. All rights reserved.</span>
          <span style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["SDG 11", "SDG 12", "SDG 13", "SDG 8"].map(s => (
              <span key={s} style={{ background: "rgba(74,222,128,.15)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 100, padding: "2px 10px", fontSize: 12, color: "var(--g-400)", fontWeight: 600 }}>{s}</span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
