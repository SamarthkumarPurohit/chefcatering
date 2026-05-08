const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
  foodItems: [
    {
      name: { type: String },
      quantity: { type: String },
      quantityKg: { type: Number }
    }
  ],
  totalQuantityKg: { type: Number, required: true },
  pickupAddress: { type: String, required: true },
  pickupDateTime: { type: Date, required: true },
  status: {
    type: String,
    enum: ['scheduled', 'picked-up', 'delivered', 'cancelled'],
    default: 'scheduled'
  },
  ngoFeedback: { type: String, default: '' },
  impactPeople: { type: Number, default: 0 }, // estimated people fed
  createdAt: { type: Date, default: Date.now }
});

// Auto calculate impact
donationSchema.pre('save', function (next) {
  // ~0.4 kg per meal, avg 3 meals per person
  this.impactPeople = Math.floor(this.totalQuantityKg / 0.4 / 3);
  next();
});

module.exports = mongoose.model('Donation', donationSchema);
