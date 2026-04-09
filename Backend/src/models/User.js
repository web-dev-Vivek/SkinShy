const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: [true, 'Clerk ID is required'],
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^[\w.-]+@[\w.-]+\.\w+$/, 'Please provide a valid email']
  },
  name: {
    type: String,
    required: [true, 'Please provide a name']
  },
  profileImage: {
    type: String,
    default: null
  },
  profile: {
    skinType: {
      type: String,
      enum: ['dry', 'oily', 'combination', 'sensitive', 'normal'],
      default: null
    },
    highSensitivity: {
      type: Boolean,
      default: false
    },
    knownAllergies: {
      type: [String],
      default: []
    },
    productChangeRate: {
      type: String,
      enum: ['frequent', 'moderate', 'rare'],
      default: null
    },
    onboardingCompleted: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
