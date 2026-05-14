import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <section className="page hero fade-in">
      <div>
        <h1>JijiGreen</h1>
        <p>Rewarding students and schools for verified recycling and cleaner communities.</p>
        <Link className="button" to="/register">
          Get started
        </Link>
      </div>
    </section>
  );
}
