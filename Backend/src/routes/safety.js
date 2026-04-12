const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const { calculateSafetyScore } = require('../utils/safetyCalculator');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Wrapper to handle async/await errors in route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// CALCULATE SAFETY SCORE FOR A PRODUCT
router.post('/calculate', authenticate, asyncHandler(async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  // Get user profile by clerkId (not MongoDB ID)
  const user = await User.findOne({ clerkId: req.userId });
  if (!user || !user.profile.onboardingCompleted) {
    return res.status(400).json({ error: 'Please complete onboarding first' });
  }

  // Get product
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Calculate safety score
  const result = calculateSafetyScore(product, user.profile);

  res.json({
    success: true,
    product: {
      id: product._id,
      name: product.productName,
      type: product.productType,
      price: product.price
    },
    safetyScore: result
  });
}));


// GET SAFETY SCORE BY PRODUCT ID (returns precomputed or cached)
router.get('/product/:productId', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findOne({ clerkId: req.userId });
  if (!user || !user.profile.onboardingCompleted) {
    return res.status(400).json({ error: 'Please complete onboarding first' });
  }

  const product = await Product.findById(req.params.productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const result = calculateSafetyScore(product, user.profile);

  res.json({
    success: true,
    product: {
      id: product._id,
      name: product.productName,
      type: product.productType,
      price: product.price,
      url: product.productUrl
    },
    safetyScore: result
  });
}));

// GET SAFETY SCORES FOR MULTIPLE PRODUCTS (for list view)
router.post('/batch', authenticate, asyncHandler(async (req, res) => {
  const { productIds } = req.body;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: 'Product IDs array is required' });
  }

  const user = await User.findOne({ clerkId: req.userId });
  if (!user || !user.profile.onboardingCompleted) {
    return res.status(400).json({ error: 'Please complete onboarding first' });
  }

  const products = await Product.find({ _id: { $in: productIds } });
  const results = products.map(product => ({
    product: {
      id: product._id,
      name: product.productName,
      type: product.productType,
      price: product.price
    },
    safetyScore: calculateSafetyScore(product, user.profile)
  }));

  res.json({
    success: true,
    data: results
  });
}));

module.exports = router;
