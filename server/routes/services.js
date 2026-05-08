const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const { protect, authorize } = require('../middleware/auth');

// @GET /api/services - Get all services
router.get('/', async (req, res) => {
  try {
    const { category, cuisine, minPrice, maxPrice, search } = req.query;
    let query = { isActive: true };
    if (category) query.category = category;
    if (cuisine) query.cuisineType = { $in: [cuisine] };
    if (minPrice || maxPrice) {
      query.pricePerHead = {};
      if (minPrice) query.pricePerHead.$gte = Number(minPrice);
      if (maxPrice) query.pricePerHead.$lte = Number(maxPrice);
    }
    if (search) query.title = { $regex: search, $options: 'i' };

    const services = await Service.find(query).populate('chef', 'name email phone profileImage');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @GET /api/services/:id
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('chef', 'name email phone address');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @POST /api/services - Chef creates service
router.post('/', protect, authorize('chef', 'admin'), async (req, res) => {
  try {
    const service = await Service.create({ ...req.body, chef: req.user._id });
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @PUT /api/services/:id
router.put('/:id', protect, authorize('chef', 'admin'), async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, chef: req.user._id },
      req.body, { new: true }
    );
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @DELETE /api/services/:id
router.delete('/:id', protect, authorize('chef', 'admin'), async (req, res) => {
  try {
    await Service.findOneAndDelete({ _id: req.params.id, chef: req.user._id });
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
