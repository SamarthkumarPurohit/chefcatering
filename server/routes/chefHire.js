const express = require('express');
const router = express.Router();
const ChefHire = require('../models/ChefHire');
const ChefProfile = require('../models/ChefProfile');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// ─────────────────────────────────────────────────────────────
// PUBLIC: Browse available chefs for personal hire
// GET /api/chef-hire/chefs?city=Mumbai&cuisine=Italian
// ─────────────────────────────────────────────────────────────
router.get('/chefs', async (req, res) => {
  try {
    const { city, cuisine, maxRate, hireType } = req.query;

    let profileQuery = { availableForPersonalHire: true };
    if (city) profileQuery.city = { $regex: city, $options: 'i' };
    if (maxRate) profileQuery['personalHireRates.perDay'] = { $lte: Number(maxRate) };
    if (cuisine) profileQuery.specializations = { $in: [new RegExp(cuisine, 'i')] };

    const profiles = await ChefProfile.find(profileQuery)
      .populate('chef', 'name email phone profileImage address')
      .sort({ averageRating: -1 });

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// PUBLIC: Get single chef profile
// GET /api/chef-hire/chefs/:chefId
// ─────────────────────────────────────────────────────────────
router.get('/chefs/:chefId', async (req, res) => {
  try {
    const profile = await ChefProfile.findOne({ chef: req.params.chefId })
      .populate('chef', 'name email phone profileImage address');

    if (!profile) return res.status(404).json({ message: 'Chef profile not found' });

    // Also get their recent reviews from completed hires
    const recentHires = await ChefHire.find({
      chef: req.params.chefId,
      status: 'completed',
      customerRating: { $exists: true }
    })
      .populate('customer', 'name')
      .select('customerRating customerReview hireType createdAt')
      .sort('-createdAt')
      .limit(5);

    res.json({ profile, reviews: recentHires });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// CUSTOMER: Request to hire a chef
// POST /api/chef-hire/request
// ─────────────────────────────────────────────────────────────
router.post('/request', protect, authorize('customer', 'admin'), async (req, res) => {
  try {
    const {
      chefId, hireType, startDate, endDate, startTime, endTime,
      daysOfWeek, address, city, landmark, numberOfPeople,
      cuisinePreference, dietaryRequirements, specialInstructions,
      providesGroceries, hasKitchenEquipment, rateType, agreedRate,
      totalDays, totalHours
    } = req.body;

    // Calculate total amount
    let totalAmount = 0;
    if (rateType === 'per-day')  totalAmount = agreedRate * (totalDays || 1);
    if (rateType === 'per-hour') totalAmount = agreedRate * (totalHours || 1);
    if (rateType === 'fixed')    totalAmount = agreedRate;

    const hire = await ChefHire.create({
      customer: req.user._id,
      chef: chefId,
      hireType, startDate, endDate, startTime, endTime,
      daysOfWeek, address, city, landmark, numberOfPeople,
      cuisinePreference, dietaryRequirements, specialInstructions,
      providesGroceries, hasKitchenEquipment,
      rateType, agreedRate, totalDays, totalHours, totalAmount,
      status: 'pending'
    });

    // Update chef stats
    await ChefProfile.findOneAndUpdate(
      { chef: chefId },
      { $inc: { totalPersonalHires: 0 } } // incremented on completion
    );

    const populated = await ChefHire.findById(hire._id)
      .populate('chef', 'name email phone')
      .populate('customer', 'name email phone');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// CUSTOMER: Get my hire requests
// GET /api/chef-hire/my-hires
// ─────────────────────────────────────────────────────────────
router.get('/my-hires', protect, authorize('customer', 'admin'), async (req, res) => {
  try {
    const hires = await ChefHire.find({ customer: req.user._id })
      .populate('chef', 'name email phone profileImage')
      .sort('-createdAt');
    res.json(hires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// CHEF: Get hire requests sent to me
// GET /api/chef-hire/requests
// ─────────────────────────────────────────────────────────────
router.get('/requests', protect, authorize('chef', 'admin'), async (req, res) => {
  try {
    const hires = await ChefHire.find({ chef: req.user._id })
      .populate('customer', 'name email phone address')
      .sort('-createdAt');
    res.json(hires);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// CHEF: Accept or Reject hire request
// PUT /api/chef-hire/:id/respond
// ─────────────────────────────────────────────────────────────
router.put('/:id/respond', protect, authorize('chef', 'admin'), async (req, res) => {
  try {
    const { status, chefNote, rejectionReason } = req.body;
    // Only allow accept/reject
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }

    const hire = await ChefHire.findOneAndUpdate(
      { _id: req.params.id, chef: req.user._id },
      { status, chefNote, rejectionReason },
      { new: true }
    ).populate('customer', 'name email phone');

    if (!hire) return res.status(404).json({ message: 'Hire request not found' });
    res.json(hire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// CHEF: Mark hire as ongoing or completed
// PUT /api/chef-hire/:id/status
// ─────────────────────────────────────────────────────────────
router.put('/:id/status', protect, authorize('chef', 'admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const hire = await ChefHire.findOneAndUpdate(
      { _id: req.params.id, chef: req.user._id },
      { status },
      { new: true }
    );
    if (!hire) return res.status(404).json({ message: 'Not found' });

    // On completion, increment chef's total hires count
    if (status === 'completed') {
      await ChefProfile.findOneAndUpdate(
        { chef: req.user._id },
        { $inc: { totalPersonalHires: 1 } }
      );
    }
    res.json(hire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// CUSTOMER: Rate and review after completion
// PUT /api/chef-hire/:id/review
// ─────────────────────────────────────────────────────────────
router.put('/:id/review', protect, authorize('customer', 'admin'), async (req, res) => {
  try {
    const { customerRating, customerReview } = req.body;
    const hire = await ChefHire.findOneAndUpdate(
      { _id: req.params.id, customer: req.user._id, status: 'completed' },
      { customerRating, customerReview },
      { new: true }
    );
    if (!hire) return res.status(404).json({ message: 'Hire not found or not completed' });

    // Recalculate chef's average rating
    const allHires = await ChefHire.find({
      chef: hire.chef,
      customerRating: { $exists: true }
    });
    const avg = allHires.reduce((s, h) => s + h.customerRating, 0) / allHires.length;
    await ChefProfile.findOneAndUpdate(
      { chef: hire.chef },
      { averageRating: Math.round(avg * 10) / 10, totalReviews: allHires.length }
    );

    res.json(hire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// CUSTOMER: Cancel hire request
// PUT /api/chef-hire/:id/cancel
// ─────────────────────────────────────────────────────────────
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const hire = await ChefHire.findOneAndUpdate(
      { _id: req.params.id, customer: req.user._id, status: { $in: ['pending', 'accepted'] } },
      { status: 'cancelled' },
      { new: true }
    );
    if (!hire) return res.status(404).json({ message: 'Cannot cancel this hire' });
    res.json(hire);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// CHEF: Create / Update own profile for personal hire
// POST /api/chef-hire/profile  |  PUT /api/chef-hire/profile
// ─────────────────────────────────────────────────────────────
router.post('/profile', protect, authorize('chef', 'admin'), async (req, res) => {
  try {
    const exists = await ChefProfile.findOne({ chef: req.user._id });
    if (exists) {
      const updated = await ChefProfile.findOneAndUpdate(
        { chef: req.user._id }, { ...req.body, updatedAt: Date.now() }, { new: true }
      );
      return res.json(updated);
    }
    const profile = await ChefProfile.create({ ...req.body, chef: req.user._id, profileComplete: true });
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-profile', protect, authorize('chef', 'admin'), async (req, res) => {
  try {
    const profile = await ChefProfile.findOne({ chef: req.user._id })
      .populate('chef', 'name email phone');
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;