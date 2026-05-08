import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const HireBookingPage = () => {
  const { chefId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [chef, setChef] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    hireType: searchParams.get('type') || 'daily-cooking',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '14:00',
    daysOfWeek: [],
    address: '',
    city: '',
    landmark: '',
    numberOfPeople: 4,
    cuisinePreference: [],
    dietaryRequirements: [],
    specialInstructions: '',
    providesGroceries: false,
    hasKitchenEquipment: true,
    rateType: 'per-day',
    agreedRate: 0,
    totalDays: 1,
    totalHours: 0,
  });

  const mockChef = {
    _id: chefId,
    name: 'Chef Arjun Kapoor',
    city: 'Mumbai',
    experience: 8,
    specializations: ['North Indian', 'Continental', 'Mughlai'],
    personalHireRates: { perHour: 600, perDay: 2800, halfDay: 1600 },
    averageRating: 4.9,
    travelRadius: 20,
    offersGroceryShopping: true,
    offersCookingClasses: true,
  };

  useEffect(() => {
    axios.get(`/api/chef-hire/chefs/${chefId}`)
      .then(r => setChef(r.data.profile))
      .catch(() => setChef(mockChef));
  }, [chefId]);

  useEffect(() => {
    if (chef) {
      const rate = form.rateType === 'per-hour'
        ? chef.personalHireRates?.perHour
        : chef.personalHireRates?.perDay;
      setForm(f => ({ ...f, agreedRate: rate || 0 }));
    }
  }, [chef, form.rateType]);

  const hireTypes = [
    { key: 'daily-cooking', label: '🏠 Daily Cooking', desc: 'Cook daily meals for your family' },
    { key: 'weekly-meal-prep', label: '📦 Meal Prep', desc: 'Prepare meals for the week' },
    { key: 'private-party', label: '🎉 Private Party', desc: 'Cook for a home gathering' },
    { key: 'live-in-chef', label: '🌙 Live-In Chef', desc: 'Multi-day at-home service' },
    { key: 'cooking-class', label: '📚 Cooking Class', desc: 'Learn to cook at home' },
    { key: 'special-occasion', label: '💑 Special Occasion', desc: 'Anniversary / birthday dinner' },
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const cuisines = ['North Indian', 'South Indian', 'Continental', 'Chinese', 'Italian', 'Mughlai', 'Gujarati', 'Jain'];
  const dietOptions = ['Vegetarian', 'Vegan', 'Jain', 'Diabetic-Friendly', 'Keto', 'Gluten-Free', 'Low-Calorie'];

  const toggleArray = (arr, val) =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  const calcTotal = () => {
    if (form.rateType === 'per-hour') return (form.agreedRate || 0) * (form.totalHours || 1);
    return (form.agreedRate || 0) * (form.totalDays || 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post('/api/chef-hire/request', { ...form, chefId });
      toast.success('🎉 Hire request sent! Chef will respond within 2 hours.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request failed');
    }
    setLoading(false);
  };

  if (!chef) return <div className="loading-spinner">Loading chef details...</div>;

  return (
    <div className="page booking-page">
      <div className="booking-container">
        {/* Steps */}
        <div className="booking-steps">
          {['Hire Type', 'Schedule & Location', 'Confirm & Send'].map((s, i) => (
            <div key={i} className={`booking-step ${step >= i + 1 ? 'active' : ''}`}>
              <span className="step-num">{i + 1}</span>
              <span className="step-label">{s}</span>
            </div>
          ))}
        </div>

        <div className="booking-layout">
          <div className="booking-form-section">

            {/* STEP 1: Hire Type */}
            {step === 1 && (
              <div className="form-section">
                <h2>👨‍🍳 What do you need?</h2>
                <div className="hire-type-grid">
                  {hireTypes.map(t => (
                    <div
                      key={t.key}
                      className={`hire-type-card ${form.hireType === t.key ? 'selected' : ''}`}
                      onClick={() => setForm({ ...form, hireType: t.key })}
                    >
                      <div className="ht-icon">{t.label.split(' ')[0]}</div>
                      <strong>{t.label.split(' ').slice(1).join(' ')}</strong>
                      <p>{t.desc}</p>
                    </div>
                  ))}
                </div>

                <h3 style={{ marginTop: 28, marginBottom: 16 }}>🍛 Cuisine Preferences</h3>
                <div className="checkbox-grid">
                  {cuisines.map(c => (
                    <label key={c} className={`check-pill ${form.cuisinePreference.includes(c) ? 'checked' : ''}`}>
                      <input type="checkbox" checked={form.cuisinePreference.includes(c)}
                        onChange={() => setForm({ ...form, cuisinePreference: toggleArray(form.cuisinePreference, c) })} />
                      {c}
                    </label>
                  ))}
                </div>

                <h3 style={{ marginTop: 24, marginBottom: 16 }}>🥗 Dietary Requirements</h3>
                <div className="checkbox-grid">
                  {dietOptions.map(d => (
                    <label key={d} className={`check-pill ${form.dietaryRequirements.includes(d) ? 'checked' : ''}`}>
                      <input type="checkbox" checked={form.dietaryRequirements.includes(d)}
                        onChange={() => setForm({ ...form, dietaryRequirements: toggleArray(form.dietaryRequirements, d) })} />
                      {d}
                    </label>
                  ))}
                </div>

                <button className="btn-primary btn-next" onClick={() => setStep(2)}>
                  Next: Schedule →
                </button>
              </div>
            )}

            {/* STEP 2: Schedule & Location */}
            {step === 2 && (
              <div className="form-section">
                <h2>📅 Schedule & Location</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input type="date" value={form.startDate}
                      onChange={e => setForm({ ...form, startDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="form-group">
                    <label>End Date *</label>
                    <input type="date" value={form.endDate}
                      onChange={e => setForm({ ...form, endDate: e.target.value })}
                      min={form.startDate} />
                  </div>
                  <div className="form-group">
                    <label>Start Time *</label>
                    <input type="time" value={form.startTime}
                      onChange={e => setForm({ ...form, startTime: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>End Time *</label>
                    <input type="time" value={form.endTime}
                      onChange={e => setForm({ ...form, endTime: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Number of People *</label>
                    <input type="number" value={form.numberOfPeople} min={1} max={50}
                      onChange={e => setForm({ ...form, numberOfPeople: Number(e.target.value) })} />
                  </div>
                  <div className="form-group">
                    <label>Billing Type</label>
                    <select value={form.rateType} onChange={e => setForm({ ...form, rateType: e.target.value })}>
                      <option value="per-day">Per Day (₹{chef.personalHireRates?.perDay})</option>
                      <option value="per-hour">Per Hour (₹{chef.personalHireRates?.perHour})</option>
                      <option value="fixed">Fixed Price</option>
                    </select>
                  </div>
                  {form.rateType === 'per-day' && (
                    <div className="form-group">
                      <label>Total Days</label>
                      <input type="number" value={form.totalDays} min={1}
                        onChange={e => setForm({ ...form, totalDays: Number(e.target.value) })} />
                    </div>
                  )}
                  {form.rateType === 'per-hour' && (
                    <div className="form-group">
                      <label>Total Hours</label>
                      <input type="number" value={form.totalHours} min={1}
                        onChange={e => setForm({ ...form, totalHours: Number(e.target.value) })} />
                    </div>
                  )}
                  <div className="form-group full">
                    <label>Home Address *</label>
                    <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                      placeholder="Full address where chef should come" />
                  </div>
                  <div className="form-group">
                    <label>City *</label>
                    <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Mumbai" />
                  </div>
                  <div className="form-group">
                    <label>Landmark (Optional)</label>
                    <input value={form.landmark} onChange={e => setForm({ ...form, landmark: e.target.value })}
                      placeholder="e.g. Near Juhu Beach" />
                  </div>
                </div>

                <h3 style={{ marginTop: 24, marginBottom: 12 }}>📅 Preferred Days of Week</h3>
                <div className="days-selector">
                  {weekDays.map(d => (
                    <button key={d} type="button"
                      className={`day-btn ${form.daysOfWeek.includes(d) ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, daysOfWeek: toggleArray(form.daysOfWeek, d) })}>
                      {d}
                    </button>
                  ))}
                </div>

                <div className="hire-options-row">
                  <label className="toggle-option">
                    <input type="checkbox" checked={form.providesGroceries}
                      onChange={e => setForm({ ...form, providesGroceries: e.target.checked })} />
                    <span>🛒 I will provide groceries & ingredients</span>
                  </label>
                  <label className="toggle-option">
                    <input type="checkbox" checked={form.hasKitchenEquipment}
                      onChange={e => setForm({ ...form, hasKitchenEquipment: e.target.checked })} />
                    <span>🍳 My kitchen has all equipment</span>
                  </label>
                </div>

                <div className="form-group" style={{ marginTop: 20 }}>
                  <label>Special Instructions</label>
                  <textarea value={form.specialInstructions}
                    onChange={e => setForm({ ...form, specialInstructions: e.target.value })}
                    placeholder="Any special requests, allergies, cooking style preferences..."
                    rows={3} />
                </div>

                <div className="step-actions">
                  <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn-primary" onClick={() => setStep(3)}
                    disabled={!form.startDate || !form.address || !form.city}>
                    Next: Confirm →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Confirm */}
            {step === 3 && (
              <div className="form-section">
                <h2>✅ Confirm Hire Request</h2>
                <div className="booking-summary">
                  <div className="summary-row"><span>Hire Type</span><strong>{hireTypes.find(t => t.key === form.hireType)?.label}</strong></div>
                  <div className="summary-row"><span>Chef</span><strong>{chef.chef?.name || mockChef.name}</strong></div>
                  <div className="summary-row"><span>Start Date</span><strong>{form.startDate}</strong></div>
                  <div className="summary-row"><span>End Date</span><strong>{form.endDate}</strong></div>
                  <div className="summary-row"><span>Time</span><strong>{form.startTime} – {form.endTime}</strong></div>
                  <div className="summary-row"><span>Address</span><strong>{form.address}, {form.city}</strong></div>
                  <div className="summary-row"><span>People</span><strong>{form.numberOfPeople}</strong></div>
                  {form.cuisinePreference.length > 0 && (
                    <div className="summary-row"><span>Cuisines</span><strong>{form.cuisinePreference.join(', ')}</strong></div>
                  )}
                  {form.dietaryRequirements.length > 0 && (
                    <div className="summary-row"><span>Dietary</span><strong>{form.dietaryRequirements.join(', ')}</strong></div>
                  )}
                  <div className="summary-row"><span>Rate</span>
                    <strong>₹{form.agreedRate} {form.rateType === 'per-day' ? '/day' : form.rateType === 'per-hour' ? '/hour' : ' fixed'}</strong>
                  </div>
                  <div className="summary-row total"><span>Estimated Total</span><strong>₹{calcTotal().toLocaleString('en-IN')}</strong></div>
                </div>

                <div className="hire-notice">
                  <p>📱 The chef will review your request and respond within <strong>2 hours</strong>.</p>
                  <p>💳 Payment is collected only <strong>after the chef accepts</strong> your request.</p>
                  <p>❌ You can cancel the request <strong>at no charge</strong> before acceptance.</p>
                </div>

                <div className="step-actions">
                  <button className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn-primary btn-confirm" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Sending...' : '📨 Send Hire Request'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="booking-sidebar">
            <div className="sidebar-card">
              <div className="chef-avatar large">{(chef.chef?.name || mockChef.name)?.charAt(0)}</div>
              <h3 style={{ marginTop: 12 }}>{chef.chef?.name || mockChef.name}</h3>
              <p>📍 {chef.city || mockChef.city}</p>
              <p>⭐ {chef.averageRating || mockChef.averageRating} · {chef.experience || mockChef.experience} yrs</p>
              <div className="rate-summary">
                <div><span>Per Hour</span><strong>₹{(chef.personalHireRates || mockChef.personalHireRates).perHour}</strong></div>
                <div><span>Per Day</span><strong>₹{(chef.personalHireRates || mockChef.personalHireRates).perDay}</strong></div>
              </div>
            </div>

            {calcTotal() > 0 && (
              <div className="sidebar-card">
                <h4>💰 Estimated Cost</h4>
                <div className="price-display">
                  <span>₹{calcTotal().toLocaleString('en-IN')}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>
                  {form.rateType === 'per-day' ? `₹${form.agreedRate} × ${form.totalDays} day(s)` :
                   form.rateType === 'per-hour' ? `₹${form.agreedRate} × ${form.totalHours} hour(s)` : 'Fixed price'}
                </p>
                <p style={{ color: 'var(--secondary)', fontSize: '.82rem', marginTop: 8 }}>
                  ✅ Pay only after chef accepts
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HireBookingPage;