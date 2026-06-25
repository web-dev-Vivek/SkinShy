const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const { calculateSafetyScore } = require('../utils/safetyCalculator');
const { authenticate } = require('../middleware/auth');
const topIngredientCategories = require('../utils/topIngredientCategories.json');

const router = express.Router();

// TEST ENDPOINT - No auth required
router.get('/test', (req, res) => {
  console.log('[TEST] Test endpoint hit');
  res.json({ success: true, message: 'Safety routes test endpoint working' });
});

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

  // ✅ Maximum 20 products at a time
  if (productIds.length > 20) {
    return res.status(400).json({ error: 'Maximum 20 products can be processed at once' });
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

// INGREDIENT GLOSSARY ENDPOINTS

// GET all ingredients for glossary
router.get('/glossary/all', asyncHandler(async (req, res) => {
  // Get unique ingredients from all products
  const allProducts = await Product.find().select('ingredients');
  const ingredientMap = new Map();

  allProducts.forEach(product => {
    if (product.ingredients && Array.isArray(product.ingredients)) {
      product.ingredients.forEach(ing => {
        if (!ingredientMap.has(ing.name)) {
          ingredientMap.set(ing.name, {
            name: ing.name,
            category: ing.ingredientClass,
            categoryType: ing.categoryType,
            knownAllergen: ing.knownAllergen,
            allergenGroup: ing.allergenGroup
          });
        }
      });
    }
  });

  const ingredients = Array.from(ingredientMap.values());
  
  res.json({
    success: true,
    total: ingredients.length,
    data: ingredients
  });
}));

// GET ingredient details with comprehensive info
router.get('/glossary/search', asyncHandler(async (req, res) => {
  console.log('[GLOSSARY SEARCH] Request received:', { 
    query: req.query,
    userId: req.userId,
    headers: req.headers
  });
  
  const { q } = req.query;
  
  if (!q || q.trim().length === 0) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  console.log('[GLOSSARY SEARCH] Searching for:', q);
  
  // Search in top ingredients database
  const searchTerm = q.toLowerCase();
  const matchedIngredients = topIngredientCategories.filter(ing =>
    ing.name.toLowerCase().includes(searchTerm)
  ).slice(0, 20);

  if (matchedIngredients.length === 0) {
    return res.json({
      success: true,
      data: []
    });
  }

  // Enrich with detailed info
  const enrichedIngredients = matchedIngredients.map(ing => ({
    name: ing.name,
    category: ing.category, // SAFE, CAUTION, HARMFUL
    reactivityScore: ing.avg_reactivity,
    classes: ing.classes,
    isAllergen: ing.is_allergen,
    allergenGroup: ing.allergen_group,
    skinTypeInfo: getSkinTypeCompatibility(ing.classes),
    benefits: getIngredientBenefits(ing.name, ing.classes),
    warnings: getWarnings(ing)
  }));

  res.json({
    success: true,
    data: enrichedIngredients
  });
}));

// GET specific ingredient details
router.get('/glossary/ingredient/:name', asyncHandler(async (req, res) => {
  const rawName = decodeURIComponent(req.params.name);

  // Sanitize: only allow letters, numbers, spaces, hyphens
  if (!/^[a-zA-Z0-9 \-(),.]+$/.test(rawName)) {
    return res.status(400).json({ error: 'Invalid ingredient name format' });
  }

  const ingredient = topIngredientCategories.find(
    ing => ing.name.toLowerCase() === rawName.toLowerCase()
  );

  if (!ingredient) {
    return res.status(404).json({ error: 'Ingredient not found' });
  }

  // Get detailed information
  const detailedInfo = {
    name: ingredient.name,
    category: ingredient.category, // SAFE, CAUTION, HARMFUL
    reactivityScore: ingredient.avg_reactivity,
    classes: ingredient.classes,
    isAllergen: ingredient.is_allergen,
    allergenGroup: ingredient.allergen_group,
    skinTypeInfo: getSkinTypeCompatibility(ingredient.classes),
    benefits: getIngredientBenefits(ingredient.name, ingredient.classes),
    warnings: getWarnings(ingredient),
    recommendation: getRecommendation(ingredient),
    productCount: 0 // Will be calculated
  };

  // Count products containing this ingredient
  const productsWithIngredient = await Product.countDocuments({
    'ingredients.name': ingredient.name
  });
  
  detailedInfo.productCount = productsWithIngredient;

  res.json({
    success: true,
    data: detailedInfo
  });
}));

// HELPER FUNCTIONS

function getSkinTypeCompatibility(ingredientClasses) {
  const compatibility = {
    dry: false,
    oily: false,
    combination: false,
    sensitive: false,
    normal: true
  };

  const classStr = JSON.stringify(ingredientClasses).toLowerCase();
  
  // Dry skin benefits
  if (['emollient', 'occlusive', 'barrier', 'soothing', 'humectant'].some(c => classStr.includes(c))) {
    compatibility.dry = true;
  }
  
  // Oily skin benefits
  if (['humectant', 'solvent', 'buffers', 'exfoliant', 'antioxidant', 'astringent'].some(c => classStr.includes(c))) {
    compatibility.oily = true;
  }
  
  // Combination skin benefits
  if (['humectant', 'balancing', 'antioxidant'].some(c => classStr.includes(c))) {
    compatibility.combination = true;
  }
  
  // Sensitive skin benefits
  if (['soothing', 'barrier', 'humectant'].some(c => classStr.includes(c))) {
    compatibility.sensitive = true;
  }

  return compatibility;
}

function getIngredientBenefits(name, classes) {
  const benefits = [];
  
  if (classes.includes('humectant')) {
    benefits.push('Draws moisture into the skin');
  }
  if (classes.includes('emollient')) {
    benefits.push('Softens and smooths skin');
  }
  if (classes.includes('occlusive')) {
    benefits.push('Creates protective barrier to prevent water loss');
  }
  if (classes.includes('exfoliant')) {
    benefits.push('Removes dead skin cells');
  }
  if (classes.includes('antioxidant')) {
    benefits.push('Protects against environmental damage');
  }
  if (classes.includes('soothing')) {
    benefits.push('Calms and reduces irritation');
  }
  if (classes.includes('astringent')) {
    benefits.push('Tightens and refines pores');
  }
  if (classes.includes('preservative')) {
    benefits.push('Prevents bacterial growth and product spoilage');
  }

  return benefits.length > 0 ? benefits : ['General skincare ingredient'];
}

function getWarnings(ingredient) {
  const warnings = [];
  
  if (ingredient.is_allergen) {
    warnings.push(`⚠️ Known allergen: ${ingredient.allergen_group}`);
  }
  
  if (ingredient.avg_reactivity >= 4) {
    warnings.push('⚠️ High reactivity score - may cause irritation');
  }
  
  if (ingredient.category === 'HARMFUL') {
    warnings.push('🛑 HARMFUL - Not recommended for sensitive skin');
  }
  
  if (ingredient.category === 'CAUTION') {
    warnings.push('⚠️ Use with caution - may not suit all skin types');
  }

  return warnings;
}

function getRecommendation(ingredient) {
  if (ingredient.category === 'HARMFUL') {
    return 'Avoid this ingredient if you have sensitive skin or known allergies';
  }
  if (ingredient.category === 'CAUTION') {
    return 'Perform a patch test before full application';
  }
  return 'Generally safe for most skin types';
}

module.exports = router;
