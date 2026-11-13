import { Link } from "react-router-dom";
import { Leaf, Twitter, Instagram, Mail, Phone } from "lucide-react";

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
            <div style={{ fontSize: 14, marginTop: 15, color: "rgba(255,255,255,.7)", display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Mail size={14} /> jijigreen.support@gmail.com</span>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Phone size={14} /> +254 713482742 / +254 718047199</span>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {[
                { I: Twitter, href: "https://x.com/jijigreenafrica" }, 
                { I: Instagram, href: "https://www.instagram.com/jijigreen_africa" }
              ].map(({ I, href }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
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
            {[
              { id: "SDG 11", desc: "SDG 11: Sustainable Cities and Communities" },
              { id: "SDG 12", desc: "SDG 12: Responsible Consumption and Production" },
              { id: "SDG 13", desc: "SDG 13: Climate Action" },
              { id: "SDG 8", desc: "SDG 8: Decent Work and Economic Growth" }
            ].map(s => (
              <span 
                key={s.id} 
                title={s.desc}
                style={{ cursor: "help", background: "rgba(74,222,128,.15)", border: "1px solid rgba(74,222,128,.25)", borderRadius: 100, padding: "2px 10px", fontSize: 12, color: "var(--g-400)", fontWeight: 600 }}
              >
                {s.id}
              </span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
