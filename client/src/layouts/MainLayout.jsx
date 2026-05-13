import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer.jsx";
import Navbar from "../components/common/Navbar.jsx";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
