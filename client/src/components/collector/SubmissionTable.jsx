export default function SubmissionTable({ submissions = [] }) {
  if (!submissions.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">No collection records found</div>
        <div className="empty-state-sub">
          Submitted and processed collections will appear here.
        </div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Material</th>
            <th>Weight</th>
            <th>Brand</th>
            <th>Status</th>
            <th>Points</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission._id}>
              <td>
                {submission.student?.name || "Student"}
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {submission.student?.email || ""}
                </div>
              </td>
              <td>
                {submission.materialCategory || submission.wasteType}
              </td>
              <td>{submission.weightKg} kg</td>
              <td>
                {submission.brandName || "Unconfirmed"}
                {submission.brandName && (
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    {submission.brandSource}
                  </div>
                )}
              </td>
              <td>
                <span
                  className={
                    submission.status === "verified"
                      ? "badge badge-green"
                      : submission.status === "rejected"
                        ? "badge badge-red"
                        : "badge badge-amber"
                  }
                >
                  {submission.status}
                </span>
              </td>
              <td>{submission.pointsAwarded || 0}</td>
              <td>
                {submission.createdAt
                  ? new Date(submission.createdAt).toLocaleDateString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
