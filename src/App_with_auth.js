import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ExploreTourism from "./pages/ExploreTourism";
import TourGuide from "./pages/TourGuide";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import SosButton from "./components/SosButton";
import { getCurrentUser } from "./services/simpleAuth";
import "./styles/global.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for authenticated user on initial load
    const checkAuth = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();

    // Setup listener for auth state changes (from other tabs)
    window.addEventListener('storage', (event) => {
      if (event.key === 'nammaTourAuthUser') {
        checkAuth();
      }
    });

    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, []);

  // Create a private route wrapper
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/explore" 
              element={
                <PrivateRoute>
                  <ExploreTourism />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/tour-guides" 
              element={
                <PrivateRoute>
                  <TourGuide />
                </PrivateRoute>
              } 
            />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
          </Routes>
        </main>
        <SosButton />
      </div>
    </Router>
  );
}

export default App;
