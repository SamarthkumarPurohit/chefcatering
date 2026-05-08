const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationNumber: { type: String, unique: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  operatingAreas: [{ type: String }],
  acceptedFoodTypes: [{ type: String }],
  capacity: { type: Number, default: 100 }, // kg per pickup
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  logo: { type: String, default: '' },
  description: { type: String },
  totalDonationsReceived: { type: Number, default: 0 },
  totalPeopleFed: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NGO', ngoSchema);
