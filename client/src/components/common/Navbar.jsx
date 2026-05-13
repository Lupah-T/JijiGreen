import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export default function Navbar() {
  return (
    <header className="nav">
      <Link className="brand" to="/">
        <Leaf size={22} />
        <span>JijiGreen</span>
      </Link>
      <nav>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
}
