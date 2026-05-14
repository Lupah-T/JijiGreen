export default function StudentCard({ student }) {
  return (
    <article className="panel">
      <h3>{student?.name || "Student"}</h3>
      <p>{student?.school || "School profile pending"}</p>
    </article>
  );
}
