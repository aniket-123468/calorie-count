const express = require('express');
const Meal = require('../models/Meal');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/meals
// @desc    Get all meals for logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user.id }).sort({ date: -1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/meals/today
// @desc    Get today's meals for logged in user
// @access  Private
router.get('/today', protect, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      user: req.user.id,
      date: { $gte: startOfDay, $lte: endOfDay }
    }).sort({ date: -1 });

    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/meals
// @desc    Create a new meal
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, calories, protein, carbs, fat, category } = req.body;

    const meal = await Meal.create({
      user: req.user.id,
      name,
      calories,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      category: category || 'Meal',
    });

    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/meals/:id
// @desc    Update a meal
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Check if meal belongs to user
    if (meal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, calories, protein, carbs, fat, category } = req.body;

    meal.name = name || meal.name;
    meal.calories = calories || meal.calories;
    meal.protein = protein !== undefined ? protein : meal.protein;
    meal.carbs = carbs !== undefined ? carbs : meal.carbs;
    meal.fat = fat !== undefined ? fat : meal.fat;
    meal.category = category || meal.category;

    const updatedMeal = await meal.save();
    res.json(updatedMeal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/meals/:id
// @desc    Delete a meal
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    // Check if meal belongs to user
    if (meal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await meal.deleteOne();
    res.json({ message: 'Meal removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
