import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ============ LOGIN PAGE ============
export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      if (user.role === 'chef') navigate('/chef-dashboard');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch { toast.error('Invalid email or password'); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>👨‍🍳</h1>
          <h2>Welcome Back</h2>
          <p>Sign in to ChefCaterPro</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required /></div>
          <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required /></div>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <div className="auth-divider"><span>Demo Accounts</span></div>
        <div className="demo-accounts">
          <button onClick={() => setForm({ email: 'customer@demo.com', password: 'demo123' })} className="btn-demo">👤 Customer</button>
          <button onClick={() => setForm({ email: 'chef@demo.com', password: 'demo123' })} className="btn-demo">👨‍🍳 Chef</button>
          <button onClick={() => setForm({ email: 'admin@demo.com', password: 'demo123' })} className="btn-demo">🔑 Admin</button>
        </div>
        <p className="auth-footer">Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

// ============ REGISTER PAGE ============
export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer', phone: '', address: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success('Account created successfully!');
      if (user.role === 'chef') navigate('/chef-dashboard');
      else navigate('/dashboard');
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container wide">
        <div className="auth-header">
          <h1>🎉</h1>
          <h2>Create Account</h2>
          <p>Join ChefCaterPro — Food, Events & Impact</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid-2">
            <div className="form-group"><label>Full Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" required /></div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required /></div>
            <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" required /></div>
            <div className="form-group"><label>Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="10-digit mobile number" /></div>
          </div>
          <div className="form-group">
            <label>Register as</label>
            <div className="role-selector">
              {[{ value: 'customer', label: '👤 Customer', desc: 'Book chefs for events' }, { value: 'chef', label: '👨‍🍳 Chef', desc: 'Offer catering services' }].map(r => (
                <div key={r.value} className={`role-card ${form.role === r.value ? 'selected' : ''}`} onClick={() => setForm({ ...form, role: r.value })}>
                  <strong>{r.label}</strong><p>{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group"><label>Address</label><input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="City, State" /></div>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
};

// ============ MENU PAGE ============
export const MenuPage = () => {
  const [filter, setFilter] = useState('all');
  const menuItems = [
    { name: 'Paneer Tikka', category: 'starter', cuisine: 'North Indian', isVeg: true, pricePerHead: 120, desc: 'Marinated cottage cheese grilled to perfection' },
    { name: 'Chicken Seekh Kebab', category: 'starter', cuisine: 'Mughlai', isVeg: false, pricePerHead: 180, desc: 'Minced chicken with aromatic spices on skewers' },
    { name: 'Dal Makhani', category: 'main-course', cuisine: 'North Indian', isVeg: true, pricePerHead: 95, desc: 'Slow-cooked black lentils in butter and cream' },
    { name: 'Butter Chicken', category: 'main-course', cuisine: 'North Indian', isVeg: false, pricePerHead: 145, desc: 'Tender chicken in rich tomato-butter gravy' },
    { name: 'Dum Biryani', category: 'main-course', cuisine: 'Hyderabadi', isVeg: false, pricePerHead: 165, desc: 'Aromatic long-grain rice cooked with marinated meat' },
    { name: 'Veg Biryani', category: 'main-course', cuisine: 'Hyderabadi', isVeg: true, pricePerHead: 130, desc: 'Fragrant basmati with seasonal vegetables' },
    { name: 'Gulab Jamun', category: 'dessert', cuisine: 'Indian', isVeg: true, pricePerHead: 65, desc: 'Soft milk-solid dumplings in rose-scented syrup' },
    { name: 'Ras Malai', category: 'dessert', cuisine: 'Bengali', isVeg: true, pricePerHead: 75, desc: 'Spongy cheese patties soaked in sweetened milk' },
    { name: 'Pani Puri Counter', category: 'live-counter', cuisine: 'Street Food', isVeg: true, pricePerHead: 85, desc: 'Live interactive pani puri station with multiple flavors' },
    { name: 'Masala Chaas', category: 'beverage', cuisine: 'Indian', isVeg: true, pricePerHead: 35, desc: 'Spiced buttermilk with mint and cumin' },
  ];

  const filtered = filter === 'all' ? menuItems : filter === 'veg' ? menuItems.filter(m => m.isVeg) : filter === 'non-veg' ? menuItems.filter(m => !m.isVeg) : menuItems.filter(m => m.category === filter);
  const categories = ['all', 'veg', 'non-veg', 'starter', 'main-course', 'dessert', 'live-counter', 'beverage'];

  return (
    <div className="page menu-page">
      <div className="page-header"><h1>Our Menu</h1><p>Curated dishes from India's finest chefs</p></div>
      <div className="menu-filters">
        {categories.map(c => <button key={c} className={`filter-btn ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</button>)}
      </div>
      <div className="menu-grid">
        {filtered.map((item, i) => (
          <div className="menu-card" key={i}>
            <div className="menu-card-top">
              <span className={`veg-indicator ${item.isVeg ? 'veg' : 'nonveg'}`}>{item.isVeg ? '🟢' : '🔴'}</span>
              <span className="menu-category">{item.category}</span>
            </div>
            <h3>{item.name}</h3>
            <p className="menu-cuisine">🍴 {item.cuisine}</p>
            <p className="menu-desc">{item.desc}</p>
            <div className="menu-price">₹{item.pricePerHead}<small>/head</small></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============ SERVICE DETAIL PAGE ============
export const ServiceDetailPage = () => (
  <div className="page"><div className="page-header"><h1>Service Details</h1><p>Full details coming soon</p></div></div>
);

// ============ DONATIONS PAGE ============
export const DonationsPage = () => (
  <div className="page"><div className="page-header"><h1>🌱 Food Donations</h1><p>Track all donations from your events</p></div>
    <div className="empty-state"><div style={{ fontSize: '4rem' }}>🤝</div><h3>Your Donation History</h3><p>Donations from your catering events will appear here</p></div>
  </div>
);

// ============ ADMIN DASHBOARD ============
export const AdminDashboard = () => (
  <div className="page dashboard-page">
    <div className="dashboard-header"><h1>Admin Dashboard 🔑</h1><p>Platform overview and management</p></div>
    <div className="dashboard-stats">
      {[{ icon: '👥', val: '1,245', label: 'Users' }, { icon: '👨‍🍳', val: '52', label: 'Chefs' }, { icon: '📋', val: '3,400', label: 'Bookings' }, { icon: '🌱', val: '142', label: 'Donations' }].map((s, i) => (
        <div className="stat-card" key={i}><div className="stat-icon">{s.icon}</div><div className="stat-info"><strong>{s.val}</strong><span>{s.label}</span></div></div>
      ))}
    </div>
    <div className="admin-sections">
      {['Manage Users', 'Manage Services', 'Manage NGOs', 'Verify Chefs', 'View All Bookings', 'Donation Reports'].map((s, i) => (
        <div className="admin-action-card" key={i}><h3>{s}</h3><button className="btn-primary">Open</button></div>
      ))}
    </div>
  </div>
);
