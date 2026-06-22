import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import CalculatorPage from "./pages/CalculatorPage";
import TrackerPage from "./pages/TrackerPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-lightgray text-darktext font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-start p-4 max-w-3xl mx-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/calculator" replace />} />
            <Route path="/calculator" element={<CalculatorPage />} />
            <Route path="/tracker" element={<TrackerPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
