import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">📄</span>
          <span className="logo-text">CV Builder Pro</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {user ? (
            <>
              <Link to="/dashboard" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/cv-form" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                Build CV
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                  Admin Panel
                </Link>
              )}
              <div className="navbar-user">
                <div className="user-info">
                  <FiUser className="user-icon" />
                  <span className="user-name">{user.name}</span>
                  {user.subscription === 'premium' && (
                    <span className="subscription-badge">Premium</span>
                  )}
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                  <FiLogOut />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="navbar-link navbar-link-primary" onClick={() => setIsMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
