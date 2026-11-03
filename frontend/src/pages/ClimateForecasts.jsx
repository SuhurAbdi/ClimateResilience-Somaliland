import { useEffect, useState } from "react";
import "../App.css";
import "../styles/forecasts.css";

const locations = {
  Gabiley: { latitude: 9.7167, longitude: 43.6167 },
  Hargeisa: { latitude: 9.5624, longitude: 44.077 },
  Borama: { latitude: 9.9333, longitude: 43.1833 },
  Berbera: { latitude: 10.4396, longitude: 45.0143 },
};

function getWeatherDescription(code) {
  if (code === 0) return "Clear sky";
  if ([1, 2].includes(code)) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Conditions unavailable";
}

function getWeatherIcon(code) {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return "🌧️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌥️";
}

function ClimateForecasts() {
  const [location, setLocation] = useState("Gabiley");
  const [coordinates, setCoordinates] = useState(locations.Gabiley);
  const [forecasts, setForecasts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadForecast = async (latitude, longitude, place) => {
    setLoading(true);
    setError("");

    try {
      const url = new URL("https://api.open-meteo.com/v1/forecast");

      url.search = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        current:
          "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,cloud_cover",
        daily:
          "temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum",
        timezone: "auto",
        forecast_days: "7",
      }).toString();

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to retrieve weather data.");
      }

      const data = await response.json();

      setForecasts(data);
      setCoordinates({ latitude, longitude });
      setLocation(place);
    } catch {
      setError(
        "Weather data is temporarily unavailable. Check your internet connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForecast(
      locations.Gabiley.latitude,
      locations.Gabiley.longitude,
      "Gabiley",
    );
  }, []);

  const handleLocationChange = (event) => {
    const place = event.target.value;

    if (place === "current") {
      if (!navigator.geolocation) {
        setError("Your browser does not support location access.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          loadForecast(
            position.coords.latitude,
            position.coords.longitude,
            "My Current Location",
          );
        },
        () => {
          setError("Location access was denied. Please select a town instead.");
        },
      );

      return;
    }

    const selected = locations[place];

    if (selected) {
      loadForecast(selected.latitude, selected.longitude, place);
    }
  };

  const current = forecasts?.current;
  const daily = forecasts?.daily;

  return (
    <div className="page-container climate-page">
      <header className="climate-page-header">
        <div>
          <span className="climate-eyebrow">CLIMATE INTELLIGENCE</span>
          <h1 className="page-title">Climate Forecasts</h1>
          <p className="page-description">
            Real-time weather information for resilient communities.
          </p>
        </div>

        <button
          className="climate-refresh-button"
          type="button"
          disabled={loading}
          onClick={() =>
            loadForecast(coordinates.latitude, coordinates.longitude, location)
          }
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </header>

      <section className="climate-location-panel">
        <div className="climate-location-icon">⌖</div>

        <div className="climate-location-details">
          <label htmlFor="climate-location">Selected location</label>
          <select
            id="climate-location"
            className="forecast-location-select"
            value={location === "My Current Location" ? "current" : location}
            onChange={handleLocationChange}
            disabled={loading}
          >
            {Object.keys(locations).map((place) => (
              <option key={place} value={place}>
                {place}, Somaliland
              </option>
            ))}
            <option value="current">Use my current location</option>
          </select>
          <span className="climate-coordinates">
            {coordinates.latitude.toFixed(4)}°,{" "}
            {coordinates.longitude.toFixed(4)}°
          </span>
        </div>

        <div className="climate-live-status">
          <span className="climate-status-dot" />
          Weather data
        </div>
      </section>

      {loading && (
        <div className="climate-message">Loading weather information...</div>
      )}

      {error && (
        <div className="climate-error" role="alert">
          {error}
          <button
            type="button"
            onClick={() =>
              loadForecast(
                coordinates.latitude,
                coordinates.longitude,
                location,
              )
            }
          >
            Try again
          </button>
        </div>
      )}

      {current && !loading && (
        <>
          <section className="climate-hero">
            <div className="climate-hero-content">
              <span className="climate-hero-label">CURRENT CONDITIONS</span>
              <h2>{location}</h2>
              <p className="climate-weather-description">
                {getWeatherDescription(current.weather_code)}
              </p>

              <div className="climate-temperature">
                {Math.round(current.temperature_2m)}°<span>C</span>
              </div>

              <p className="climate-feels-like">
                Feels like {current.apparent_temperature}°C
              </p>
            </div>

            <div className="climate-hero-weather-icon">
              {getWeatherIcon(current.weather_code)}
            </div>

            <div className="climate-hero-footer">
              <span>◷ {current.time.replace("T", " ")}</span>
              <span>Source: Open-Meteo</span>
            </div>
          </section>

          <div className="climate-section-heading">
            <div>
              <h2>Weather Overview</h2>
              <p>Current measurements for your selected location</p>
            </div>
          </div>

          <section className="climate-metrics-grid">
            <article className="climate-metric-card">
              <div className="climate-metric-top">
                <span>Humidity</span>
                <span className="climate-metric-icon">💧</span>
              </div>
              <strong>{current.relative_humidity_2m}%</strong>
              <p>Relative humidity</p>
            </article>

            <article className="climate-metric-card">
              <div className="climate-metric-top">
                <span>Rainfall</span>
                <span className="climate-metric-icon">🌧️</span>
              </div>
              <strong>{current.precipitation} mm</strong>
              <p>Current precipitation</p>
            </article>

            <article className="climate-metric-card">
              <div className="climate-metric-top">
                <span>Wind speed</span>
                <span className="climate-metric-icon">💨</span>
              </div>
              <strong>{current.wind_speed_10m}</strong>
              <p>{forecasts.current_units.wind_speed_10m}</p>
            </article>

            <article className="climate-metric-card">
              <div className="climate-metric-top">
                <span>Cloud cover</span>
                <span className="climate-metric-icon">☁️</span>
              </div>
              <strong>{current.cloud_cover}%</strong>
              <p>Cloud coverage</p>
            </article>
          </section>

          <section className="climate-forecast-section">
            <div className="climate-section-heading">
              <div>
                <h2>7-Day Forecast</h2>
                <p>Daily temperatures and expected rainfall</p>
              </div>
              <span className="climate-forecast-badge">7 DAYS</span>
            </div>

            <div className="climate-daily-grid">
              {daily.time.map((date, index) => (
                <article
                  className={`climate-day-card ${
                    index === 0 ? "climate-day-today" : ""
                  }`}
                  key={date}
                >
                  <span className="climate-day-date">
                    {index === 0
                      ? "Today"
                      : new Date(`${date}T12:00:00`).toLocaleDateString("en", {
                          weekday: "short",
                          day: "numeric",
                        })}
                  </span>

                  <span className="climate-day-icon">
                    {daily.precipitation_probability_max[index] > 40
                      ? "🌦️"
                      : "☀️"}
                  </span>

                  <div className="climate-day-temperatures">
                    <strong>
                      {Math.round(daily.temperature_2m_max[index])}°
                    </strong>
                    <span>{Math.round(daily.temperature_2m_min[index])}°</span>
                  </div>

                  <div className="climate-rain-probability">
                    <span>💧</span>
                    {daily.precipitation_probability_max[index] ?? "—"}%
                  </div>

                  <p>{daily.precipitation_sum[index] ?? "—"} mm rain</p>
                </article>
              ))}
            </div>
          </section>

          <section className="climate-data-note">
            <span className="climate-data-note-icon">ⓘ</span>
            <div>
              <strong>About this forecast</strong>
              <p>
                Weather data is provided by Open-Meteo. Forecasts are model
                estimates and may differ from local conditions. This page does
                not yet display satellite imagery or satellite-derived rainfall
                measurements.
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default ClimateForecasts;
