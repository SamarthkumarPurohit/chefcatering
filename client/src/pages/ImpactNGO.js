// ImpactPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const ImpactPage = () => {
  const [stats, setStats] = useState({ totalDonations: 142, totalFoodKg: 5230, totalPeopleFed: 13075 });
  useEffect(() => { axios.get('/api/donations/stats').then(r => setStats(r.data)).catch(() => {}); }, []);

  const milestones = [
    { icon: '🍱', value: `${stats.totalFoodKg}kg`, label: 'Food Donated', color: '#10b981' },
    { icon: '👥', value: stats.totalPeopleFed?.toLocaleString() || '13,075', label: 'People Fed', color: '#3b82f6' },
    { icon: '🤝', value: stats.totalDonations || 142, label: 'Donations Made', color: '#f59e0b' },
    { icon: '🏢', value: '15', label: 'NGO Partners', color: '#8b5cf6' },
    { icon: '🌆', value: '8', label: 'Cities Covered', color: '#ef4444' },
    { icon: '🎉', value: '1,200+', label: 'Events Hosted', color: '#06b6d4' },
  ];

  return (
    <div className="page impact-page">
      <div className="impact-hero">
        <h1>🌍 Our Collective Food Impact</h1>
        <p>Every event catered is an opportunity to fight hunger. Here's what we've achieved together.</p>
      </div>
      <div className="impact-stats-grid">
        {milestones.map((m, i) => (
          <div className="impact-stat-card" key={i} style={{ borderTop: `4px solid ${m.color}` }}>
            <div className="impact-stat-icon">{m.icon}</div>
            <div className="impact-stat-value" style={{ color: m.color }}>{m.value}</div>
            <div className="impact-stat-label">{m.label}</div>
          </div>
        ))}
      </div>
      <div className="impact-timeline">
        <h2>How It Works — The Donation Flow</h2>
        <div className="timeline">
          {[
            { icon: '🍽️', title: 'Event Ends', desc: 'Your catered event concludes with amazing food and memories.' },
            { icon: '📦', title: 'Food Packed', desc: 'Our chef team carefully packs all hygienic surplus food.' },
            { icon: '📞', title: 'NGO Notified', desc: 'Partner NGO is alerted with quantity and pickup location.' },
            { icon: '🚚', title: 'Food Picked Up', desc: 'NGO volunteers arrive within 2 hours for collection.' },
            { icon: '😊', title: 'People Fed', desc: 'Food reaches underprivileged communities the same evening.' },
            { icon: '📊', title: 'Impact Reported', desc: 'You receive a certificate with exact impact numbers.' },
          ].map((t, i) => (
            <div className="timeline-item" key={i}>
              <div className="timeline-icon">{t.icon}</div>
              <div className="timeline-content">
                <h4>{t.title}</h4>
                <p>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// NGOsPage.js
export const NGOsPage = () => {
  const [ngos] = useState([
    { _id: 'n1', name: 'Feeding India', city: 'Mumbai', contactPerson: 'Rahul Singh', phone: '9876543210', description: 'India\'s largest food rescue organization, active in 50+ cities.', totalDonationsReceived: 12000, totalPeopleFed: 30000, acceptedFoodTypes: ['Cooked', 'Dry', 'Sweets'], isVerified: true },
    { _id: 'n2', name: 'Robin Hood Army', city: 'Delhi', contactPerson: 'Anita Sharma', phone: '9876541230', description: 'Zero-cost volunteer organization distributing surplus food to less fortunate people.', totalDonationsReceived: 8500, totalPeopleFed: 21250, acceptedFoodTypes: ['Cooked', 'Bakery'], isVerified: true },
    { _id: 'n3', name: 'No Food Waste', city: 'Bangalore', contactPerson: 'Karan Mehta', phone: '9876540980', description: 'Tech-enabled food surplus redistribution platform connecting events with shelters.', totalDonationsReceived: 6200, totalPeopleFed: 15500, acceptedFoodTypes: ['All Types'], isVerified: true },
    { _id: 'n4', name: 'Roti Bank', city: 'Ahmedabad', contactPerson: 'Hetal Patel', phone: '9876549870', description: 'Community-driven initiative providing free meals to daily wage workers and homeless.', totalDonationsReceived: 4100, totalPeopleFed: 10250, acceptedFoodTypes: ['Cooked', 'Dry Rations'], isVerified: true },
  ]);

  return (
    <div className="page ngos-page">
      <div className="page-header">
        <h1>🤝 Our NGO Partners</h1>
        <p>Verified organizations ensuring your surplus food reaches those who need it most</p>
      </div>
      <div className="ngos-grid">
        {ngos.map(ngo => (
          <div className="ngo-card" key={ngo._id}>
            <div className="ngo-card-header">
              <div className="ngo-logo">🏛️</div>
              <div>
                <h3>{ngo.name}</h3>
                <p>📍 {ngo.city} {ngo.isVerified && <span className="verified-badge">✅ Verified</span>}</p>
              </div>
            </div>
            <p className="ngo-desc">{ngo.description}</p>
            <div className="ngo-stats">
              <div><strong>{ngo.totalDonationsReceived}kg</strong><span>Received</span></div>
              <div><strong>{ngo.totalPeopleFed.toLocaleString()}</strong><span>People Fed</span></div>
            </div>
            <div className="ngo-food-types">
              <strong>Accepts:</strong> {ngo.acceptedFoodTypes.join(', ')}
            </div>
            <div className="ngo-contact">📞 {ngo.contactPerson} · {ngo.phone}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default { ImpactPage, NGOsPage };
