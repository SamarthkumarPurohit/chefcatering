import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const [stats, setStats] = useState({ totalDonations: 0, totalFoodKg: 0, totalPeopleFed: 0 });

  useEffect(() => {
    axios.get('/api/donations/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  const categories = [
    { icon: '💍', name: 'Wedding', key: 'wedding' },
    { icon: '🎂', name: 'Birthday', key: 'birthday' },
    { icon: '🏢', name: 'Corporate', key: 'corporate' },
    { icon: '🎉', name: 'Social Events', key: 'social' },
    { icon: '🍽️', name: 'Private Dining', key: 'private-dining' },
    { icon: '🪔', name: 'Festival', key: 'festival' },
  ];

  const testimonials = [
    { name: 'Priya Sharma', event: 'Wedding', text: 'Absolutely amazing food and service! And knowing leftover food went to an NGO made it even more special.', rating: 5 },
    { name: 'Rahul Mehta', event: 'Corporate Event', text: 'Professional, punctual, and the food was outstanding. The NGO donation feature is a brilliant initiative!', rating: 5 },
    { name: 'Anjali Patel', event: 'Birthday Party', text: 'Chef Ravi made our daughter\'s birthday unforgettable. 50kg of leftover food was donated — what a feeling!', rating: 5 },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🌟 Premium Catering & Social Impact</div>
          <h1 className="hero-title">
            Exceptional Food,<br />
            <span className="hero-accent">Exceptional Purpose</span>
          </h1>
          <p className="hero-subtitle">
            Book top chefs for your events. Feast royally. And when the party ends,<br />
            let surplus food nourish those who need it most — through our NGO network.
          </p>
          <div className="hero-actions">
            <Link to="/services" className="btn-primary">Explore Chefs & Services</Link>
            <Link to="/impact" className="btn-secondary">🌱 See Our Impact</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{stats.totalDonations || '120+'}</strong>
              <span>Donations Made</span>
            </div>
            <div className="hero-stat">
              <strong>{stats.totalFoodKg ? `${stats.totalFoodKg}kg` : '4,200kg'}</strong>
              <span>Food Donated</span>
            </div>
            <div className="hero-stat">
              <strong>{stats.totalPeopleFed ? stats.totalPeopleFed.toLocaleString() : '12,000+'}</strong>
              <span>People Fed</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card floating">
            <span className="hero-card-icon">🍛</span>
            <p>200+ Menu Items</p>
          </div>
          <div className="hero-card floating delay-1">
            <span className="hero-card-icon">👨‍🍳</span>
            <p>50+ Expert Chefs</p>
          </div>
          <div className="hero-card floating delay-2">
            <span className="hero-card-icon">🤝</span>
            <p>15 NGO Partners</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-it-works">
        <div className="section-header">
          <h2>How ChefCaterPro Works</h2>
          <p>From booking to impact — in four simple steps</p>
        </div>
        <div className="steps-grid">
          {[
            { step: '01', icon: '🔍', title: 'Browse & Choose', desc: 'Explore our curated list of professional chefs and their catering packages for every event type.' },
            { step: '02', icon: '📋', title: 'Book & Customize', desc: 'Select your menu, set guest count, choose date and venue. Personalize every detail.' },
            { step: '03', icon: '🍽️', title: 'Feast & Celebrate', desc: 'Our chefs arrive, set up, cook fresh, and make your event extraordinary.' },
            { step: '04', icon: '🌱', title: 'Donate Surplus', desc: 'Opt-in to donate leftover food to our verified NGO partners — feeding hundreds with what remains.' },
          ].map(s => (
            <div className="step-card" key={s.step}>
              <div className="step-number">{s.step}</div>
              <div className="step-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="section-header">
          <h2>Event Categories</h2>
          <p>Every celebration deserves a masterchef</p>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <Link to={`/services?category=${cat.key}`} key={cat.key} className="category-card">
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* NGO Donation Feature */}
      <section className="section donation-feature">
        <div className="donation-content">
          <div className="donation-text">
            <div className="feature-badge">🤝 Social Impact Feature</div>
            <h2>Turn Leftovers Into <span>Lives Changed</span></h2>
            <p>
              Every event generates surplus food. Instead of wasting it, ChefCaterPro connects
              your event with verified NGOs who ensure that food reaches the hungry — same day.
            </p>
            <ul className="donation-benefits">
              <li>✅ Verified NGO partners across major cities</li>
              <li>✅ Same-day pickup after your event</li>
              <li>✅ Real-time donation tracking & certificate</li>
              <li>✅ Know exactly how many people you helped feed</li>
              <li>✅ Tax-benefit documentation available</li>
            </ul>
            <Link to="/ngos" className="btn-primary">Meet Our NGO Partners</Link>
          </div>
          <div className="donation-impact-cards">
            <div className="impact-card green">
              <h3>🍱</h3>
              <strong>Zero Waste Policy</strong>
              <p>We ensure no food from your event goes to waste</p>
            </div>
            <div className="impact-card orange">
              <h3>🚚</h3>
              <strong>Free Pickup</strong>
              <p>NGOs handle transportation — no effort from you</p>
            </div>
            <div className="impact-card blue">
              <h3>📊</h3>
              <strong>Impact Report</strong>
              <p>Get a personalized report of your food donation impact</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section testimonials">
        <div className="section-header">
          <h2>What Our Customers Say</h2>
          <p>Real events, real impact, real smiles</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="stars">{'⭐'.repeat(t.rating)}</div>
              <p>"{t.text}"</p>
              <div className="testimonial-author">
                <strong>{t.name}</strong>
                <span>{t.event}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to Make Your Event Extraordinary?</h2>
        <p>Join 1,000+ hosts who have celebrated and given back with ChefCaterPro</p>
        <div className="cta-actions">
          <Link to="/register" className="btn-primary btn-large">Get Started Free</Link>
          <Link to="/services" className="btn-outline btn-large">Browse Services</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
