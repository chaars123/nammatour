import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/simpleAuth';

const Navbar = ({ user, setUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    setUser(null);
    navigate('/');
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
            <Link to="/explore" className="nav-link">Explore</Link>
            <Link to="/tour-guides" className="nav-link">Tour Guides</Link>
            
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
            to="/explore"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Explore
          </Link>
          <Link
            to="/tour-guides"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Tour Guides
          </Link>
          
          {user ? (
            <>
              <div className="px-3 py-2 text-sm font-medium text-gray-700">
                Hi, {user.name || user.email.split('@')[0]}
              </div>
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-primary hover:bg-primary-dark"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary hover:bg-primary-dark"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
