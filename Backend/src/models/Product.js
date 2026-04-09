const mongoose = require('mongoose');

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
  productName: {
    type: String,
    required: true,
    index: true
  },
  productUrl: String,
  productType: {
    type: String,
    index: true
  },
  price: String,
  ingredients: [ingredientSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Text index for search
productSchema.index({ productName: 'text', productType: 'text' });

module.exports = mongoose.model('Product', productSchema);
