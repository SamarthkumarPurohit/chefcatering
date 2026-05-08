const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['wedding', 'birthday', 'corporate', 'social', 'private-dining', 'festival', 'other'],
    required: true
  },
  pricePerHead: { type: Number, required: true },
  minGuests: { type: Number, default: 10 },
  maxGuests: { type: Number, default: 500 },
  cuisineType: [{ type: String }],
  images: [{ type: String }],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  availableDates: [{ type: Date }],
  includes: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);
