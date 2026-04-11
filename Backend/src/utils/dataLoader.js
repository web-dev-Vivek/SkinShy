const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');

const loadProductsFromJSON = async () => {
  try {
    const filePath = path.join(__dirname, '../../..', 'Products_ingrediant.json');
    
    if (!fs.existsSync(filePath)) {
      console.log('⚠️  Products JSON file not found');
      return;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!Array.isArray(data)) {
      console.log('⚠️  Products data is not an array');
      return;
    }

    // Check if products already exist (with timeout)
    try {
      const countPromise = Product.countDocuments();
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 5000));
      const count = await Promise.race([countPromise, timeoutPromise]);
      
      if (count === null) {
        console.warn('⚠️  Product count check timed out (MongoDB not responding)');
        return;
      }
      
      if (count > 0) {
        console.log(`✓ Products already in database (${count} products)`);
        return;
      }
    } catch (err) {
      console.warn('⚠️  Could not check product count:', err.message);
      return;
    }

    // Filter and transform products (convert snake_case from JSON to camelCase for schema)
    const validProducts = data.filter(product => {
      // Support both snake_case (from JSON) and camelCase (already transformed)
      const name = product.productName || product.product_name;
      if (!name) {
        console.warn(`⚠️  Skipping product without productName:`, product);
        return false;
      }
      return true;
    }).map(product => ({
      productName: product.productName || product.product_name,
      productUrl: product.productUrl || product.product_url,
      productType: product.productType || product.product_type,
      price: product.price,
      ingredients: (product.ingredients || []).map(ing => ({
        position: ing.position,
        name: ing.name,
        categoryType: ing.categoryType || ing.category_type,
        reactivityScore: ing.reactivityScore || ing.reactivity_score,
        potencyLevel: ing.potencyLevel || ing.potency_level,
        ingredientClass: ing.ingredientClass || ing.ingredient_class,
        knownAllergen: ing.knownAllergen || ing.known_allergen,
        allergenGroup: ing.allergenGroup || ing.allergen_group
      }))
    }));

    console.log(`✓ Filtered products: ${validProducts.length}/${data.length} valid`);

    // Insert products in batches
    const batchSize = 100;
    let insertedCount = 0;
    for (let i = 0; i < validProducts.length; i += batchSize) {
      const batch = validProducts.slice(i, i + batchSize);
      try {
        await Product.insertMany(batch, { ordered: false });
        insertedCount += batch.length;
        console.log(`✓ Loaded ${Math.min(i + batchSize, validProducts.length)}/${validProducts.length} products`);
      } catch (error) {
        // Continue even if some products fail to insert
        console.warn(`⚠️  Some products in batch failed to insert: ${error.message}`);
      }
    }

    console.log(`✅ Loaded ${insertedCount} products successfully`);
  } catch (error) {
    console.error(`✗ Error loading products: ${error.message}`);
  }
};

module.exports = { loadProductsFromJSON };
