const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   PUT /api/profile
// @desc    Update user profile (BMR, TDEE, macro goals)
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const { gender, age, height, weight, activityLevel, tdee, bmr, macroGoals } = req.body;

    const user = await User.findById(req.user.id);

    if (user) {
      user.profile = {
        ...user.profile,
        gender: gender || user.profile.gender,
        age: age || user.profile.age,
        height: height || user.profile.height,
        weight: weight || user.profile.weight,
        activityLevel: activityLevel || user.profile.activityLevel,
        tdee: tdee || user.profile.tdee,
        bmr: bmr || user.profile.bmr,
        macroGoals: macroGoals || user.profile.macroGoals,
      };

      const updatedUser = await user.save();

      res.json(updatedUser.profile);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user.profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
