const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  profile: {
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    age: Number,
    height: Number, // cm
    weight: Number, // kg
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'veryActive'],
      default: 'sedentary',
    },
    tdee: Number,
    bmr: Number,
    macroGoals: {
      protein: Number,
      carbs: Number,
      fat: Number,
    },
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
