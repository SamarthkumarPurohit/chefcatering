const express = require('express');
const menuRouter = express.Router();
const ngoRouter = express.Router();
const Menu = require('../models/Menu');
const NGO = require('../models/NGO');
const { protect, authorize } = require('../middleware/auth');

// --- MENU ROUTES ---
menuRouter.get('/', async (req, res) => {
  try {
    const { category, isVeg, chef } = req.query;
    let query = { isAvailable: true };
    if (category) query.category = category;
    if (isVeg !== undefined) query.isVeg = isVeg === 'true';
    if (chef) query.chef = chef;
    const menus = await Menu.find(query).populate('chef', 'name');
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

menuRouter.post('/', protect, authorize('chef', 'admin'), async (req, res) => {
  try {
    const menu = await Menu.create({ ...req.body, chef: req.user._id });
    res.status(201).json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

menuRouter.put('/:id', protect, authorize('chef', 'admin'), async (req, res) => {
  try {
    const menu = await Menu.findOneAndUpdate(
      { _id: req.params.id, chef: req.user._id },
      req.body, { new: true }
    );
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

menuRouter.delete('/:id', protect, authorize('chef', 'admin'), async (req, res) => {
  try {
    await Menu.findOneAndDelete({ _id: req.params.id, chef: req.user._id });
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- NGO ROUTES ---
ngoRouter.get('/', async (req, res) => {
  try {
    const ngos = await NGO.find({ isActive: true, isVerified: true });
    res.json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

ngoRouter.get('/:id', async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    if (!ngo) return res.status(404).json({ message: 'NGO not found' });
    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

ngoRouter.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const ngo = await NGO.create(req.body);
    res.status(201).json(ngo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

ngoRouter.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ngo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { menuRouter, ngoRouter };
