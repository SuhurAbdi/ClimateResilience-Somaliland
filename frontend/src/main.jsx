import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

// Shared styles
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/navbar.css";
import "./styles/sidebarStyles.css";
import "./styles/auth.css";

// Page styles
import "./styles/dashboard.css";
import "./styles/forecasts.css";
import "./styles/alerts.css";
import "./styles/livestock-advice.css";
import "./styles/community-reports.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
