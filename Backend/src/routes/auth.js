const express = require('express');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// SYNC/CREATE USER FROM CLERK
// This endpoint is called from frontend after Clerk authentication
router.post('/sync', authenticate, async (req, res) => {
  try {
    const { clerkId, email, name, profileImage } = req.body;

    if (!clerkId || !email || !name) {
      return res.status(400).json({ error: 'Missing required fields: clerkId, email, name' });
    }

    // Check if user already exists
    let user = await User.findOne({ clerkId });

    if (user) {
      // Update existing user
      user.email = email;
      user.name = name;
      if (profileImage) user.profileImage = profileImage;
      await user.save();
    } else {
      // Create new user
      user = new User({
        clerkId,
        email,
        name,
        profileImage: profileImage || null
      });
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: user.clerkId === clerkId && user.email !== email ? 'User updated' : 'User synced',
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        onboardingCompleted: user.profile.onboardingCompleted
      }
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: error.message });
  }
});

// VERIFY TOKEN & GET USER INFO
router.get('/verify', authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.userId });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        onboardingCompleted: user.profile.onboardingCompleted
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
