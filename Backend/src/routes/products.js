const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// GET ALL PRODUCTS (with pagination and search)
router.get('/', async (req, res) => {
  try {
    const { search, type, page = 1, limit = 20 } = req.query;
    let query = {};

    // Search by name or type
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { productType: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by type
    if (type) {
      query.productType = type;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .skip(skip)
      .limit(limitNum)
      .select('productName productType price');

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SEARCH PRODUCTS
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const products = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit))
      .select('productName productType price');

    res.json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET PRODUCT BY ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET PRODUCT TYPES (for filtering)
router.get('/api/types', async (req, res) => {
  try {
    const types = await Product.distinct('productType');
    res.json({
      success: true,
      data: types.filter(t => t)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
