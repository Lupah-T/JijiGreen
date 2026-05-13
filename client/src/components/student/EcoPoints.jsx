import { formatPoints } from "../../utils/helpers.js";

export default function EcoPoints({ points = 0 }) {
  return (
    <article className="panel stat">
      <span>Eco Points</span>
      <strong>{formatPoints(points)}</strong>
    </article>
  );
}
