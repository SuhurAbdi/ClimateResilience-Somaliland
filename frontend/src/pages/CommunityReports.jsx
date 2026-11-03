import { useEffect, useState } from "react";
import "../App.css";
import "../styles/community-reports.css";

const API_URL = "http://127.0.0.1:8000/api/community-reports";

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(date) {
  if (!date) return "Not specified";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString();
}

function formatLabel(value) {
  if (!value) return "Not specified";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function CommunityReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    location: "Gabiley",
    report_type: "drought",
    description: "",
    reporter_name: "",
    reported_at: getTodayDate(),
  });

  async function loadReports() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load community reports.");
      }

      const result = await response.json();
      const records = Array.isArray(result) ? result : result.data;

      setReports(Array.isArray(records) ? records : []);
      setError("");
    } catch {
      setError(
        "Unable to load community reports. Please check that your Laravel server is running.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        const validationMessage = result.errors
          ? Object.values(result.errors).flat().join(" ")
          : result.message || "Unable to submit your report.";

        throw new Error(validationMessage);
      }

      setMessage("Your report was submitted successfully for review.");

      setFormData({
        location: "Gabiley",
        report_type: "drought",
        description: "",
        reporter_name: "",
        reported_at: getTodayDate(),
      });

      await loadReports();
    } catch (err) {
      setError(err.message || "Unable to submit your report.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Community Reports</h1>

      <p className="page-description">
        Help identify drought, flooding, water shortages, and other
        climate-related problems affecting communities in Gabiley, Somaliland.
      </p>

      <hr className="page-divider" />

      <section className="report-form-section">
        <h2 className="section-title">Submit a Community Report</h2>

        <p className="report-help-text">
          Share what is happening in your community to support local climate
          awareness and response.
        </p>

        <form className="report-form service-card" onSubmit={handleSubmit}>
          <div className="report-form-grid">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter village or location"
                required
                maxLength={255}
              />
            </div>

            <div className="form-group">
              <label htmlFor="report_type">Report Type</label>
              <select
                id="report_type"
                name="report_type"
                value={formData.report_type}
                onChange={handleChange}
                required
              >
                <option value="drought">Drought</option>
                <option value="flood">Flood</option>
                <option value="water_shortage">Water Shortage</option>
                <option value="heavy_rain">Heavy Rain</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the problem, its location, and how it affects your community..."
              rows={5}
              required
            />
          </div>

          <div className="report-form-grid">
            <div className="form-group">
              <label htmlFor="reporter_name">Your Name (Optional)</label>
              <input
                id="reporter_name"
                name="reporter_name"
                type="text"
                value={formData.reporter_name}
                onChange={handleChange}
                placeholder="Enter your name"
                maxLength={255}
              />
            </div>

            <div className="form-group">
              <label htmlFor="reported_at">Date of Report</label>
              <input
                id="reported_at"
                name="reported_at"
                type="date"
                value={formData.reported_at}
                onChange={handleChange}
                max={getTodayDate()}
                required
              />
            </div>
          </div>

          {message && (
            <p className="status-message loading-message" role="status">
              {message}
            </p>
          )}

          {error && (
            <p className="status-message error-message" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="report-submit-button"
          >
            {submitting ? "Submitting Report..." : "Submit Report"}
          </button>
        </form>
      </section>

      <hr className="page-divider" />

      <section className="recent-reports-section">
        <h2 className="section-title">Recent Community Reports</h2>

        <p className="report-help-text">
          Reports received by the system. A submitted report is not
          automatically verified.
        </p>

        {loading && (
          <p className="status-message loading-message">
            Loading community reports...
          </p>
        )}

        {!loading && !error && reports.length === 0 && (
          <p className="status-message empty-message">
            No community reports are available yet.
          </p>
        )}

        {!loading && reports.length > 0 && (
          <div className="forecast-grid">
            {reports.map((report) => (
              <article className="forecast-card report-card" key={report.id}>
                <div className="report-card-header">
                  <h3>{formatLabel(report.report_type)}</h3>

                  <span
                    className={`report-status status-${String(
                      report.status || "pending",
                    )
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-")}`}
                  >
                    {formatLabel(report.status || "pending")}
                  </span>
                </div>

                <p className="report-detail">
                  <strong>Location:</strong>{" "}
                  {report.location || "Not specified"}
                </p>

                <p className="report-description">
                  {report.description || "No description provided."}
                </p>

                <p className="report-detail">
                  <strong>Date:</strong> {formatDate(report.reported_at)}
                </p>

                <p className="report-detail">
                  <strong>Reported by:</strong>{" "}
                  {report.reporter_name || "Community member"}
                </p>

                <p className="report-verification">
                  <strong>Verification:</strong>{" "}
                  {String(report.status || "").toLowerCase() === "verified"
                    ? "Verified"
                    : "Not yet verified"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default CommunityReports;
