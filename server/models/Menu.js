const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  category: {
    type: String,
    enum: ['starter', 'main-course', 'dessert', 'beverage', 'snack', 'live-counter'],
    required: true
  },
  cuisine: { type: String },
  pricePerHead: { type: Number, required: true },
  isVeg: { type: Boolean, default: true },
  isJain: { type: Boolean, default: false },
  allergens: [{ type: String }],
  image: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Menu', menuSchema);
