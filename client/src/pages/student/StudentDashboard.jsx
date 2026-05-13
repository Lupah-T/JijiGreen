import EcoPoints from "../../components/student/EcoPoints.jsx";
import StudentCard from "../../components/student/StudentCard.jsx";

export default function StudentDashboard() {
  return (
    <>
      <h1>Student Dashboard</h1>
      <div className="dashboard-grid">
        <StudentCard />
        <EcoPoints points={0} />
      </div>
    </>
  );
}
