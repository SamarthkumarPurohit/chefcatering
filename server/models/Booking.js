const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  eventDate: { type: Date, required: true },
  eventType: { type: String, required: true },
  guestCount: { type: Number, required: true },
  venue: { type: String, required: true },
  specialRequests: { type: String, default: '' },
  menuItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }],
  totalAmount: { type: Number, required: true },
  advanceAmount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partial', 'paid'],
    default: 'unpaid'
  },
  // Food donation fields
  estimatedSurplusFood: { type: Number, default: 0 }, // in kg
  donationConsent: { type: Boolean, default: false },
  donationNgo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
  donationStatus: {
    type: String,
    enum: ['not-applicable', 'pending', 'scheduled', 'completed'],
    default: 'not-applicable'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
