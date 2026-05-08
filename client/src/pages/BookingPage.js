import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [ngos, setNgos] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    eventDate: '',
    eventType: '',
    guestCount: 50,
    venue: '',
    specialRequests: '',
    // Donation fields
    donationConsent: false,
    donationNgo: '',
    estimatedSurplusFood: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [svcRes, ngoRes] = await Promise.all([
          axios.get(`/api/services/${serviceId}`),
          axios.get('/api/ngos')
        ]);
        setService(svcRes.data);
        setNgos(ngoRes.data);
      } catch {
        // Mock data for demo
        setService({
          _id: serviceId,
          title: 'Royal Wedding Package',
          pricePerHead: 1200,
          chef: { name: 'Chef Arjun Kapoor' },
          category: 'wedding',
          includes: ['Welcome Drinks', 'Starter Buffet', 'Main Course (8 items)', 'Dessert Counter', 'Live Pani Puri Counter']
        });
        setNgos([
          { _id: 'n1', name: 'Feeding India', city: 'Mumbai', contactPerson: 'Rahul Singh' },
          { _id: 'n2', name: 'No Food Waste', city: 'Delhi', contactPerson: 'Anita Sharma' },
          { _id: 'n3', name: 'Robin Hood Army', city: 'Bangalore', contactPerson: 'Karan Mehta' },
        ]);
      }
    };
    fetchData();
  }, [serviceId]);

  const totalAmount = service ? service.pricePerHead * form.guestCount : 0;
  const surplusEstimate = Math.round(form.guestCount * 0.15); // 15% surplus estimate

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        service: serviceId,
        ...form,
        estimatedSurplusFood: form.donationConsent ? surplusEstimate : 0,
      };
      await axios.post('/api/bookings', payload);
      toast.success('🎉 Booking confirmed successfully!');
      if (form.donationConsent) toast.success('🌱 NGO donation scheduled!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
    setLoading(false);
  };

  if (!service) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="page booking-page">
      <div className="booking-container">
        <div className="booking-steps">
          {['Event Details', 'Review & Donate', 'Confirm'].map((s, i) => (
            <div key={i} className={`booking-step ${step >= i + 1 ? 'active' : ''}`}>
              <span className="step-num">{i + 1}</span>
              <span className="step-label">{s}</span>
            </div>
          ))}
        </div>

        <div className="booking-layout">
          {/* Main Form */}
          <div className="booking-form-section">
            {step === 1 && (
              <div className="form-section">
                <h2>📅 Event Details</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Event Date *</label>
                    <input type="date" value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })} min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="form-group">
                    <label>Event Type *</label>
                    <select value={form.eventType} onChange={e => setForm({ ...form, eventType: e.target.value })}>
                      <option value="">Select type</option>
                      <option>Wedding</option><option>Birthday Party</option>
                      <option>Corporate Event</option><option>Social Gathering</option>
                      <option>Festival</option><option>Private Dining</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Number of Guests *</label>
                    <input type="number" value={form.guestCount} onChange={e => setForm({ ...form, guestCount: Number(e.target.value) })} min={service.minGuests || 10} />
                  </div>
                  <div className="form-group full">
                    <label>Venue Address *</label>
                    <input type="text" value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} placeholder="Full address including landmark" />
                  </div>
                  <div className="form-group full">
                    <label>Special Requests</label>
                    <textarea value={form.specialRequests} onChange={e => setForm({ ...form, specialRequests: e.target.value })} placeholder="Dietary restrictions, allergies, special setup requirements..." rows={3} />
                  </div>
                </div>
                <button className="btn-primary btn-next" onClick={() => setStep(2)} disabled={!form.eventDate || !form.eventType || !form.venue}>
                  Next: Review & Donate →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="form-section">
                <h2>🌱 Food Donation Option</h2>
                <div className="donation-opt-in">
                  <div className="donation-opt-header">
                    <h3>Make Your Event Meaningful</h3>
                    <p>Estimated surplus food from your event: <strong>~{surplusEstimate} kg</strong> (~{Math.floor(surplusEstimate / 0.4 / 3)} people fed)</p>
                  </div>

                  <div className={`donation-consent-card ${form.donationConsent ? 'active' : ''}`}>
                    <label className="consent-label">
                      <input
                        type="checkbox"
                        checked={form.donationConsent}
                        onChange={e => setForm({ ...form, donationConsent: e.target.checked })}
                      />
                      <div className="consent-text">
                        <strong>✅ Yes! I want to donate surplus food to an NGO</strong>
                        <p>After my event, leftover food will be collected and distributed to those in need. Free pickup. Zero hassle for me.</p>
                      </div>
                    </label>
                  </div>

                  {form.donationConsent && (
                    <div className="ngo-selection">
                      <h4>Select an NGO Partner</h4>
                      <div className="ngo-cards">
                        {ngos.map(ngo => (
                          <div
                            key={ngo._id}
                            className={`ngo-option-card ${form.donationNgo === ngo._id ? 'selected' : ''}`}
                            onClick={() => setForm({ ...form, donationNgo: ngo._id })}
                          >
                            <div className="ngo-icon">🤝</div>
                            <div>
                              <strong>{ngo.name}</strong>
                              <p>📍 {ngo.city} · Contact: {ngo.contactPerson}</p>
                            </div>
                            {form.donationNgo === ngo._id && <span className="selected-check">✓</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="step-actions">
                  <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn-primary" onClick={() => setStep(3)}>Next: Confirm →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-section">
                <h2>✅ Confirm Booking</h2>
                <div className="booking-summary">
                  <div className="summary-row"><span>Service</span><strong>{service.title}</strong></div>
                  <div className="summary-row"><span>Chef</span><strong>{service.chef?.name}</strong></div>
                  <div className="summary-row"><span>Event Date</span><strong>{new Date(form.eventDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></div>
                  <div className="summary-row"><span>Event Type</span><strong>{form.eventType}</strong></div>
                  <div className="summary-row"><span>Guests</span><strong>{form.guestCount}</strong></div>
                  <div className="summary-row"><span>Venue</span><strong>{form.venue}</strong></div>
                  <div className="summary-row total"><span>Total Amount</span><strong>₹{totalAmount.toLocaleString('en-IN')}</strong></div>
                  {form.donationConsent && (
                    <div className="summary-row donation-row">
                      <span>🌱 Food Donation</span>
                      <strong className="green">Opted In — {surplusEstimate}kg estimated</strong>
                    </div>
                  )}
                </div>
                <div className="step-actions">
                  <button className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn-primary btn-confirm" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Booking...' : '🎉 Confirm Booking'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="booking-sidebar">
            <div className="sidebar-card">
              <h3>{service.title}</h3>
              <p>👨‍🍳 {service.chef?.name}</p>
              <p>📂 {service.category}</p>
              <div className="price-display">
                <span>₹{service.pricePerHead}</span>
                <small>per head</small>
              </div>
              <div className="total-display">
                Total: <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>
              </div>
              {service.includes && (
                <div className="includes-list">
                  <h4>Package Includes:</h4>
                  {service.includes.map((item, i) => <p key={i}>✓ {item}</p>)}
                </div>
              )}
            </div>
            {form.donationConsent && (
              <div className="sidebar-card donation-sidebar-card">
                <h4>🌱 Your Donation Impact</h4>
                <div className="impact-number">{surplusEstimate}<span>kg</span></div>
                <p>of food will be donated</p>
                <div className="impact-people">≈ {Math.floor(surplusEstimate / 0.4 / 3)} people fed</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
