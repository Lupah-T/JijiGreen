export default function RewardsPanel({ rewards = [] }) {
  return (
    <section className="dashboard-grid">
      {rewards.map((reward) => (
        <article className="panel" key={reward._id}>
          <h3>{reward.title}</h3>
          <p>{reward.description}</p>
          <strong>{reward.pointsCost} pts</strong>
        </article>
      ))}
    </section>
  );
}
