const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const { calculateSafetyScore } = require('../utils/safetyCalculator');
const { authenticate } = require('../middleware/auth');
const { verifyToken } = require('@clerk/backend');

const router = express.Router();

// Wrapper to handle async/await errors in route handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Escape all regex special characters in a user-supplied string.
 * Prevents ReDoS — user input must NEVER be injected raw into $regex.
 */
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET ALL PRODUCTS (with pagination and search)
router.get('/', asyncHandler(async (req, res) => {
  const { search, type, page, skip, limit = 20 } = req.query;
  let query = {};

  // Search by name or type
  if (search) {
    // Guard 1: Reject excessively long queries outright
    if (search.length > 100) {
      return res.status(400).json({ error: 'Search query too long (max 100 characters)' });
    }
    // Guard 2: Escape all regex metacharacters — prevents ReDoS injection
    const escapedSearch = escapeRegex(search.trim());
    query.$or = [
      { productName: { $regex: escapedSearch, $options: 'i' } },
      { productType: { $regex: escapedSearch, $options: 'i' } }
    ];
  }

  // Filter by type
  if (type) {
    query.productType = type;
  }

  // Support both page-based and offset-based pagination
  let skipAmount = 0;
  // Hard cap: never return more than 50 products in one request
  const limitNum = Math.min(Math.abs(parseInt(limit) || 20), 50);

  if (skip !== undefined) {
    // Offset-based pagination (skip parameter)
    skipAmount = Math.max(0, parseInt(skip) || 0);
  } else if (page !== undefined) {
    // Page-based pagination (page parameter)
    const pageNum = Math.max(1, parseInt(page) || 1);
    skipAmount = (pageNum - 1) * limitNum;
  }

  const products = await Product.find(query)
    .skip(skipAmount)
    .limit(limitNum)
    .select('_id productName productType price');

  const total = await Product.countDocuments(query);

  res.json({
    success: true,
    data: products,
    pagination: {
      total,
      skip: skipAmount,
      limit: limitNum,
      pages: Math.ceil(total / limitNum)
    }
  });
}));

// SEARCH PRODUCTS
router.get('/search', asyncHandler(async (req, res) => {
  const { q, limit = 20 } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  // Hard cap: max 50 results per search request
  const limitNum = Math.min(Math.abs(parseInt(limit) || 20), 50);

  const products = await Product.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(limitNum)
    .select('_id productName productType price');

  const total = await Product.countDocuments(
    { $text: { $search: q } }
  );

  res.json({
    success: true,
    data: products,
    pagination: {
      total,
      limit: limitNum
    }
  });
}));

// GET PRODUCT BY ID (with optional safety score for authenticated users)
router.get('/:id', asyncHandler(async (req, res) => {
  let product;
  
  try {
    product = await Product.findById(req.params.id);
  } catch (err) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Try to calculate safety score if user is authenticated
  let safetyScore = null;
  
  if (req.headers.authorization) {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7); // Remove "Bearer " prefix
        
        // Verify token with Clerk
        const decoded = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY
        });
        
        const userId = decoded.sub; // Clerk user ID
        const user = await User.findOne({ clerkId: userId });
        
        if (user && user.profile && user.profile.onboardingCompleted) {
          safetyScore = calculateSafetyScore(product, user.profile);
        }
      }
    } catch (err) {
      // Silently fail - safety score is optional
      console.warn('Failed to calculate safety score:', err.message);
    }
  }

  res.json({
    success: true,
    data: product,
    ...(safetyScore && { safetyScore })
  });
}));

// GET PRODUCT TYPES (for filtering)
router.get('/types', asyncHandler(async (req, res) => {
  const types = await Product.distinct('productType');
  res.json({
    success: true,
    data: types.filter(t => t)
  });
}));

module.exports = router;
