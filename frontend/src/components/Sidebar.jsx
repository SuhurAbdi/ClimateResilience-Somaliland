import { NavLink, useNavigate } from "react-router-dom";
import "../App.css";
import api from "../services/api";

function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: "🏠",
    },
    {
      title: "Climate Forecasts",
      path: "/forecasts",
      icon: "🌦️",
    },
    {
      title: "Climate Alerts",
      path: "/alerts",
      icon: "🔔",
    },
    {
      title: "Livestock Advice",
      path: "/livestock-advice",
      icon: "🐪",
    },
    {
      title: "Community Reports",
      path: "/community-reports",
      icon: "📋",
    },
  ];

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");

      navigate("/login", { replace: true });
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-heading">
        <h2>Climate Services</h2>
        <p>Gabiley, Somaliland</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.title}</span>
          </NavLink>
        ))}

        <button
          type="button"
          className="sidebar-link logout-button"
          onClick={handleLogout}
        >
          <span className="sidebar-icon">🚪</span>
          <span>Log Out</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <p>ClimateResilience Somaliland</p>
        <small>Community climate information</small>
      </div>
    </aside>
  );
}

export default Sidebar;
