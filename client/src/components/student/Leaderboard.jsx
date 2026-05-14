export default function Leaderboard({ entries = [] }) {
  return (
    <section className="panel">
      <h3>Leaderboard</h3>
      <ol>
        {entries.map((entry) => (
          <li key={entry._id || entry.rank}>
            {entry.user?.name || "Student"} - {entry.points} pts
          </li>
        ))}
      </ol>
    </section>
  );
}
