import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'chef') return '/chef-dashboard';
    if (user.role === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">👨‍🍳</span>
          <span className="brand-name">ChefCater<span className="brand-accent">Pro</span></span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link to="/hire-chef" onClick={() => setMenuOpen(false)} className="nav-hire">
            🧑‍🍳 Hire a Chef
          </Link>
          <Link to="/menu" onClick={() => setMenuOpen(false)}>Menu</Link>
          <Link to="/ngos" onClick={() => setMenuOpen(false)}>NGOs</Link>
          <Link to="/impact" onClick={() => setMenuOpen(false)}>🌱 Impact</Link>
          {user ? (
            <>
              <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              {user.role === 'customer' && (
                <Link to="/my-hires" onClick={() => setMenuOpen(false)}>My Chefs</Link>
              )}
              {(user.role === 'customer' || user.role === 'chef') && (
                <Link to="/donations" onClick={() => setMenuOpen(false)}>🤝 Donations</Link>
              )}
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
              <span className="user-badge">{user.name}</span>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
