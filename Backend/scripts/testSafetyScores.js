const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { calculateSafetyScore } = require('../src/utils/safetyCalculator');

// Product schema
const ingredientSchema = new mongoose.Schema({
  position: Number,
  name: String,
  categoryType: String,
  reactivityScore: Number,
  potencyLevel: String,
  ingredientClass: String,
  knownAllergen: Boolean,
  allergenGroup: String
}, { _id: false });

const productSchema = new mongoose.Schema({
  productName: String,
  productUrl: String,
  productType: String,
  price: String,
  ingredients: [ingredientSchema],
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Sample user profile
const sampleUserProfile = {
  skinType: 'combination',
  highSensitivity: false,
  knownAllergies: []
};

const testSafetyScores = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/skinshy';
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✓ Connected to MongoDB');
    
    // Load sample products from JSON
    const productsPath = path.join(__dirname, '../../Products_ingrediant.json');
    const data = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    
    // Transform to match schema (snake_case to camelCase)
    const transformedProducts = data.slice(0, 10).map(product => ({
      productName: product.product_name,
      productUrl: product.product_url,
      productType: product.product_type,
      price: product.price,
      ingredients: product.ingredients.map(ing => ({
        position: ing.position,
        name: ing.name,
        categoryType: ing.category_type,
        reactivityScore: ing.reactivity_score,
        potencyLevel: ing.potency_level,
        ingredientClass: ing.ingredient_class,
        knownAllergen: ing.known_allergen,
        allergenGroup: ing.allergen_group
      }))
    }));
    
    console.log(`\n📊 Testing safety scores on ${transformedProducts.length} sample products...\n`);
    
    let zeroScores = 0;
    let validScores = 0;
    
    transformedProducts.forEach((product, idx) => {
      const result = calculateSafetyScore(product, sampleUserProfile);
      
      if (result.score === 0) {
        zeroScores++;
        console.log(`  ❌ ${idx + 1}. "${product.productName}" - Score: ${result.score} (${result.message})`);
        if (product.ingredients.length > 0) {
          const firstIng = product.ingredients[0];
          console.log(`     First ingredient: ${firstIng.name}`);
          console.log(`     Fields present: categoryType=${firstIng.categoryType}, reactivityScore=${firstIng.reactivityScore}, ingredientClass=${firstIng.ingredientClass}`);
        }
      } else {
        validScores++;
        console.log(`  ✓ ${idx + 1}. "${product.productName}" - Score: ${result.score}`);
      }
    });
    
    console.log(`\n📈 Results:`);
    console.log(`  - Valid scores: ${validScores}/${transformedProducts.length}`);
    console.log(`  - Zero scores: ${zeroScores}/${transformedProducts.length}`);
    
    if (zeroScores === 0) {
      console.log(`\n✅ All products have valid safety scores!`);
    } else {
      console.log(`\n❌ Found ${zeroScores} products with score = 0`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
};

testSafetyScores();
