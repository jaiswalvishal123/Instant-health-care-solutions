import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useApp();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <i className="fas fa-heartbeat"></i>
          <span>QuickCare</span>
        </Link>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <i className="fas fa-home"></i>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            >
              <i className="fas fa-info-circle"></i>
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/doctors" 
              className={`nav-link ${isActive('/doctors') ? 'active' : ''}`}
            >
              <i className="fas fa-user-md"></i>
              Doctors
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/services" 
              className={`nav-link ${isActive('/services') ? 'active' : ''}`}
            >
              <i className="fas fa-hand-holding-medical"></i>
              Services
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/contact" 
              className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            >
              <i className="fas fa-phone-alt"></i>
              Contact
            </Link>
          </li>
        </ul>

        <div className="nav-actions">
          {cart.length > 0 && (
            <div className="cart-badge">
              <span>{cart.length}</span>
            </div>
          )}
          <button className="emergency-btn">
            <i className="fas fa-ambulance"></i>
            Emergency
          </button>
          
          <div 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;