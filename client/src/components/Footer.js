import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-brand">
        <h3>👨‍🍳 ChefCaterPro</h3>
        <p>Premium catering services with a heart — connecting great food with those who need it most.</p>
      </div>
      <div className="footer-links">
        <h4>Services</h4>
        <Link to="/services">Browse Services</Link>
        <Link to="/menu">Our Menu</Link>
        <Link to="/booking">Book a Chef</Link>
      </div>
      <div className="footer-links">
        <h4>Social Impact</h4>
        <Link to="/ngos">NGO Partners</Link>
        <Link to="/impact">Food Impact</Link>
        <Link to="/donations">Donate Food</Link>
      </div>
      <div className="footer-links">
        <h4>Account</h4>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2024 ChefCaterPro. Made with ❤️ to feed the world.</p>
      <p className="footer-impact">🌱 Every event, every meal, we give back.</p>
    </div>
  </footer>
);

export default Footer;
