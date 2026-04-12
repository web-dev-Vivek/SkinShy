const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
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
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
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
        enum: ['rarely', 'occasionally', 'frequently', 'very_frequently'],
        default: null
      },
      onboardingCompleted: {
        type: Boolean,
        default: false
      }
    }
  },
  {
    timestamps: true // Automatically manages createdAt and updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);
