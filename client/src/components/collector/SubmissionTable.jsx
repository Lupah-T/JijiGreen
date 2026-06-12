export default function SubmissionTable({ submissions = [] }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Student</th>
          <th>Waste</th>
          <th>Collection Point</th>
          <th>Weight</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((submission) => (
          <tr key={submission._id}>
            <td>{submission.student?.name || submission.student?.email || "—"}</td>
            <td>{submission.wasteType}</td>
            <td>{submission.collectionPoint?.name || "—"}</td>
            <td>{submission.weightKg} kg</td>
            <td>{submission.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
