import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ExploreTourism from "./pages/ExploreTourism";
import TourGuide from "./pages/TourGuide";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import SosButton from "./components/SosButton";
import "./styles/global.css";

function App() {
  // Hard-coded user - always logged in for demo
  const [user, setUser] = useState({
    id: 'demo-user-123',
    email: 'demo@example.com',
    user_metadata: {
      user_type: 'tourist',
      name: 'Demo User'
    }
  });
  
  const [loading, setLoading] = useState(false);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<ExploreTourism />} />
            <Route path="/tour-guides" element={<TourGuide />} />
            <Route path="/login" element={<Navigate to="/explore" />} />
            <Route path="/signup" element={<Navigate to="/explore" />} />
          </Routes>
        </main>
        <SosButton />
      </div>
    </Router>
  );
}

export default App;
