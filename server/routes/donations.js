const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const Booking = require('../models/Booking');
const NGO = require('../models/NGO');
const { protect, authorize } = require('../middleware/auth');

// @GET /api/donations - Get donations
router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'chef') query.chef = req.user._id;
    else if (req.user.role === 'customer') query.customer = req.user._id;

    const donations = await Donation.find(query)
      .populate('booking', 'eventDate eventType venue')
      .populate('chef', 'name')
      .populate('customer', 'name')
      .populate('ngo', 'name phone address')
      .sort('-createdAt');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/donations/stats - Impact stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await Donation.aggregate([
      { $match: { status: { $in: ['picked-up', 'delivered'] } } },
      {
        $group: {
          _id: null,
          totalDonations: { $sum: 1 },
          totalFoodKg: { $sum: '$totalQuantityKg' },
          totalPeopleFed: { $sum: '$impactPeople' }
        }
      }
    ]);
    res.json(stats[0] || { totalDonations: 0, totalFoodKg: 0, totalPeopleFed: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @POST /api/donations - Create donation from booking
router.post('/', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.body.booking);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (!booking.donationConsent) return res.status(400).json({ message: 'No donation consent for this booking' });

    const donation = await Donation.create({
      ...req.body,
      chef: booking.chef,
      customer: booking.customer,
      ngo: booking.donationNgo
    });

    // Update booking donation status
    await Booking.findByIdAndUpdate(req.body.booking, { donationStatus: 'scheduled' });

    // Update NGO stats
    await NGO.findByIdAndUpdate(booking.donationNgo, {
      $inc: { totalDonationsReceived: req.body.totalQuantityKg }
    });

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @PUT /api/donations/:id/status - Update donation status
router.put('/:id/status', protect, async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, ngoFeedback: req.body.ngoFeedback },
      { new: true }
    );
    if (req.body.status === 'delivered') {
      await Booking.findByIdAndUpdate(donation.booking, { donationStatus: 'completed' });
      await NGO.findByIdAndUpdate(donation.ngo, {
        $inc: { totalPeopleFed: donation.impactPeople }
      });
    }
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
