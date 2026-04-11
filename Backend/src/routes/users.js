const express = require('express');
const User = require('../models/User');

const router = express.Router();

// GET USER PROFILE
router.get('/profile/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        profile: user.profile,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE USER PROFILE
router.put('/profile/:userId', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (name) user.name = name;
    if (email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: req.params.userId } });
      if (existingEmail) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      user.email = email;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET USER PREFERENCES (SKIN DETAILS)
router.get('/preferences/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      preferences: user.profile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE USER PREFERENCES (ONBOARDING)
router.put('/preferences/:userId', async (req, res) => {
  try {
    const { skinType, highSensitivity, knownAllergies, productChangeRate } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (skinType) user.profile.skinType = skinType;
    if (typeof highSensitivity === 'boolean') user.profile.highSensitivity = highSensitivity;
    if (Array.isArray(knownAllergies)) user.profile.knownAllergies = knownAllergies;
    if (productChangeRate) user.profile.productChangeRate = productChangeRate;

    // Mark onboarding as completed if all required fields are set
    if (skinType && typeof highSensitivity === 'boolean' && knownAllergies && productChangeRate) {
      user.profile.onboardingCompleted = true;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated',
      preferences: user.profile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// COMPLETE ONBOARDING
router.post('/complete-onboarding/:userId', async (req, res) => {
  try {
    const { skinType, highSensitivity, knownAllergies, productChangeRate } = req.body;

    // Validate all fields are provided
    if (!skinType || typeof highSensitivity !== 'boolean' || !Array.isArray(knownAllergies) || !productChangeRate) {
      return res.status(400).json({ error: 'All onboarding fields are required' });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.profile.skinType = skinType;
    user.profile.highSensitivity = highSensitivity;
    user.profile.knownAllergies = knownAllergies;
    user.profile.productChangeRate = productChangeRate;
    user.profile.onboardingCompleted = true;

    await user.save();

    res.json({
      success: true,
      message: 'Onboarding completed',
      preferences: user.profile
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
