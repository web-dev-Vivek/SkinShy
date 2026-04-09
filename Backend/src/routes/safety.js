const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const { calculateSafetyScore } = require('../utils/safetyCalculator');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// CALCULATE SAFETY SCORE FOR A PRODUCT
router.post('/calculate', authenticate, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    // Get user profile
    const user = await User.findById(req.userId);
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET SAFETY SCORE BY PRODUCT ID (returns precomputed or cached)
router.get('/product/:productId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET SAFETY SCORES FOR MULTIPLE PRODUCTS (for list view)
router.post('/batch', authenticate, async (req, res) => {
  try {
    const { productIds } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: 'Product IDs array is required' });
    }

    const user = await User.findById(req.userId);
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
