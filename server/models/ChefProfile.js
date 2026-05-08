const mongoose = require('mongoose');

const chefProfileSchema = new mongoose.Schema({
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  // Professional info
  specializations: [{ type: String }],        // e.g. ['North Indian', 'Baking', 'Italian']
  experience: { type: Number, default: 1 },   // years
  bio: { type: String, default: '' },
  languages: [{ type: String }],              // Hindi, English, Marathi etc.
  certifications: [{ type: String }],

  // Personal hire availability & rates
  availableForPersonalHire: { type: Boolean, default: true },
  personalHireRates: {
    perHour: { type: Number, default: 500 },
    perDay:  { type: Number, default: 2500 },
    halfDay: { type: Number, default: 1500 },
  },
  minimumHireHours: { type: Number, default: 3 },
  travelRadius:     { type: Number, default: 15 }, // km

  // Availability slots
  availableDays: [{ type: String, enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] }],
  availableFrom: { type: String, default: '08:00' },
  availableTo:   { type: String, default: '20:00' },

  // What they offer for personal hire
  offersGroceryShopping: { type: Boolean, default: false },
  offersMealPrep:        { type: Boolean, default: true },
  offersCookingClasses:  { type: Boolean, default: false },
  offersLiveInService:   { type: Boolean, default: false },

  // Stats
  totalPersonalHires: { type: Number, default: 0 },
  averageRating:      { type: Number, default: 0 },
  totalReviews:       { type: Number, default: 0 },

  // Location
  city:    { type: String },
  pincode: { type: String },

  profileComplete: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChefProfile', chefProfileSchema);