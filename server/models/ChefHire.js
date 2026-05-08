const mongoose = require('mongoose');

const chefHireSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Hire type
  hireType: {
    type: String,
    enum: [
      'daily-cooking',      // Cook daily meals at home
      'weekly-meal-prep',   // Prep meals for the week
      'private-party',      // Cook for a private party at home
      'live-in-chef',       // Stay-in chef for multi-days
      'cooking-class',      // Teach cooking at home
      'special-occasion',   // Anniversary/birthday dinner at home
    ],
    required: true
  },

  // Schedule
  startDate: { type: Date, required: true },
  endDate:   { type: Date, required: true },
  startTime: { type: String, required: true },  // e.g. "09:00"
  endTime:   { type: String, required: true },  // e.g. "14:00"
  daysOfWeek: [{ type: String, enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] }],

  // Location
  address:  { type: String, required: true },
  city:     { type: String, required: true },
  landmark: { type: String, default: '' },

  // Requirements
  numberOfPeople:  { type: Number, required: true, min: 1 },
  cuisinePreference: [{ type: String }],
  dietaryRequirements: [{ type: String }],  // veg, vegan, jain, diabetic, etc.
  specialInstructions: { type: String, default: '' },
  providesGroceries: { type: Boolean, default: false }, // customer provides ingredients?
  hasKitchenEquipment: { type: Boolean, default: true },

  // Pricing
  rateType: { type: String, enum: ['per-hour', 'per-day', 'fixed'], default: 'per-day' },
  agreedRate: { type: Number, required: true },   // rate in ₹
  totalDays:  { type: Number, default: 1 },
  totalHours: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  advancePaid: { type: Number, default: 0 },

  // Status flow
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'ongoing', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid'],
    default: 'unpaid'
  },

  // Chef response
  chefNote: { type: String, default: '' },
  rejectionReason: { type: String, default: '' },

  // Rating after completion
  customerRating: { type: Number, min: 1, max: 5 },
  customerReview: { type: String, default: '' },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChefHire', chefHireSchema);