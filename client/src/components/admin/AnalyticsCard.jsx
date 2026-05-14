export default function AnalyticsCard({ label, value }) {
  return (
    <article className="panel stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}
