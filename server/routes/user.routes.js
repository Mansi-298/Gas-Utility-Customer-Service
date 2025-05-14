const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const { auth, authorize } = require('../middleware/auth.middleware');

// Get all support staff (for admin)
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.query;
    const filter = {};
    
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Update user profile
router.patch('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'address'];
    
    // Filter out non-allowed updates
    Object.keys(updates).forEach(key => {
      if (!allowedUpdates.includes(key)) {
        delete updates[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Get user by ID (for admin)
router.get('/:id', auth, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

module.exports = router; 