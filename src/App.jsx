import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CalculatorPage from "./pages/CalculatorPage";
import TrackerPage from "./pages/TrackerPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/tracker" element={<TrackerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
