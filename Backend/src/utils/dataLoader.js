const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const topIngredientCategories = require('./topIngredientCategories.json');

// Normalize ingredient name for matching
const normalizeIngredientName = (name) => {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\(.*?\)/g, '') // Remove parentheses content
    .trim();
};

// Find ingredient metadata from reference database
const findIngredientMetadata = (ingredientName) => {
  if (!ingredientName) return {
    reactivityScore: 2,
    ingredientClass: 'unknown',
    knownAllergen: false,
    allergenGroup: null,
    categoryType: 'B'
  };
  
  const normalized = normalizeIngredientName(ingredientName);
  
  // Try to find exact match
  let found = topIngredientCategories.find(ing => 
    normalizeIngredientName(ing.name) === normalized
  );
  
  if (found) {
    return {
      reactivityScore: found.avg_reactivity || 2,
      ingredientClass: (found.classes && found.classes[0]) || 'unknown',
      knownAllergen: found.is_allergen || false,
      allergenGroup: found.allergen_group || null,
      categoryType: found.category === 'HARMFUL' ? 'A' : 'B'
    };
  }
  
  // Try partial match for common names
  found = topIngredientCategories.find(ing => 
    normalized.includes(normalizeIngredientName(ing.name)) ||
    normalizeIngredientName(ing.name).includes(normalized)
  );
  
  if (found) {
    return {
      reactivityScore: found.avg_reactivity || 2,
      ingredientClass: (found.classes && found.classes[0]) || 'unknown',
      knownAllergen: found.is_allergen || false,
      allergenGroup: found.allergen_group || null,
      categoryType: found.category === 'HARMFUL' ? 'A' : 'B'
    };
  }
  
  return {
    reactivityScore: 2,
    ingredientClass: 'unknown',
    knownAllergen: false,
    allergenGroup: null,
    categoryType: 'B'
  };
};

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
    }).map(product => {
      // Process ingredients and split concatenated ones
      const ingredients = (product.ingredients || []);
      
      // If there's only 1 ingredient and it's very long, it might be concatenated
      if (ingredients.length === 1 && ingredients[0].name && ingredients[0].name.length > 200) {
        // Try to split by '. ' (period followed by space)
        const splitIngredients = ingredients[0].name
          .split('. ')
          .map(ing => ing.trim())
          .filter(ing => ing.length > 0);
        
        // If splitting resulted in multiple ingredients, use the split version
        if (splitIngredients.length > 1) {
          return {
            productName: product.productName || product.product_name,
            productUrl: product.productUrl || product.product_url,
            productType: product.productType || product.product_type,
            price: product.price,
            ingredients: splitIngredients.map((name, idx) => {
              const meta = findIngredientMetadata(name);
              return {
                position: idx + 1,
                name: name,
                categoryType: meta.categoryType,
                reactivityScore: meta.reactivityScore,
                potencyLevel: meta.categoryType === 'A' ? 'high' : 'moderate',
                ingredientClass: meta.ingredientClass,
                knownAllergen: meta.knownAllergen,
                allergenGroup: meta.allergenGroup
              };
            })
          };
        }
      }
      
      // Normal case: use ingredients as-is
      return {
        productName: product.productName || product.product_name,
        productUrl: product.productUrl || product.product_url,
        productType: product.productType || product.product_type,
        price: product.price,
        ingredients: ingredients.map(ing => ({
          position: ing.position,
          name: ing.name,
          categoryType: ing.categoryType || ing.category_type,
          reactivityScore: ing.reactivityScore || ing.reactivity_score,
          potencyLevel: ing.potencyLevel || ing.potency_level,
          ingredientClass: ing.ingredientClass || ing.ingredient_class,
          knownAllergen: ing.knownAllergen || ing.known_allergen,
          allergenGroup: ing.allergenGroup || ing.allergen_group
        }))
      };
    });

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
