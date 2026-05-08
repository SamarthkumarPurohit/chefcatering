import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ChefDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [showAddService, setShowAddService] = useState(false);
  const [serviceForm, setServiceForm] = useState({ title: '', category: 'wedding', pricePerHead: '', description: '', minGuests: 10, maxGuests: 500 });

  useEffect(() => {
    axios.get('/api/bookings').then(r => setBookings(r.data)).catch(() => setBookings(mockBookings));
  }, []);

  const mockBookings = [
    { _id: 'b1', customer: { name: 'Priya Sharma', phone: '9876543210' }, service: { title: 'Royal Wedding Package' }, eventDate: '2024-03-15', eventType: 'Wedding', guestCount: 250, venue: 'Taj Hotel, Mumbai', status: 'confirmed', donationConsent: true, estimatedSurplusFood: 37, totalAmount: 300000 },
    { _id: 'b2', customer: { name: 'Rahul Mehta', phone: '9876541230' }, service: { title: 'Corporate Lunch' }, eventDate: '2024-02-20', eventType: 'Corporate', guestCount: 80, venue: 'Infosys Campus, Pune', status: 'completed', donationConsent: true, estimatedSurplusFood: 12, totalAmount: 28000 },
  ];

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/bookings/${id}/status`, { status });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
      toast.success(`Booking ${status}!`);
    } catch { toast.error('Update failed'); }
  };

  const addService = async () => {
    try {
      await axios.post('/api/services', serviceForm);
      toast.success('Service added!');
      setShowAddService(false);
    } catch { toast.error('Failed to add service'); }
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const donationBookings = bookings.filter(b => b.donationConsent);

  return (
    <div className="page dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Chef Dashboard 👨‍🍳</h1>
          <p>Welcome, {user?.name} — manage bookings and food donations</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddService(true)}>+ Add Service</button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card"><div className="stat-icon">📋</div><div className="stat-info"><strong>{bookings.length}</strong><span>Total Bookings</span></div></div>
        <div className="stat-card"><div className="stat-icon">💰</div><div className="stat-info"><strong>₹{totalRevenue.toLocaleString('en-IN')}</strong><span>Total Revenue</span></div></div>
        <div className="stat-card green"><div className="stat-icon">🌱</div><div className="stat-info"><strong>{donationBookings.length}</strong><span>Donation Events</span></div></div>
        <div className="stat-card orange"><div className="stat-icon">🍽️</div><div className="stat-info"><strong>{donationBookings.reduce((s, b) => s + (b.estimatedSurplusFood || 0), 0)}kg</strong><span>Food to Donate</span></div></div>
      </div>

      <div className="dashboard-tabs">
        <button className={activeTab === 'bookings' ? 'tab active' : 'tab'} onClick={() => setActiveTab('bookings')}>Bookings</button>
        <button className={activeTab === 'donations' ? 'tab active' : 'tab'} onClick={() => setActiveTab('donations')}>🌱 Donation Events</button>
      </div>

      {activeTab === 'bookings' && (
        <div className="chef-bookings">
          {bookings.map(b => (
            <div className="booking-card chef-booking-card" key={b._id}>
              <div className="booking-card-header">
                <div>
                  <h3>{b.service?.title}</h3>
                  <p>👤 {b.customer?.name} · 📞 {b.customer?.phone}</p>
                  <p>📅 {new Date(b.eventDate).toLocaleDateString('en-IN')} · {b.eventType}</p>
                  <p>📍 {b.venue} · 👥 {b.guestCount} guests</p>
                </div>
                <div className="booking-actions">
                  <span className={`status-badge status-${b.status}`}>{b.status}</span>
                  {b.status === 'pending' && (
                    <>
                      <button className="btn-confirm-sm" onClick={() => updateStatus(b._id, 'confirmed')}>✅ Confirm</button>
                      <button className="btn-cancel-sm" onClick={() => updateStatus(b._id, 'cancelled')}>❌ Cancel</button>
                    </>
                  )}
                  {b.status === 'confirmed' && (
                    <button className="btn-confirm-sm" onClick={() => updateStatus(b._id, 'completed')}>✔ Mark Complete</button>
                  )}
                </div>
              </div>
              {b.donationConsent && (
                <div className="donation-alert">
                  🌱 <strong>NGO Donation Opted:</strong> ~{b.estimatedSurplusFood}kg surplus food will be collected after event
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'donations' && (
        <div className="donations-list">
          {donationBookings.length === 0 ? (
            <div className="empty-state">No donation events yet</div>
          ) : donationBookings.map(b => (
            <div className="donation-item-card" key={b._id}>
              <div className="donation-item-icon big">🤝</div>
              <div className="donation-item-info">
                <h3>{b.service?.title}</h3>
                <p>👤 {b.customer?.name} · 📅 {new Date(b.eventDate).toLocaleDateString('en-IN')}</p>
                <p>📍 {b.venue}</p>
                <p className="surplus-info">Estimated Surplus: <strong>{b.estimatedSurplusFood}kg</strong> ≈ {Math.floor((b.estimatedSurplusFood || 0) / 0.4 / 3)} people fed</p>
              </div>
              <div className="donation-item-status">
                <span className={`donation-status-badge ${b.donationStatus}`}>{b.donationStatus}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Service Modal */}
      {showAddService && (
        <div className="modal-overlay" onClick={() => setShowAddService(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Add New Service</h3>
            <div className="form-group"><label>Title</label><input value={serviceForm.title} onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} placeholder="e.g. Premium Wedding Package" /></div>
            <div className="form-group"><label>Category</label>
              <select value={serviceForm.category} onChange={e => setServiceForm({ ...serviceForm, category: e.target.value })}>
                {['wedding', 'birthday', 'corporate', 'social', 'private-dining', 'festival'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Price per Head (₹)</label><input type="number" value={serviceForm.pricePerHead} onChange={e => setServiceForm({ ...serviceForm, pricePerHead: e.target.value })} /></div>
            <div className="form-group"><label>Description</label><textarea value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} rows={3} /></div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowAddService(false)}>Cancel</button>
              <button className="btn-primary" onClick={addService}>Add Service</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChefDashboard;
