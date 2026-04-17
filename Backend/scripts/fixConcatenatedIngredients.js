const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/database');
const Product = require('./models/Product');

/**
 * Script to fix concatenated ingredients in products
 * Some products have all ingredients as a single long string separated by '. '
 * This script splits them into individual ingredient entries
 */

const fixConcatenatedIngredients = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('\nFinding products with concatenated ingredients...');
    
    const allProducts = await Product.find();
    let fixedCount = 0;
    const problematicProducts = [];

    for (const product of allProducts) {
      if (product.ingredients && product.ingredients.length === 1) {
        const firstIngName = product.ingredients[0].name;
        
        // Check if single ingredient with very long string (likely concatenated)
        if (firstIngName.length > 200) {
          console.log(`\n📍 Found: ${product.productName}`);
          console.log(`   Original length: ${firstIngName.length} chars`);
          
          // Split by '. ' to get individual ingredients
          const ingredientNames = firstIngName
            .split('. ')
            .map(ing => ing.trim())
            .filter(ing => ing.length > 0);
          
          console.log(`   Split into: ${ingredientNames.length} ingredients`);
          
          // Create new ingredients array
          const newIngredients = ingredientNames.map(name => ({
            name: name,
            ingredientClass: product.ingredients[0].ingredientClass || 'unknown',
            categoryType: product.ingredients[0].categoryType || 'other',
            knownAllergen: false,
            allergenGroup: null
          }));
          
          // Update the product
          product.ingredients = newIngredients;
          await product.save();
          
          fixedCount++;
          problematicProducts.push({
            name: product.productName,
            before: 1,
            after: ingredientNames.length
          });
          
          console.log(`   ✓ Fixed! Now has ${ingredientNames.length} separate ingredients`);
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total products fixed: ${fixedCount}`);
    console.log(`Total products checked: ${allProducts.length}`);
    
    if (problematicProducts.length > 0) {
      console.log('\nFixed products:');
      problematicProducts.forEach((p, i) => {
        console.log(`${i+1}. ${p.name}`);
        console.log(`   Before: ${p.before} entry → After: ${p.after} entries`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

fixConcatenatedIngredients();
