import { NavLink } from "react-router-dom";

export default function Sidebar({ links = [] }) {
  return (
    <aside className="sidebar">
      {links.map((link) => (
        <NavLink key={link.to} to={link.to}>
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
}
