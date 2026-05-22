import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  return (
    <main className="page" style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
      <div className="card" style={{ maxWidth: 460, textAlign: "center" }}>
        <ShieldAlert size={44} style={{ color: "var(--danger)", margin: "0 auto 14px" }} />
        <h1 className="page-title">Access restricted</h1>
        <p className="page-subtitle" style={{ marginBottom: 20 }}>
          Your account does not have permission to view this workspace.
        </p>
        <Link to="/" className="btn btn-primary">Go home</Link>
      </div>
    </main>
  );
}
