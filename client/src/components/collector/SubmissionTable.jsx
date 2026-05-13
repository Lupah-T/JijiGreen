export default function SubmissionTable({ submissions = [] }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Waste</th>
          <th>Weight</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {submissions.map((submission) => (
          <tr key={submission._id}>
            <td>{submission.wasteType}</td>
            <td>{submission.weightKg} kg</td>
            <td>{submission.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
