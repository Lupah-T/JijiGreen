export default function RewardManager({ rewards = [] }) {
  return (
    <section className="dashboard-grid">
      {rewards.map((reward) => (
        <article className="panel" key={reward._id}>
          <h3>{reward.title}</h3>
          <p>{reward.stock} in stock</p>
        </article>
      ))}
    </section>
  );
}
