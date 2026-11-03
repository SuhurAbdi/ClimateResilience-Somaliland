import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ClimateForecasts from "./pages/ClimateForecasts";
import ClimateAlerts from "./pages/ClimateAlerts";
import LivestockAdvice from "./pages/LivestockAdvice";
import CommunityReports from "./pages/CommunityReports";

function MainLayout() {
  return (
    <>
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages requiring login */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forecasts" element={<ClimateForecasts />} />
            <Route path="/alerts" element={<ClimateAlerts />} />
            <Route path="/livestock-advice" element={<LivestockAdvice />} />
            <Route path="/community-reports" element={<CommunityReports />} />
          </Route>
        </Route>

        {/* Default and unknown routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
