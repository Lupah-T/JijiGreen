import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import About from "../pages/About.jsx";
import Contact from "../pages/Contact.jsx";
import LandingPage from "../pages/LandingPage.jsx";
import NotFound from "../pages/NotFound.jsx";
import Unauthorized from "../pages/Unauthorized.jsx";
import ForgotPassword from "../pages/auth/ForgotPassword.jsx";
import ResetPassword from "../pages/auth/ResetPassword.jsx";
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import Analytics from "../pages/admin/Analytics.jsx";
import CollectionPoints from "../pages/admin/CollectionPoints.jsx";
import RewardsManagement from "../pages/admin/RewardsManagement.jsx";
import Schools from "../pages/admin/Schools.jsx";
import Users from "../pages/admin/Users.jsx";
import UserDetails from "../pages/admin/UserDetails.jsx";
import CollectionHistory from "../pages/collector/CollectionHistory.jsx";
import CollectorDashboard from "../pages/collector/CollectorDashboard.jsx";
import VerifyWaste from "../pages/collector/VerifyWaste.jsx";
import History from "../pages/student/History.jsx";
import StudentLeaderboard from "../pages/student/Leaderboard.jsx";
import Profile from "../pages/student/Profile.jsx";
import Rewards from "../pages/student/Rewards.jsx";
import StudentDashboard from "../pages/student/StudentDashboard.jsx";
import CollectorApplication from "../pages/student/CollectorApplication.jsx";
import StudentCollectionPoints from "../pages/student/CollectionPoints.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
      </Route>
      <Route path="unauthorized" element={<Unauthorized />} />
      <Route element={<DashboardLayout />}>
        <Route element={<ProtectedRoute allowedRoles={["student", "collector"]} />}>
          <Route path="student/dashboard" element={<StudentDashboard />} />
          <Route path="student/rewards" element={<Rewards />} />
          <Route path="student/leaderboard" element={<StudentLeaderboard />} />
          <Route path="student/profile" element={<Profile />} />
          <Route path="student/history" element={<History />} />
          <Route path="student/collection-points" element={<StudentCollectionPoints />} />
          <Route path="student/apply-collector" element={<CollectorApplication />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["collector", "operations_admin", "super_admin"]} />}>
          <Route path="collector/dashboard" element={<CollectorDashboard />} />
          <Route path="collector/verify-waste" element={<VerifyWaste />} />
          <Route path="collector/history" element={<CollectionHistory />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["school_admin", "operations_admin", "super_admin"]} />}>
          <Route path="admin/dashboard" element={<AdminDashboard />} />
          <Route path="admin/schools" element={<Schools />} />
          <Route path="admin/collection-points" element={<CollectionPoints />} />
          <Route path="admin/analytics" element={<Analytics />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["operations_admin", "super_admin"]} />}>
          <Route path="admin/users" element={<Users />} />
          <Route path="admin/users/:userId" element={<UserDetails />} />
          <Route path="admin/rewards" element={<RewardsManagement />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
