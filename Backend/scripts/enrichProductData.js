const fs = require('fs');
const path = require('path');

/**
 * Enrichment Script: Adds missing metadata to product ingredients
 * Handles ingredients that are missing categoryType, reactivityScore, etc.
 * Creates default metadata when ingredient data is not found
 */

const productsPath = path.join(__dirname, '../../Products_ingrediant.json');
const ingredientCategoriesPath = path.join(__dirname, '../src/utils/topIngredientCategories.json');

// Load ingredient metadata reference
let ingredientDatabase = [];
try {
  ingredientDatabase = JSON.parse(fs.readFileSync(ingredientCategoriesPath, 'utf8'));
  console.log(`✓ Loaded ${ingredientDatabase.length} ingredients from reference database`);
} catch (err) {
  console.warn('⚠️  Could not load ingredient database:', err.message);
}

// Default metadata for ingredients not found in database
const defaultMetadata = {
  categoryType: 'B',
  reactivityScore: 2,
  potencyLevel: 'moderate',
  ingredientClass: 'unknown',
  knownAllergen: false,
  allergenGroup: null
};

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
  if (!ingredientName) return null;
  
  const normalized = normalizeIngredientName(ingredientName);
  
  // Try to find exact match
  let found = ingredientDatabase.find(ing => 
    normalizeIngredientName(ing.name) === normalized
  );
  
  if (found) {
    return {
      reactivityScore: found.avg_reactivity || 2,
      ingredientClass: (found.classes && found.classes[0]) || 'unknown',
      knownAllergen: found.is_allergen || false,
      allergenGroup: found.allergen_group || null
    };
  }
  
  // Try partial match for common names
  found = ingredientDatabase.find(ing => 
    normalized.includes(normalizeIngredientName(ing.name)) ||
    normalizeIngredientName(ing.name).includes(normalized)
  );
  
  if (found) {
    return {
      reactivityScore: found.avg_reactivity || 2,
      ingredientClass: (found.classes && found.classes[0]) || 'unknown',
      knownAllergen: found.is_allergen || false,
      allergenGroup: found.allergen_group || null
    };
  }
  
  return null;
};

// Main enrichment function
const enrichProducts = () => {
  try {
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    
    if (!Array.isArray(products)) {
      console.error('✗ Products data is not an array');
      process.exit(1);
    }
    
    console.log(`\n📊 Processing ${products.length} products...\n`);
    
    let productsModified = 0;
    let ingredientsEnhanced = 0;
    let ingredientsWithDefaults = 0;
    
    const enrichedProducts = products.map((product, idx) => {
      let productModified = false;
      
      if (!product.ingredients || !Array.isArray(product.ingredients)) {
        return product;
      }
      
      const enrichedIngredients = product.ingredients.map((ingredient, ingIdx) => {
        const enriched = { ...ingredient };
        let enhanced = false;
        
        // Ensure all required fields exist
        if (!enriched.position) enriched.position = ingIdx + 1;
        
        // Check and fill missing metadata
        if (!enriched.category_type && !enriched.categoryType) {
          enriched.category_type = defaultMetadata.categoryType;
          enhanced = true;
          ingredientsWithDefaults++;
        }
        
        if (!enriched.reactivity_score && !enriched.reactivityScore) {
          // Try to find from reference database
          const metadata = findIngredientMetadata(ingredient.name);
          if (metadata) {
            enriched.reactivity_score = metadata.reactivityScore;
            enriched.ingredient_class = metadata.ingredientClass;
            enriched.known_allergen = metadata.knownAllergen;
            enriched.allergen_group = metadata.allergenGroup;
            ingredientsEnhanced++;
          } else {
            enriched.reactivity_score = defaultMetadata.reactivityScore;
            ingredientsWithDefaults++;
          }
          enhanced = true;
        }
        
        if (!enriched.potency_level && !enriched.potencyLevel) {
          enriched.potency_level = defaultMetadata.potencyLevel;
          enhanced = true;
        }
        
        if (!enriched.ingredient_class && !enriched.ingredientClass) {
          // Try reference database
          const metadata = findIngredientMetadata(ingredient.name);
          enriched.ingredient_class = metadata?.ingredientClass || defaultMetadata.ingredientClass;
          enhanced = true;
        }
        
        if (enriched.known_allergen === undefined && enriched.knownAllergen === undefined) {
          enriched.known_allergen = defaultMetadata.knownAllergen;
          enhanced = true;
        }
        
        if (enriched.allergen_group === undefined && enriched.allergenGroup === undefined) {
          enriched.allergen_group = defaultMetadata.allergenGroup;
          enhanced = true;
        }
        
        if (enhanced) {
          productModified = true;
        }
        
        return enriched;
      });
      
      if (productModified) {
        productsModified++;
        return { ...product, ingredients: enrichedIngredients };
      }
      
      return product;
    });
    
    // Write enriched products back
    fs.writeFileSync(productsPath, JSON.stringify(enrichedProducts, null, 2), 'utf8');
    
    console.log(`✅ Enrichment complete!\n`);
    console.log(`📈 Statistics:`);
    console.log(`  - Products modified: ${productsModified}/${products.length}`);
    console.log(`  - Ingredients enhanced from reference DB: ${ingredientsEnhanced}`);
    console.log(`  - Ingredients filled with defaults: ${ingredientsWithDefaults}`);
    
  } catch (error) {
    console.error('✗ Error enriching products:', error.message);
    process.exit(1);
  }
};

enrichProducts();
