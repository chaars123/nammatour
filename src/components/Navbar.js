import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from '../supabase';

const Navbar = ({ user, setUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Unexpected error during sign out:', err);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            NammaTour
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/enhanced-tourism" className="nav-link">Tourism</Link>
            <Link to="/tour-guides" className="nav-link">Tour Guides</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/chat-ai" className="nav-link flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              AI Assistant
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Hi, {user.name || user.email.split('@')[0]}</span>
                <button 
                  onClick={handleSignOut}
                  className="btn btn-primary"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className="text-gray-500 hover:text-primary focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                {isMenuOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-4 space-y-1 sm:px-3">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/enhanced-tourism"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Tourism
          </Link>
          <Link
            to="/tour-guides"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Tour Guides
          </Link>
          <Link
            to="/about"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/chat-ai"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            AI Assistant
          </Link>
          
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <div className="ml-3">
                  <div className="text-base font-medium leading-none">
                    {user.name || user.email.split('@')[0]}
                  </div>
                  <div className="text-sm font-medium leading-none text-gray-500">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100 w-full text-left"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex flex-col space-y-2 px-3">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
