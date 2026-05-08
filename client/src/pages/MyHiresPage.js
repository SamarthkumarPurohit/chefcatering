import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const statusColors = {
  pending: '#f59e0b', accepted: '#3b82f6', rejected: '#ef4444',
  ongoing: '#8b5cf6', completed: '#10b981', cancelled: '#9ca3af'
};

const MyHiresPage = () => {
  const [hires, setHires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState(null);
  const [review, setReview] = useState({ rating: 5, text: '' });

  useEffect(() => {
    axios.get('/api/chef-hire/my-hires')
      .then(r => { setHires(r.data); setLoading(false); })
      .catch(() => { setHires(mockHires); setLoading(false); });
  }, []);

  const mockHires = [
    {
      _id: 'h1',
      chef: { name: 'Chef Arjun Kapoor', phone: '9876543210' },
      hireType: 'daily-cooking',
      startDate: '2024-03-10',
      endDate: '2024-03-10',
      startTime: '09:00',
      endTime: '14:00',
      address: 'Juhu, Mumbai',
      numberOfPeople: 4,
      cuisinePreference: ['North Indian'],
      agreedRate: 2800,
      totalDays: 1,
      totalAmount: 2800,
      rateType: 'per-day',
      status: 'accepted',
      chefNote: 'Looking forward to cooking for your family!'
    },
    {
      _id: 'h2',
      chef: { name: 'Chef Meera Shah', phone: '9876543211' },
      hireType: 'cooking-class',
      startDate: '2024-02-20',
      endDate: '2024-02-20',
      startTime: '11:00',
      endTime: '14:00',
      address: 'Bandra, Mumbai',
      numberOfPeople: 2,
      cuisinePreference: ['Italian', 'Baking'],
      agreedRate: 600,
      totalHours: 3,
      totalAmount: 1800,
      rateType: 'per-hour',
      status: 'completed',
      customerRating: 5,
      customerReview: 'Meera was fantastic! Learned so much about Italian cooking.'
    },
    {
      _id: 'h3',
      chef: { name: 'Chef Ravi Kumar', phone: '9876543212' },
      hireType: 'special-occasion',
      startDate: '2024-04-14',
      endDate: '2024-04-14',
      startTime: '18:00',
      endTime: '22:00',
      address: 'Powai, Mumbai',
      numberOfPeople: 2,
      cuisinePreference: ['Continental', 'French'],
      agreedRate: 3500,
      totalDays: 1,
      totalAmount: 3500,
      rateType: 'fixed',
      status: 'pending',
    },
  ];

  const cancelHire = async (id) => {
    try {
      await axios.put(`/api/chef-hire/${id}/cancel`);
      setHires(prev => prev.map(h => h._id === id ? { ...h, status: 'cancelled' } : h));
      toast.success('Hire request cancelled');
    } catch { toast.error('Cannot cancel this hire'); }
  };

  const submitReview = async () => {
    try {
      await axios.put(`/api/chef-hire/${reviewModal}/review`, {
        customerRating: review.rating,
        customerReview: review.text
      });
      setHires(prev => prev.map(h =>
        h._id === reviewModal ? { ...h, customerRating: review.rating, customerReview: review.text } : h
      ));
      toast.success('Review submitted!');
      setReviewModal(null);
    } catch { toast.error('Review failed'); }
  };

  const hireTypeLabel = {
    'daily-cooking': '🏠 Daily Cooking',
    'weekly-meal-prep': '📦 Meal Prep',
    'private-party': '🎉 Private Party',
    'live-in-chef': '🌙 Live-In Chef',
    'cooking-class': '📚 Cooking Class',
    'special-occasion': '💑 Special Occasion',
  };

  return (
    <div className="page dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>👨‍🍳 My Hired Chefs</h1>
          <p>Track all your personal chef hire requests</p>
        </div>
        <Link to="/hire-chef" className="btn-primary">+ Hire a Chef</Link>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info"><strong>{hires.length}</strong><span>Total Hires</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <strong>{hires.filter(h => h.status === 'completed').length}</strong>
            <span>Completed</span>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <strong>{hires.filter(h => ['pending','accepted'].includes(h.status)).length}</strong>
            <span>Active</span>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <strong>₹{hires.filter(h=>h.status==='completed').reduce((s,h)=>s+(h.totalAmount||0),0).toLocaleString('en-IN')}</strong>
            <span>Total Spent</span>
          </div>
        </div>
      </div>

      {loading ? <div className="loading-spinner">Loading...</div> : (
        <div className="hires-list">
          {hires.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: '4rem' }}>👨‍🍳</div>
              <h3>No hire requests yet</h3>
              <p>Hire a personal chef to cook at your home</p>
              <Link to="/hire-chef" className="btn-primary" style={{ marginTop: 16 }}>Browse Chefs</Link>
            </div>
          ) : hires.map(h => (
            <div className="booking-card" key={h._id}>
              <div className="booking-card-header">
                <div>
                  <h3>{hireTypeLabel[h.hireType] || h.hireType}</h3>
                  <p>👨‍🍳 {h.chef?.name} · 📞 {h.chef?.phone}</p>
                  <p>📅 {h.startDate} · ⏰ {h.startTime} – {h.endTime}</p>
                  <p>📍 {h.address} · 👥 {h.numberOfPeople} people</p>
                  {h.cuisinePreference?.length > 0 && (
                    <p>🍛 {h.cuisinePreference.join(', ')}</p>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <span className="status-badge" style={{ background: statusColors[h.status] }}>
                    {h.status}
                  </span>
                  <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>
                    ₹{h.totalAmount?.toLocaleString('en-IN')}
                  </strong>
                  <small style={{ color: 'var(--text-muted)' }}>
                    {h.rateType === 'per-day' ? `₹${h.agreedRate}/day × ${h.totalDays}d` :
                     h.rateType === 'per-hour' ? `₹${h.agreedRate}/hr × ${h.totalHours}h` : 'Fixed'}
                  </small>
                </div>
              </div>

              {/* Chef's response note */}
              {h.chefNote && (
                <div className="chef-note-box">
                  💬 <strong>Chef's note:</strong> {h.chefNote}
                </div>
              )}
              {h.rejectionReason && (
                <div className="rejection-box">
                  ❌ <strong>Rejected:</strong> {h.rejectionReason}
                </div>
              )}

              {/* Review shown if completed and reviewed */}
              {h.customerRating && (
                <div className="review-box">
                  {'⭐'.repeat(h.customerRating)} <em>"{h.customerReview}"</em>
                </div>
              )}

              {/* Actions */}
              <div className="hire-actions">
                {['pending', 'accepted'].includes(h.status) && (
                  <button className="btn-cancel-sm" onClick={() => cancelHire(h._id)}>
                    Cancel Request
                  </button>
                )}
                {h.status === 'completed' && !h.customerRating && (
                  <button className="btn-confirm-sm" onClick={() => setReviewModal(h._id)}>
                    ⭐ Leave Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div className="modal-overlay" onClick={() => setReviewModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>⭐ Rate Your Chef</h3>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>Rating</label>
              <div className="star-selector">
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button"
                    className={`star-btn ${review.rating >= n ? 'active' : ''}`}
                    onClick={() => setReview({ ...review, rating: n })}>
                    ⭐
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Your Review</label>
              <textarea value={review.text} onChange={e => setReview({ ...review, text: e.target.value })}
                placeholder="How was your experience with this chef?" rows={4} />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setReviewModal(null)}>Cancel</button>
              <button className="btn-primary" onClick={submitReview}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHiresPage;