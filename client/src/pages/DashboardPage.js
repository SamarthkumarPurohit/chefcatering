import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const statusColors = { pending: '#f59e0b', confirmed: '#3b82f6', 'in-progress': '#8b5cf6', completed: '#10b981', cancelled: '#ef4444' };

const DashboardPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    axios.get('/api/bookings').then(r => { setBookings(r.data); setLoading(false); }).catch(() => {
      setBookings(mockBookings);
      setLoading(false);
    });
  }, []);

  const mockBookings = [
    { _id: 'b1', service: { title: 'Royal Wedding Package' }, chef: { name: 'Chef Arjun Kapoor' }, eventDate: '2024-03-15', eventType: 'Wedding', guestCount: 250, totalAmount: 300000, status: 'confirmed', donationConsent: true, donationStatus: 'scheduled', estimatedSurplusFood: 37 },
    { _id: 'b2', service: { title: 'Corporate Lunch Service' }, chef: { name: 'Chef Meera Shah' }, eventDate: '2024-02-20', eventType: 'Corporate', guestCount: 80, totalAmount: 28000, status: 'completed', donationConsent: true, donationStatus: 'completed', estimatedSurplusFood: 12 },
    { _id: 'b3', service: { title: 'Birthday Bash Special' }, chef: { name: 'Chef Ravi Kumar' }, eventDate: '2024-04-05', eventType: 'Birthday', guestCount: 60, totalAmount: 39000, status: 'pending', donationConsent: false, donationStatus: 'not-applicable', estimatedSurplusFood: 0 },
  ];

  const totalImpactKg = bookings.reduce((sum, b) => b.donationStatus === 'completed' ? sum + (b.estimatedSurplusFood || 0) : sum, 0);

  return (
    <div className="page dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name}! 👋</h1>
          <p>Manage your bookings and track your food donation impact</p>
        </div>
        <Link to="/services" className="btn-primary">+ New Booking</Link>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <strong>{bookings.length}</strong>
            <span>Total Bookings</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <strong>{bookings.filter(b => b.status === 'completed').length}</strong>
            <span>Completed Events</span>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">🌱</div>
          <div className="stat-info">
            <strong>{totalImpactKg}kg</strong>
            <span>Food Donated</span>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">🤝</div>
          <div className="stat-info">
            <strong>{Math.floor(totalImpactKg / 0.4 / 3)}</strong>
            <span>People Fed</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button className={activeTab === 'bookings' ? 'tab active' : 'tab'} onClick={() => setActiveTab('bookings')}>My Bookings</button>
        <button className={activeTab === 'donations' ? 'tab active' : 'tab'} onClick={() => setActiveTab('donations')}>🌱 Donations</button>
      </div>

      {activeTab === 'bookings' && (
        <div className="bookings-list">
          {loading ? <div className="loading-spinner">Loading...</div> : bookings.map(b => (
            <div className="booking-card" key={b._id}>
              <div className="booking-card-header">
                <div>
                  <h3>{b.service?.title}</h3>
                  <p>👨‍🍳 {b.chef?.name} · {b.eventType}</p>
                </div>
                <span className="status-badge" style={{ background: statusColors[b.status] }}>{b.status}</span>
              </div>
              <div className="booking-card-details">
                <span>📅 {new Date(b.eventDate).toLocaleDateString('en-IN')}</span>
                <span>👥 {b.guestCount} guests</span>
                <span>💰 ₹{b.totalAmount?.toLocaleString('en-IN')}</span>
                {b.donationConsent && (
                  <span className={`donation-status ${b.donationStatus}`}>
                    🌱 Donation: {b.donationStatus} ({b.estimatedSurplusFood}kg)
                  </span>
                )}
              </div>
              {!b.donationConsent && b.status !== 'cancelled' && b.status !== 'completed' && (
                <div className="donation-nudge">
                  💡 <strong>Opt-in for food donation</strong> — Feed people with your event's surplus!
                  <Link to={`/bookings/${b._id}/donate`} className="btn-donate-small">Enable Donation</Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'donations' && (
        <div className="donations-summary">
          <div className="impact-banner">
            <h2>🌍 Your Food Donation Impact</h2>
            <p>Together, we're fighting hunger one event at a time</p>
            <div className="impact-stats">
              <div><strong>{totalImpactKg}kg</strong><span>Total Food Donated</span></div>
              <div><strong>{Math.floor(totalImpactKg / 0.4 / 3)}</strong><span>People Fed</span></div>
              <div><strong>{bookings.filter(b => b.donationConsent).length}</strong><span>Events Donated</span></div>
            </div>
          </div>
          <div className="donations-list">
            {bookings.filter(b => b.donationConsent).map(b => (
              <div className="donation-item" key={b._id}>
                <div className="donation-item-icon">🤝</div>
                <div>
                  <strong>{b.service?.title}</strong>
                  <p>{new Date(b.eventDate).toLocaleDateString('en-IN')} · {b.estimatedSurplusFood}kg donated</p>
                  <span className={`donation-status-badge ${b.donationStatus}`}>{b.donationStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
