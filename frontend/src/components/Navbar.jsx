import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Navbar() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("auth_user") || "null");
  } catch {
    user = null;
  }

  function handleLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <span className="navbar-icon">🌿</span>

        <span className="navbar-brand-text">
          <strong>ClimateResilience</strong>
          <small>Somaliland</small>
        </span>
      </Link>

      <div className="navbar-location">
        Local Climate Information for Gabiley
      </div>

      <div className="navbar-profile">
        <button
          type="button"
          className="navbar-avatar"
          title={user?.name || "User"}
          aria-label="Open user profile"
          aria-expanded={profileOpen}
          onClick={() => setProfileOpen((open) => !open)}
        >
          {user?.name?.trim()?.charAt(0).toUpperCase() || "U"}
        </button>

        {profileOpen && (
          <>
            <button
              type="button"
              className="navbar-menu-backdrop"
              aria-label="Close profile menu"
              onClick={() => setProfileOpen(false)}
            />

            <div className="navbar-profile-menu">
              <strong>{user?.name || "User"}</strong>
              <span>{user?.email || "Email not available"}</span>

              <button
                type="button"
                className="navbar-logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
