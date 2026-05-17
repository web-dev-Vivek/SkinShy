const mongoose = require('mongoose');
const path = require('path');
const { loadProductsFromJSON } = require('../src/utils/dataLoader');
const { calculateSafetyScore } = require('../src/utils/safetyCalculator');
const Product = require('../src/models/Product');

const testAllProducts = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skinshy';
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('✓ Cleared existing products');
    
    // Load products from JSON
    console.log('\n📥 Loading products from JSON...');
    await loadProductsFromJSON();
    
    // Count loaded products
    const count = await Product.countDocuments();
    console.log(`\n✓ Total products in database: ${count}`);
    
    // Test safety scores on a sample
    console.log('\n📊 Testing safety scores on sample products...\n');
    
    const sampleProducts = await Product.find({}).limit(15);
    const sampleUserProfile = {
      skinType: 'combination',
      highSensitivity: false,
      knownAllergies: []
    };
    
    let zeroScores = 0;
    let validScores = 0;
    
    sampleProducts.forEach((product, idx) => {
      const result = calculateSafetyScore(product.toObject(), sampleUserProfile);
      
      if (result.score === 0) {
        zeroScores++;
        console.log(`  ❌ ${idx + 1}. "${product.productName}" - Score: ${result.score}`);
      } else {
        validScores++;
        console.log(`  ✓ ${idx + 1}. "${product.productName}" - Score: ${result.score}`);
      }
    });
    
    console.log(`\n📈 Results:`);
    console.log(`  - Valid scores: ${validScores}/${sampleProducts.length}`);
    console.log(`  - Zero scores: ${zeroScores}/${sampleProducts.length}`);
    
    if (count > 0 && zeroScores === 0) {
      console.log(`\n✅ SUCCESS: All ${count} products loaded and scoring correctly!`);
    } else if (zeroScores > 0) {
      console.log(`\n⚠️  WARNING: ${zeroScores} products with score = 0`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
};

testAllProducts();
