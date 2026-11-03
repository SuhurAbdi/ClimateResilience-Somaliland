import { useEffect, useState } from "react";
import "../App.css";
import "../styles/alerts.css";
const locations = {
  Gabiley: { latitude: 9.7167, longitude: 43.6167 },
  Hargeisa: { latitude: 9.5624, longitude: 44.077 },
  Borama: { latitude: 9.9333, longitude: 43.1833 },
  Berbera: { latitude: 10.4396, longitude: 45.0143 },
};

function createWeatherAlerts(data, location) {
  const daily = data.daily;
  const alerts = [];

  daily.time.forEach((date, index) => {
    const rain = daily.precipitation_sum[index];
    const rainProbability = daily.precipitation_probability_max[index];
    const maxTemperature = daily.temperature_2m_max[index];
    const maxWind = daily.wind_speed_10m_max[index];

    if ((rain >= 20 && rainProbability >= 60) || rain >= 40) {
      alerts.push({
        id: `rain-${date}`,
        title_en: "Potential Heavy Rainfall",
        title_so: "Digniin Roob Xooggan",
        alert_type: "Heavy rainfall",
        severity: rain >= 40 ? "High" : "Moderate",
        date,
        location,
        message_en: `The forecast estimates ${rain} mm of rainfall, with a maximum precipitation probability of ${rainProbability ?? "unavailable"}%. Heavy rainfall may cause local flooding, runoff, or disruption. Monitor official updates and avoid crossing flooded streams.`,
        message_so: `Saadaashu waxay muujinaysaa ${rain} mm oo roob ah. Roob xooggan wuxuu keeni karaa daadad. La soco digniinaha rasmiga ah, kana fogow meelaha ay biyuhu ku fatahaan.`,
        source: "Open-Meteo weather forecast",
      });
    }

    if (maxTemperature >= 38) {
      alerts.push({
        id: `heat-${date}`,
        title_en: "High Temperature Risk",
        title_so: "Digniin Heerkul Sare",
        alert_type: "High temperature",
        severity: maxTemperature >= 42 ? "High" : "Moderate",
        date,
        location,
        message_en: `The forecast maximum temperature is ${maxTemperature}°C. Heat may increase stress on people and livestock. Provide shade and sufficient clean drinking water, and avoid unnecessary activity during the hottest hours.`,
        message_so: `Heerkulka ugu sarreeya ee la saadaaliyey waa ${maxTemperature}°C. Kulaylku wuxuu saameyn karaa dadka iyo xoolaha. Bixi hoos iyo biyo nadiif ah, kana fogow shaqada culus saacadaha ugu kulul.`,
        source: "Open-Meteo weather forecast",
      });
    }

    if (maxWind >= 50) {
      alerts.push({
        id: `wind-${date}`,
        title_en: "Strong Wind Risk",
        title_so: "Digniin Dabayl Xooggan",
        alert_type: "Strong wind",
        severity: maxWind >= 70 ? "High" : "Moderate",
        date,
        location,
        message_en: `Maximum wind speed may reach ${maxWind} km/h. Secure loose materials and shelter livestock where practical. Follow local official guidance if conditions worsen.`,
        message_so: `Xawaaraha dabaysha ugu sarreeya waxaa la saadaaliyey ${maxWind} km/h. Sug alaabta dabayshu qaadi karto, xoolahana meel ammaan ah gee haddii ay suurtagal tahay.`,
        source: "Open-Meteo weather forecast",
      });
    }
  });

  return alerts.sort((a, b) => a.date.localeCompare(b.date));
}

function ClimateAlerts() {
  const [location, setLocation] = useState("Gabiley");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const loadAlerts = async (place, coordinates) => {
    setLoading(true);
    setError("");

    try {
      const url = new URL("https://api.open-meteo.com/v1/forecast");

      url.search = new URLSearchParams({
        latitude: String(coordinates.latitude),
        longitude: String(coordinates.longitude),
        daily:
          "temperature_2m_max,precipitation_probability_max,precipitation_sum,wind_speed_10m_max",
        timezone: "auto",
        forecast_days: "7",
      }).toString();

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Weather service unavailable.");
      }

      const data = await response.json();

      if (!data.daily?.time) {
        throw new Error("Forecast data is incomplete.");
      }

      setAlerts(createWeatherAlerts(data, place));
      setLocation(place);
      setUpdatedAt(new Date().toLocaleString());
    } catch {
      setError(
        "Unable to retrieve current forecast data. Check your internet connection and try again.",
      );
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts("Gabiley", locations.Gabiley);
  }, []);

  const formatDate = (date) =>
    new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getSeverityClass = (severity) => {
    const value = severity.toLowerCase();

    if (value === "high") {
      return "alert-severity alert-severity-high";
    }

    return "alert-severity alert-severity-moderate";
  };

  const handleLocationChange = (event) => {
    const place = event.target.value;
    if (locations[place]) {
      loadAlerts(place, locations[place]);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Climate Risk Alerts</h1>

      <p className="page-description">
        Forecast-based weather risk indicators for Somaliland communities.
      </p>

      <hr className="page-divider" />

      <div className="climate-alert-controls">
        <div>
          <label htmlFor="alert-location">Select location</label>
          <select
            id="alert-location"
            value={location}
            onChange={handleLocationChange}
            disabled={loading}
          >
            {Object.keys(locations).map((place) => (
              <option key={place} value={place}>
                {place}, Somaliland
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="climate-alert-refresh"
          onClick={() => loadAlerts(location, locations[location])}
          disabled={loading}
        >
          {loading ? "Checking..." : "Refresh alerts"}
        </button>
      </div>

      <p className="climate-alert-source">
        Source: Open-Meteo forecast data
        {updatedAt ? ` · Retrieved ${updatedAt}` : ""}
      </p>

      {loading && (
        <p className="status-message loading-message">
          Checking the latest forecast for potential risks...
        </p>
      )}

      {error && (
        <p className="status-message error-message" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && alerts.length === 0 && (
        <div className="climate-alert-all-clear">
          <h2>No threshold-triggered alerts</h2>
          <p>
            The available seven-day forecast did not meet this application's
            alert thresholds for heavy rainfall, high temperature, or strong
            wind. This does not guarantee that conditions are safe and does not
            rule out drought or other hazards.
          </p>
        </div>
      )}

      {!loading && !error && alerts.length > 0 && (
        <>
          <h2 className="section-title">Potential Risks — {location}</h2>

          <div className="forecast-grid">
            {alerts.map((alert) => (
              <article className="forecast-card alert-card" key={alert.id}>
                <div className="alert-card-header">
                  <span className="alert-icon" aria-hidden="true">
                    {alert.alert_type === "Heavy rainfall"
                      ? "🌧️"
                      : alert.alert_type === "High temperature"
                        ? "🌡️"
                        : "💨"}
                  </span>

                  <span className={getSeverityClass(alert.severity)}>
                    {alert.severity} forecast risk
                  </span>
                </div>

                <h2>{alert.title_en}</h2>

                <p className="alert-type">
                  <strong>Hazard:</strong> {alert.alert_type}
                </p>

                <p className="alert-message-text">{alert.message_en}</p>

                <hr className="page-divider" />

                <div className="alert-somali-section" lang="so">
                  <h3>{alert.title_so}</h3>
                  <p className="alert-message-text">{alert.message_so}</p>
                </div>

                <div className="alert-dates">
                  <p>
                    <strong>Forecast date:</strong> {formatDate(alert.date)}
                  </p>
                  <p>
                    <strong>Location:</strong> {alert.location}
                  </p>
                </div>

                <p className="alert-source">
                  <strong>Data source:</strong> {alert.source}
                </p>
              </article>
            ))}
          </div>
        </>
      )}

      <section className="climate-alert-disclaimer">
        <strong>Important safety information</strong>
        <p>
          These are automatically generated indicators based on weather model
          forecasts and fixed thresholds. They are not official meteorological
          warnings. Drought requires rainfall history, observations, and
          longer-term monitoring; it cannot be confirmed from this seven-day
          forecast alone. Follow relevant official warnings and local
          authorities' advice.
        </p>
      </section>
    </div>
  );
}

export default ClimateAlerts;
