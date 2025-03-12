import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import EnhancedTourism from "./pages/EnhancedTourism";
import TourGuide from "./pages/TourGuide";
import ChatAI from "./pages/ChatAI";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import SosButton from "./components/SosButton";
import { getCurrentUser, supabase } from "./supabase";
import "./styles/global.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for authenticated user on initial load
    const checkAuth = async () => {
      try {
        const { data, error } = await getCurrentUser();
        
        if (error) {
          console.error("Error fetching current user:", error);
          setUser(null);
        } else if (data && data.user) {
          // Create user object with session data
          const userData = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.email.split("@")[0],
            userType: data.user.user_metadata?.user_type || "tourist"
          };
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Unexpected error checking auth:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const userData = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.email.split("@")[0],
            userType: session.user.user_metadata?.user_type || "tourist"
          };
          setUser(userData);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
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
            <Route path="/" element={<Home user={user} />} />
            <Route 
              path="/enhanced-tourism" 
              element={
                <PrivateRoute>
                  <EnhancedTourism user={user} />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/tour-guides" 
              element={
                <PrivateRoute>
                  <TourGuide user={user} />
                </PrivateRoute>
              } 
            />
            <Route path="/about" element={<About />} />
            <Route 
              path="/chat-ai" 
              element={
                <PrivateRoute>
                  <ChatAI user={user} />
                </PrivateRoute>
              } 
            />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <SosButton />
      </div>
    </Router>
  );
}

export default App;
