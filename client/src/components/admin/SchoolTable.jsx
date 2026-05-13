export default function SchoolTable({ schools = [] }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>School</th>
          <th>County</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        {schools.map((school) => (
          <tr key={school._id}>
            <td>{school.name}</td>
            <td>{school.county}</td>
            <td>{school.totalPoints}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
