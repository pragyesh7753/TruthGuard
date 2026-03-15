import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ShieldCheck } from "lucide-react";

/* Navigation link configuration — easy to extend later */
const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Detector", path: "/detector" },
  { label: "Dashboard", path: "/dashboard" },
];

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* ---- Brand / Logo ---- */}
        <NavLink to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <ShieldCheck size={28} className="text-accent-400" />
          <span className="navbar-brand-text">TruthGuard</span>
        </NavLink>

        {/* ---- Desktop Navigation ---- */}
        <ul className="navbar-links">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "navbar-link-active" : ""}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* ---- Mobile Menu Toggle ---- */}
        <button
          className="navbar-toggle"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X size={24} className="text-accent-400" />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* ---- Mobile Dropdown Menu ---- */}
      {isMobileMenuOpen && (
        <ul className="navbar-mobile-menu">
          {NAV_LINKS.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `navbar-mobile-link ${isActive ? "navbar-link-active" : ""}`
                }
                onClick={closeMobileMenu}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
