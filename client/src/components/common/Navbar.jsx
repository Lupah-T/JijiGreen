import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Leaf, Menu, X, ArrowRight, Recycle, Trophy, Gift } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { to: "/about", label: "Platform" },
    { to: "/contact", label: "Partners" },
    { to: "/student/dashboard", label: "Demo" },
  ];

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <Link to="/" className="nav-brand" onClick={() => setOpen(false)}>
        <Leaf size={22} />
        JijiGreen
      </Link>

      <nav className="nav-links">
        {links.map((p) => (
          <NavLink key={p.to} to={p.to}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
          >{p.label}</NavLink>
        ))}
        <NavLink to="/login" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>Log in</NavLink>
        <Link to="/register" className="btn btn-primary btn-sm nav-cta">
          Get started <ArrowRight size={14} />
        </Link>
      </nav>

      <button className="btn btn-ghost btn-icon nav-toggle" onClick={() => setOpen(!open)}
        aria-label="Open menu" aria-expanded={open}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-grid">
            {[
              { to: "/student/dashboard", label: "Student workspace", I: Recycle },
              { to: "/student/rewards", label: "Reward marketplace", I: Gift },
              { to: "/student/leaderboard", label: "Community rankings", I: Trophy },
            ].map(({ to, label, I }) => (
              <Link key={to} to={to} onClick={() => setOpen(false)} className="mobile-drawer-card">
                <I size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
          {links.map((p) => (
            <Link key={p.to} to={p.to} onClick={() => setOpen(false)} className="mobile-drawer-link">
              {p.label}
            </Link>
          ))}
          <Link to="/login" className="mobile-drawer-link" onClick={() => setOpen(false)}>Log in</Link>
          <Link to="/register" className="btn btn-primary btn-lg" onClick={() => setOpen(false)}
            style={{ marginTop: 8, justifyContent: "center" }}>
            Get started free <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </header>
  );
}
