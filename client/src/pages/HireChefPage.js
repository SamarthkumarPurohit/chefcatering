import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HireChefPage = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: '', cuisine: '', maxRate: '' });

  useEffect(() => { fetchChefs(); }, []);

  const fetchChefs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.cuisine) params.append('cuisine', filters.cuisine);
      if (filters.maxRate) params.append('maxRate', filters.maxRate);
      const { data } = await axios.get(`/api/chef-hire/chefs?${params}`);
      setChefs(data);
    } catch {
      setChefs(mockChefs);
    }
    setLoading(false);
  };

  const mockChefs = [
    {
      _id: 'cp1',
      chef: { name: 'Chef Arjun Kapoor', phone: '9876543210' },
      city: 'Mumbai',
      experience: 8,
      specializations: ['North Indian', 'Continental', 'Mughlai'],
      personalHireRates: { perHour: 600, perDay: 2800, halfDay: 1600 },
      averageRating: 4.9,
      totalReviews: 34,
      totalPersonalHires: 78,
      bio: '8 years of experience cooking for elite families and private events in Mumbai. Specializes in authentic North Indian cuisine and modern Continental dishes.',
      availableDays: ['Mon','Tue','Wed','Thu','Fri','Sat'],
      offersMealPrep: true,
      offersCookingClasses: true,
      offersGroceryShopping: true,
      travelRadius: 20,
    },
    {
      _id: 'cp2',
      chef: { name: 'Chef Meera Shah', phone: '9876543211' },
      city: 'Mumbai',
      experience: 5,
      specializations: ['South Indian', 'Jain', 'Healthy Cooking'],
      personalHireRates: { perHour: 450, perDay: 2000, halfDay: 1200 },
      averageRating: 4.7,
      totalReviews: 21,
      totalPersonalHires: 45,
      bio: 'Health-focused chef specializing in diabetic-friendly, Jain, and nutritious South Indian cooking for families.',
      availableDays: ['Mon','Tue','Wed','Thu','Fri'],
      offersMealPrep: true,
      offersCookingClasses: false,
      offersGroceryShopping: true,
      travelRadius: 15,
    },
    {
      _id: 'cp3',
      chef: { name: 'Chef Ravi Kumar', phone: '9876543212' },
      city: 'Pune',
      experience: 6,
      specializations: ['Italian', 'Chinese', 'Fusion', 'Baking'],
      personalHireRates: { perHour: 500, perDay: 2200, halfDay: 1300 },
      averageRating: 4.8,
      totalReviews: 28,
      totalPersonalHires: 60,
      bio: 'International cuisine specialist trained in Bangkok and Singapore. Perfect for special occasions, date nights, and cooking classes.',
      availableDays: ['Tue','Wed','Thu','Fri','Sat','Sun'],
      offersMealPrep: true,
      offersCookingClasses: true,
      offersGroceryShopping: false,
      travelRadius: 25,
    },
    {
      _id: 'cp4',
      chef: { name: 'Chef Priya Nair', phone: '9876543213' },
      city: 'Mumbai',
      experience: 10,
      specializations: ['Kerala', 'Tamil', 'Seafood', 'Vegetarian'],
      personalHireRates: { perHour: 700, perDay: 3200, halfDay: 1800 },
      averageRating: 5.0,
      totalReviews: 42,
      totalPersonalHires: 95,
      bio: '10 years cooking for high-profile families. Expert in authentic Kerala cuisine and fresh seafood preparations. Available for live-in service.',
      availableDays: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      offersMealPrep: true,
      offersCookingClasses: true,
      offersGroceryShopping: true,
      offersLiveInService: true,
      travelRadius: 30,
    },
  ];

  const hireTypes = [
    { icon: '🏠', label: 'Daily Cooking', key: 'daily-cooking', desc: 'Chef cooks for your family daily' },
    { icon: '📦', label: 'Meal Prep', key: 'weekly-meal-prep', desc: 'Weekly meal preparation at home' },
    { icon: '🎉', label: 'Private Party', key: 'private-party', desc: 'Cook for your home party' },
    { icon: '🌙', label: 'Live-In Chef', key: 'live-in-chef', desc: 'Multi-day stay-in service' },
    { icon: '👨‍🏫', label: 'Cooking Class', key: 'cooking-class', desc: 'Learn to cook at home' },
    { icon: '💑', label: 'Special Occasion', key: 'special-occasion', desc: 'Anniversary / birthday dinner' },
  ];

  return (
    <div className="page hire-chef-page">
      <div className="hire-hero">
        <div className="hire-hero-content">
          <div className="hero-badge">👨‍🍳 Personal Chef Service</div>
          <h1>Hire a Personal Chef<br /><span>For Your Home</span></h1>
          <p>Book a professional chef to cook at your home — daily meals, special occasions, cooking classes, and more.</p>
          <div className="hire-type-pills">
            {hireTypes.map(t => (
              <Link to={`/hire-chef/book?type=${t.key}`} key={t.key} className="hire-type-pill">
                <span>{t.icon}</span> {t.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="hire-hero-stats">
          <div className="hire-stat"><strong>50+</strong><span>Personal Chefs</span></div>
          <div className="hire-stat"><strong>₹450</strong><span>Starting/hour</span></div>
          <div className="hire-stat"><strong>4.8★</strong><span>Avg Rating</span></div>
          <div className="hire-stat"><strong>500+</strong><span>Home Cooked</span></div>
        </div>
      </div>

      {/* Why Hire */}
      <div className="why-hire-section">
        <div className="section-header">
          <h2>Why Hire a Personal Chef?</h2>
        </div>
        <div className="why-grid">
          {[
            { icon: '🥗', title: 'Healthy Home Food', desc: 'Fresh, nutritious meals cooked in your kitchen with ingredients you trust' },
            { icon: '⏰', title: 'Save Time', desc: 'Spend time with family while a chef handles all cooking and cleanup' },
            { icon: '🎨', title: 'Custom Menus', desc: 'Fully personalized menus based on your taste, diet, and health goals' },
            { icon: '💰', title: 'Cost Effective', desc: 'Cheaper than restaurants for families — starting at just ₹450/hour' },
            { icon: '🌿', title: 'Dietary Needs', desc: 'Jain, vegan, diabetic, keto — chefs adapt to any dietary requirement' },
            { icon: '📚', title: 'Learn & Cook', desc: 'Book cooking class sessions and learn professional techniques at home' },
          ].map((w, i) => (
            <div className="why-card" key={i}>
              <div className="why-icon">{w.icon}</div>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="section-header" style={{ textAlign: 'center', margin: '0 0 24px' }}>
        <h2>Available Personal Chefs</h2>
        <p>Browse and hire from our verified professional chefs</p>
      </div>

      <div className="filters-bar">
        <input className="filter-input" placeholder="🏙️ City (e.g. Mumbai)" value={filters.city}
          onChange={e => setFilters({ ...filters, city: e.target.value })} />
        <input className="filter-input" placeholder="🍛 Cuisine (e.g. Italian)" value={filters.cuisine}
          onChange={e => setFilters({ ...filters, cuisine: e.target.value })} />
        <input className="filter-input short" type="number" placeholder="Max ₹/day" value={filters.maxRate}
          onChange={e => setFilters({ ...filters, maxRate: e.target.value })} />
        <button className="btn-filter" onClick={fetchChefs}>Search</button>
      </div>

      {loading ? (
        <div className="loading-spinner">Finding chefs...</div>
      ) : (
        <div className="chef-cards-grid">
          {chefs.map(profile => (
            <div className="chef-hire-card" key={profile._id}>
              <div className="chef-hire-card-top">
                <div className="chef-avatar">
                  {profile.chef?.name?.charAt(0)}
                </div>
                <div className="chef-basic-info">
                  <h3>{profile.chef?.name}</h3>
                  <p className="chef-city">📍 {profile.city} · {profile.experience} yrs exp</p>
                  <div className="chef-rating">
                    ⭐ {profile.averageRating}
                    <small>({profile.totalReviews} reviews · {profile.totalPersonalHires} hires)</small>
                  </div>
                </div>
                {profile.offersLiveInService && (
                  <span className="live-in-badge">🌙 Live-In</span>
                )}
              </div>

              <p className="chef-bio">{profile.bio}</p>

              <div className="chef-specializations">
                {profile.specializations?.map(s => (
                  <span key={s} className="spec-tag">{s}</span>
                ))}
              </div>

              <div className="chef-services">
                {profile.offersMealPrep && <span className="service-dot green">📦 Meal Prep</span>}
                {profile.offersCookingClasses && <span className="service-dot blue">📚 Classes</span>}
                {profile.offersGroceryShopping && <span className="service-dot orange">🛒 Grocery</span>}
              </div>

              <div className="chef-availability">
                <span>📅 {profile.availableDays?.join(', ')}</span>
                <span>🚗 {profile.travelRadius}km radius</span>
              </div>

              <div className="chef-rates">
                <div className="rate-box">
                  <strong>₹{profile.personalHireRates?.perHour}</strong>
                  <span>/hour</span>
                </div>
                <div className="rate-box highlight">
                  <strong>₹{profile.personalHireRates?.perDay}</strong>
                  <span>/day</span>
                </div>
                <div className="rate-box">
                  <strong>₹{profile.personalHireRates?.halfDay}</strong>
                  <span>/half-day</span>
                </div>
              </div>

              <div className="chef-card-actions">
                <Link to={`/hire-chef/profile/${profile.chef?._id || profile._id}`} className="btn-view">
                  View Profile
                </Link>
                <Link to={`/hire-chef/book/${profile.chef?._id || profile._id}`} className="btn-book">
                  Hire Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HireChefPage;