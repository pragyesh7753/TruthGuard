import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

/**
 * MainLayout
 * Wraps all pages with the shared Navbar.
 * The <Outlet /> renders the current route's page component.
 */
function MainLayout() {
  return (
    <div className="bg-gradient-dark min-h-screen">
      <Navbar />

      {/* Page content — each route renders here */}
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
