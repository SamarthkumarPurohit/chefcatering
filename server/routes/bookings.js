const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { protect, authorize } = require('../middleware/auth');

// @GET /api/bookings - Get user bookings
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'customer') query.customer = req.user._id;
    else if (req.user.role === 'chef') query.chef = req.user._id;

    const bookings = await Booking.find(query)
      .populate('customer', 'name email phone')
      .populate('chef', 'name email phone')
      .populate('service', 'title category')
      .populate('donationNgo', 'name phone')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/bookings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('chef', 'name email phone')
      .populate('service')
      .populate('donationNgo');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @POST /api/bookings - Customer creates booking
router.post('/', protect, authorize('customer', 'admin'), async (req, res) => {
  try {
    const service = await Service.findById(req.body.service);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    const totalAmount = service.pricePerHead * req.body.guestCount;
    const booking = await Booking.create({
      ...req.body,
      customer: req.user._id,
      chef: service.chef,
      totalAmount
    });
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @PUT /api/bookings/:id/status - Update booking status (chef/admin)
router.put('/:id/status', protect, authorize('chef', 'admin'), async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @PUT /api/bookings/:id/donation-consent - Customer opts in for donation
router.put('/:id/donation-consent', protect, async (req, res) => {
  try {
    const { donationConsent, donationNgo, estimatedSurplusFood } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, customer: req.user._id },
      {
        donationConsent,
        donationNgo,
        estimatedSurplusFood,
        donationStatus: donationConsent ? 'pending' : 'not-applicable'
      },
      { new: true }
    ).populate('donationNgo');
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/bookings/admin/all - Admin view all
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('customer', 'name email')
      .populate('chef', 'name email')
      .populate('service', 'title')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
