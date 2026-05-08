import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      const { data } = await axios.get(`/api/services?${params}`);
      setServices(data);
    } catch {
      // Use mock data if API not connected
      setServices(mockServices);
    }
    setLoading(false);
  };

  const mockServices = [
    { _id: '1', title: 'Royal Wedding Package', category: 'wedding', pricePerHead: 1200, rating: 4.9, totalReviews: 45, chef: { name: 'Chef Arjun Kapoor' }, cuisineType: ['North Indian', 'Continental'], minGuests: 100, maxGuests: 500, description: 'Luxurious multi-cuisine wedding catering with live counters, dessert stations and bar setup.' },
    { _id: '2', title: 'Corporate Lunch Box Service', category: 'corporate', pricePerHead: 350, rating: 4.7, totalReviews: 89, chef: { name: 'Chef Meera Shah' }, cuisineType: ['South Indian', 'Jain'], minGuests: 20, maxGuests: 200, description: 'Healthy, hygienic corporate meals with customizable menus and dietary options.' },
    { _id: '3', title: 'Birthday Bash Special', category: 'birthday', pricePerHead: 650, rating: 4.8, totalReviews: 62, chef: { name: 'Chef Ravi Kumar' }, cuisineType: ['Mughlai', 'Chinese'], minGuests: 30, maxGuests: 150, description: 'Vibrant birthday catering with themed setups, custom cake arrangements and party snacks.' },
    { _id: '4', title: 'Festival Feast Package', category: 'festival', pricePerHead: 480, rating: 4.6, totalReviews: 33, chef: { name: 'Chef Priya Nair' }, cuisineType: ['Kerala', 'Tamil'], minGuests: 50, maxGuests: 300, description: 'Traditional festival cuisines with authentic flavors, prepared fresh on-site.' },
    { _id: '5', title: 'Private Fine Dining', category: 'private-dining', pricePerHead: 2500, rating: 5.0, totalReviews: 18, chef: { name: 'Chef Anand Swami' }, cuisineType: ['French', 'Mediterranean'], minGuests: 6, maxGuests: 30, description: 'An intimate private dining experience with custom multi-course meals by a Michelin-trained chef.' },
    { _id: '6', title: 'Social Gathering Special', category: 'social', pricePerHead: 550, rating: 4.5, totalReviews: 71, chef: { name: 'Chef Zara Khan' }, cuisineType: ['Punjabi', 'Chinese', 'Italian'], minGuests: 25, maxGuests: 250, description: 'Crowd-pleasing multi-cuisine spreads for kitty parties, reunions, and get-togethers.' },
  ];

  const categories = ['', 'wedding', 'birthday', 'corporate', 'social', 'private-dining', 'festival', 'other'];

  return (
    <div className="page services-page">
      <div className="page-header">
        <h1>Catering Services</h1>
        <p>Find the perfect chef for your event</p>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <input
          type="text"
          placeholder="🔍 Search chefs, cuisines..."
          value={filters.search}
          onChange={e => setFilters({ ...filters, search: e.target.value })}
          className="filter-input"
        />
        <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} className="filter-select">
          <option value="">All Categories</option>
          {categories.filter(c => c).map(c => (
            <option key={c} value={c}>{c.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
          ))}
        </select>
        <input type="number" placeholder="Min ₹/head" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })} className="filter-input short" />
        <input type="number" placeholder="Max ₹/head" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} className="filter-input short" />
        <button onClick={fetchServices} className="btn-filter">Filter</button>
      </div>

      {loading ? (
        <div className="loading-spinner">Loading services...</div>
      ) : (
        <div className="services-grid">
          {services.map(s => (
            <div className="service-card" key={s._id}>
              <div className="service-card-header">
                <span className="service-category-badge">{s.category}</span>
                <div className="service-rating">⭐ {s.rating} <small>({s.totalReviews})</small></div>
              </div>
              <div className="service-card-body">
                <h3>{s.title}</h3>
                <p className="service-chef">👨‍🍳 {s.chef?.name}</p>
                <p className="service-desc">{s.description}</p>
                <div className="service-tags">
                  {s.cuisineType?.map(c => <span key={c} className="tag">{c}</span>)}
                </div>
                <div className="service-info">
                  <span>👥 {s.minGuests}–{s.maxGuests} guests</span>
                  <span className="service-price">₹{s.pricePerHead}/head</span>
                </div>
              </div>
              <div className="service-card-footer">
                <Link to={`/services/${s._id}`} className="btn-view">View Details</Link>
                <Link to={`/booking/${s._id}`} className="btn-book">Book Now</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
