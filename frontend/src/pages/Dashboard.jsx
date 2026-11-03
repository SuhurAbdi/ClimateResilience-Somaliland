import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import "../styles/dashboard.css";

const API_URL = "http://127.0.0.1:8000/api";

const CHART_COLORS = [
  "#16845b",
  "#e9a23b",
  "#4388d6",
  "#dc6262",
  "#8b6bc1",
  "#7c9290",
];

async function fetchRecords(endpoint, headers) {
  const response = await fetch(`${API_URL}/${endpoint}`, { headers });

  if (!response.ok) {
    throw new Error(`Unable to load ${endpoint}: HTTP ${response.status}`);
  }

  const result = await response.json();

  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;

  throw new Error(`Unexpected response from ${endpoint}.`);
}

function PieChart({ title, items }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  let angle = 0;

  const gradient = items
    .filter((item) => item.count > 0)
    .map((item) => {
      const start = angle;
      angle += (item.count / total) * 360;

      return `${item.color} ${start}deg ${angle}deg`;
    })
    .join(", ");

  return (
    <section className="dashboard-chart-card">
      <h3 className="dashboard-chart-title">{title}</h3>

      {total === 0 ? (
        <p className="dashboard-empty-message">No reports available yet.</p>
      ) : (
        <>
          <div
            className="dashboard-pie-chart"
            style={{ background: `conic-gradient(${gradient})` }}
            role="img"
            aria-label={`${title}: ${total} reports`}
          >
            <div className="dashboard-pie-center">
              <strong>{total}</strong>
              <span>Total reports</span>
            </div>
          </div>

          <div className="dashboard-chart-legend">
            {items.map((item) => (
              <div className="dashboard-legend-item" key={item.label}>
                <span
                  className="dashboard-legend-dot"
                  style={{ backgroundColor: item.color }}
                />
                <span className="dashboard-legend-label">{item.label}</span>
                <strong>{item.count}</strong>
                <span className="dashboard-legend-percent">
                  {Math.round((item.count / total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function BarChart({ title, items }) {
  const maxCount = Math.max(...items.map((item) => item.count), 1);

  return (
    <section className="dashboard-chart-card">
      <h3 className="dashboard-chart-title">{title}</h3>

      {items.length === 0 ? (
        <p className="dashboard-empty-message">No reports available yet.</p>
      ) : (
        <div className="dashboard-bar-chart">
          {items.map((item) => (
            <div className="dashboard-bar-row" key={item.label}>
              <div className="dashboard-bar-label">
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </div>

              <div className="dashboard-bar-track">
                <div
                  className="dashboard-bar-fill"
                  style={{
                    width: `${(item.count / maxCount) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("auth_user") || "null");
    } catch {
      return null;
    }
  });

  const [profileOpen, setProfileOpen] = useState(false);
  const [reports, setReports] = useState([]);
  const [forecastCount, setForecastCount] = useState(null);
  const [alertCount, setAlertCount] = useState(null);
  const [userCount, setUserCount] = useState(null);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [reportError, setReportError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadReports() {
      try {
        const token = localStorage.getItem("auth_token");
        const headers = {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const records = await fetchRecords("community-reports", headers);

        if (!cancelled) {
          setReports(records);
          setReportError("");
        }
      } catch (error) {
        if (!cancelled) {
          setReportError(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoadingReports(false);
        }
      }
    }

    loadReports();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadStatistics() {
      const token = localStorage.getItem("auth_token");
      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const results = await Promise.allSettled([
        fetchRecords("forecasts", headers),
        fetchRecords("alerts", headers),
        fetchRecords("users", headers),
      ]);

      if (!cancelled) {
        if (results[0].status === "fulfilled") {
          setForecastCount(results[0].value.length);
        }

        if (results[1].status === "fulfilled") {
          setAlertCount(results[1].value.length);
        }

        if (results[2].status === "fulfilled") {
          setUserCount(results[2].value.length);
        }

        setLoadingStats(false);
      }
    }

    loadStatistics();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    navigate("/login");
  }

  const statusGroups = [
    { label: "Pending", count: 0, color: CHART_COLORS[1] },
    { label: "Reviewed", count: 0, color: CHART_COLORS[2] },
    { label: "Resolved", count: 0, color: CHART_COLORS[0] },
    { label: "Other statuses", count: 0, color: CHART_COLORS[3] },
  ];

  reports.forEach((report) => {
    const status = String(report.status || "unknown")
      .trim()
      .toLowerCase();

    if (status === "pending") {
      statusGroups[0].count++;
    } else if (
      ["reviewed", "under review", "in_review", "in review"].includes(status)
    ) {
      statusGroups[1].count++;
    } else if (["resolved", "completed", "closed"].includes(status)) {
      statusGroups[2].count++;
    } else {
      statusGroups[3].count++;
    }
  });

  const typeCounts = {};

  reports.forEach((report) => {
    const rawType =
      report.report_type ||
      report.type ||
      report.category ||
      report.issue_type ||
      report.report_category ||
      "Other";

    const label = String(rawType).trim().replace(/[_-]+/g, " ");
    const displayLabel = label.charAt(0).toUpperCase() + label.slice(1);

    typeCounts[displayLabel] = (typeCounts[displayLabel] || 0) + 1;
  });

  const typeGroups = Object.entries(typeCounts)
    .map(([label, count], index) => ({
      label,
      count,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }))
    .sort((a, b) => b.count - a.count);

  const statisticCards = [
    {
      title: "Total Users",
      value: userCount,
      description: "Registered accounts",
      icon: "👥",
      loading: loadingStats,
    },
    {
      title: "Community Reports",
      value: reports.length,
      description: "Reports submitted",
      icon: "📋",
      loading: loadingReports,
    },
    {
      title: "Climate Forecasts",
      value: forecastCount,
      description: "Available forecasts",
      icon: "🌦️",
      loading: loadingStats,
    },
    {
      title: "Climate Alerts",
      value: alertCount,
      description: "Available alerts",
      icon: "⚠️",
      loading: loadingStats,
    },
  ];

  return (
    <main className="page-container dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-heading">
          <h1 className="page-title">ClimateResilience Somaliland</h1>
          <p className="page-description">
            Local Climate Information for Pastoralist Communities
          </p>
        </div>

        <div className="dashboard-profile">
          <button
            type="button"
            className="dashboard-avatar"
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
                className="dashboard-menu-backdrop"
                aria-label="Close profile menu"
                onClick={() => setProfileOpen(false)}
              />

              <div className="dashboard-profile-menu">
                <strong>{user?.name || "User"}</strong>
                <span>{user?.email || "Email not available"}</span>
              </div>
            </>
          )}
        </div>
      </header>

      <hr className="page-divider" />

      <section className="dashboard-overview">
        <div className="dashboard-section-heading">
          <div>
            <h2 className="section-title">Climate Dashboard</h2>
            <p className="dashboard-location">
              <strong>Location:</strong> Gabiley, Somaliland
            </p>
          </div>
        </div>

        <div className="dashboard-stats-grid">
          {statisticCards.map((card) => (
            <article className="dashboard-stat-card" key={card.title}>
              <div className="dashboard-stat-top">
                <span className="dashboard-stat-icon">{card.icon}</span>
                <span className="dashboard-stat-indicator">Overview</span>
              </div>

              <p className="dashboard-stat-label">{card.title}</p>

              <h3 className="dashboard-stat-value">
                {card.loading ? "..." : (card.value ?? "—")}
              </h3>

              <span className="dashboard-stat-description">
                {card.description}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-analytics">
        <div className="dashboard-section-heading">
          <div>
            <h2 className="section-title">Community Report Analytics</h2>
            <p className="dashboard-section-description">
              Monitor community reports by status and climate-related issue.
            </p>
          </div>

          <Link className="dashboard-secondary-link" to="/community-reports">
            View reports →
          </Link>
        </div>

        {loadingReports ? (
          <p className="status-message">
            Loading community report statistics...
          </p>
        ) : reportError ? (
          <p className="error-message">{reportError}</p>
        ) : (
          <>
            <div className="dashboard-report-summary">
              <span>Total Community Reports</span>
              <strong>{reports.length}</strong>
            </div>

            <div className="dashboard-charts-grid">
              <PieChart title="Reports by Status" items={statusGroups} />
              <BarChart title="Reports by Type" items={typeGroups} />
            </div>
          </>
        )}
      </section>

      <section className="dashboard-services">
        <h2 className="section-title">Our Services</h2>

        <p className="dashboard-section-description dashboard-services-intro">
          Practical climate information and reporting tools to help communities
          across Somaliland prepare for climate risks.
        </p>

        <div className="dashboard-services-grid">
          <article className="dashboard-service-card">
            <div className="dashboard-service-icon">🌦️</div>
            <h3>Climate Forecasts</h3>
            <p>
              Check available rainfall and temperature forecasts for supported
              locations.
            </p>
            <p className="dashboard-service-benefit">
              <strong>How it helps:</strong> Inform decisions about grazing,
              water collection, livestock movement, and farming.
            </p>
            <Link to="/forecasts">Explore Forecasts →</Link>
          </article>

          <article className="dashboard-service-card">
            <div className="dashboard-service-icon">⚠️</div>
            <h3>Climate Risk Alerts</h3>
            <p>
              View information about potential drought, heavy rainfall, extreme
              heat, and other climate risks.
            </p>
            <p className="dashboard-service-benefit">
              <strong>How it helps:</strong> Support early preparation and
              informed decisions to protect livelihoods.
            </p>
            <Link to="/alerts">Check Climate Risks →</Link>
          </article>

          <article className="dashboard-service-card">
            <div className="dashboard-service-icon">🐪</div>
            <h3>Livestock Adaptation Advice</h3>
            <p>
              Read practical livestock-care and climate adaptation guidance in
              English and Somali.
            </p>
            <p className="dashboard-service-benefit">
              <strong>How it helps:</strong> Learn ways to manage water
              shortages, declining pasture, heat, and animal-health risks.
            </p>
            <Link to="/livestock-advice">Get Livestock Advice →</Link>
          </article>

          <article className="dashboard-service-card">
            <div className="dashboard-service-icon">📋</div>
            <h3>Community Climate Reports</h3>
            <p>
              Submit reports about local drought, flooding, water shortages, and
              other environmental concerns.
            </p>
            <p className="dashboard-service-benefit">
              <strong>How it helps:</strong> Document local conditions and
              identify areas that may need further attention.
            </p>
            <Link to="/community-reports">Submit or View Reports →</Link>
          </article>
        </div>
      </section>

      <footer className="dashboard-disclaimer">
        Forecasts and automated indicators support planning but are not a
        substitute for official warnings. Community reports should be reviewed
        before being treated as verified incidents.
      </footer>
    </main>
  );
}

export default Dashboard;
