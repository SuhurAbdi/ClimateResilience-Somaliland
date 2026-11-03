import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";
import "../styles/auth.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    // Clear any previous account session before attempting login.
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");

    try {
      const response = await api.post("/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const token = response.data.token;
      const user = response.data.user;

      // Ensure the backend returned the new authenticated account.
      if (!token || !user || !user.email) {
        throw new Error("The server did not return valid account information.");
      }

      // Save the newly authenticated user's session.
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      // Do not leave an old or incomplete session after a failed login.
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");

      if (err.response?.status === 422 || err.response?.status === 401) {
        setError(
          err.response?.data?.message ||
            "The email or password is incorrect. Please try again.",
        );
      } else if (!err.response) {
        setError(
          err.message === "The server did not return valid account information."
            ? err.message
            : "Unable to connect to the server. Please check that the Laravel backend is running.",
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-heading">
          <span className="auth-logo">🌿</span>
          <h1>ClimateResilience</h1>
          <p>Localized climate information for resilient communities</p>
        </div>

        <h2>Welcome Back</h2>

        <p className="auth-description">
          Sign in to access climate forecasts, early warnings, and livestock
          advice for your community.
        </p>

        {error && (
          <div className="auth-error" role="alert" aria-live="polite">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>

          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            autoComplete="email"
            maxLength={255}
            required
            disabled={loading}
          />

          <label htmlFor="password">Password</label>

          <div className="login-password-field">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              disabled={loading}
            />

            <button
              type="button"
              className="login-password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              disabled={loading}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 002.8 2.8" />
                  <path d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.3 4.1 9.5 7-.5 1.2-1.3 2.4-2.3 3.3" />
                  <path d="M6.2 6.2C4.4 7.4 3.2 9.2 2.5 12c1.2 2.9 4.5 7 9.5 7 1.5 0 2.8-.4 4-1.1" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
