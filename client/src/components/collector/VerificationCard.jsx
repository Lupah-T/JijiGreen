import { Check, X } from "lucide-react";

export default function VerificationCard({ submission }) {
  return (
    <article className="panel verification-card">
      <h3>{submission?.wasteType || "Waste submission"}</h3>
      <p>{submission?.weightKg || 0} kg</p>
      <div className="actions">
        <button className="button" type="button" title="Approve">
          <Check size={18} />
        </button>
        <button className="button secondary" type="button" title="Reject">
          <X size={18} />
        </button>
      </div>
    </article>
  );
}
