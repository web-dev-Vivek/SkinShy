const express = require('express');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Wrapper to handle async/await errors in route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
// Helper to find a user or dynamically create one if they exist in Clerk but not MongoDB
const findOrCreateUser = async (clerkId, clerkUser) => {
  let user = await User.findOne({ clerkId });
  if (!user) {
    const email = clerkUser?.email || (clerkUser?.email_addresses && clerkUser.email_addresses[0]) || `user_${clerkId}@example.com`;
    const name = clerkUser?.name || email.split('@')[0];
    
    user = new User({
      clerkId,
      email,
      name
    });
    await user.save();
    console.log(`✓ Self-healed: Dynamic profile created for Clerk user: ${clerkId}`);
  }
  return user;
};

/**
 * POST /users - Create or get user (called during signup)
 * Body: { clerkId, email, name }
 * Protected: YES
 */
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { clerkId, email, name } = req.body;

  // Verify that the clerkId matches the authenticated user
  if (clerkId !== req.userId) {
    return res.status(403).json({
      success: false,
      error: 'Cannot create user for another account'
    });
  }

  // Check if user already exists
  let user = await User.findOne({ clerkId });

  if (user) {
    return res.json({
      success: true,
      message: 'User already exists',
      user: {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        profile: user.profile
      }
    });
  }

  // Create new user
  user = new User({
    clerkId,
    email,
    name: name || email.split('@')[0] // Use email prefix as fallback name
  });

  await user.save();

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    user: {
      id: user._id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      profile: user.profile
    }
  });
}));

/**
 * GET /users/profile - Get current user profile
 * Protected: YES
 * Uses Clerk ID from token
 */
router.get('/profile', authenticate, asyncHandler(async (req, res) => {
  const user = await findOrCreateUser(req.userId, req.clerkUser);

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
}));

/**
 * PUT /users/profile - Update current user profile
 * Body: { name, email }
 * Protected: YES
 */
router.put('/profile', authenticate, asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const user = await findOrCreateUser(req.userId, req.clerkUser);

  if (name) user.name = name;
  if (email) {
    const existingEmail = await User.findOne({
      email,
      clerkId: { $ne: req.userId }
    });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        error: 'Email already in use'
      });
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
}));

/**
 * GET /users/preferences - Get current user skin preferences
 * Protected: YES
 */
router.get('/preferences', authenticate, asyncHandler(async (req, res) => {
  const user = await findOrCreateUser(req.userId, req.clerkUser);

  res.json({
    success: true,
    preferences: user.profile
  });
}));

/**
 * PUT /users/preferences - Update current user preferences
 * Body: { skinType, highSensitivity, knownAllergies, productChangeRate }
 * Protected: YES
 */
router.put('/preferences', authenticate, asyncHandler(async (req, res) => {
  const { skinType, highSensitivity, knownAllergies, productChangeRate } = req.body;
  const user = await findOrCreateUser(req.userId, req.clerkUser);

  if (skinType) user.profile.skinType = skinType;
  if (typeof highSensitivity === 'boolean') user.profile.highSensitivity = highSensitivity;
  if (Array.isArray(knownAllergies)) {
    if (knownAllergies.length > 20) {
      return res.status(400).json({ error: 'Too many allergies listed (max 20)' });
    }
    const validAllergies = knownAllergies
      .filter(a => typeof a === 'string' && a.length <= 50)
      .slice(0, 20);
    user.profile.knownAllergies = validAllergies;
  }
  if (productChangeRate) user.profile.productChangeRate = productChangeRate;

  // Mark onboarding as completed if all required fields are set
  if (
    user.profile.skinType &&
    typeof user.profile.highSensitivity === 'boolean' &&
    user.profile.knownAllergies &&
    user.profile.productChangeRate
  ) {
    user.profile.onboardingCompleted = true;
  }

  await user.save();

  res.json({
    success: true,
    message: 'Preferences updated',
    preferences: user.profile
  });
}));

/**
 * POST /users/complete-onboarding - Complete onboarding process
 * Body: { skinType, highSensitivity, knownAllergies, productChangeRate }
 * Protected: YES
 * Note: skinType and productChangeRate are required; others are optional
 */
router.post('/complete-onboarding', authenticate, asyncHandler(async (req, res) => {
  const { skinType, highSensitivity, knownAllergies, productChangeRate } = req.body;

  // Validate required fields (skinType and productChangeRate)
  if (!skinType || !productChangeRate) {
    return res.status(400).json({
      success: false,
      error: 'Skin type and product change rate are required'
    });
  }

  const user = await findOrCreateUser(req.userId, req.clerkUser);

  user.profile.skinType = skinType;
  if (typeof highSensitivity === 'boolean') {
    user.profile.highSensitivity = highSensitivity;
  }
  if (Array.isArray(knownAllergies)) {
    if (knownAllergies.length > 20) {
      return res.status(400).json({ error: 'Too many allergies listed (max 20)' });
    }
    const validAllergies = knownAllergies
      .filter(a => typeof a === 'string' && a.length <= 50)
      .slice(0, 20);
    user.profile.knownAllergies = validAllergies;
  }
  user.profile.productChangeRate = productChangeRate;
  user.profile.onboardingCompleted = true;

  await user.save();

  res.json({
    success: true,
    message: 'Onboarding completed',
    preferences: user.profile
  });
}));

module.exports = router;
