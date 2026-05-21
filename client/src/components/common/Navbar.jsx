import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Leaf, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`}>
      <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
        <Leaf size={22} />
        <span>JijiGreen</span>
      </Link>

      {/* Desktop nav */}
      <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/about">About</NavLink>
        <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/contact">Contact</NavLink>
        <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/login">Log in</NavLink>
        <Link className="button" to="/register" style={{ marginLeft: 8, padding: "9px 20px", fontSize: 14 }}>
          Get started
        </Link>
      </nav>

      {/* Mobile hamburger */}
      <button
        aria-label="Toggle menu"
        className="button-ghost"
        style={{ display: "none" }}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, top: 64, background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)", zIndex: 40, display: "flex", flexDirection: "column",
          padding: "24px", gap: 8,
        }}>
          {[
            { to: "/about", label: "About" },
            { to: "/contact", label: "Contact" },
            { to: "/login", label: "Log in" },
          ].map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="nav-link"
              style={{ fontSize: 18, padding: "14px 16px" }}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            className="button"
            to="/register"
            style={{ marginTop: 8 }}
            onClick={() => setMenuOpen(false)}
          >
            Get started
          </Link>
        </div>
      )}
    </header>
  );
}
