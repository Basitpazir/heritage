const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:    { type: String, required: true },
  email:   { type: String, required: true },
  comment: { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  brand:    { type: String, required: true, trim: true },
  // Updated categories for OBSIDIAN lifestyle brand
  category: {
    type: String,
    required: true,
    enum: ['Fragrances', 'Accessories', 'Apparel', 'Tech', 'Lifestyle', 'Men', 'Women', 'Unisex']
  },
  price:    { type: Number, required: true, min: 0 },
  image:    { type: String, required: true },
  details:  { type: String, default: '' },
  notes:    { type: String, default: '' },
  features: { type: String, default: '' },
  stock:    { type: Number, required: true, default: 0 },
  sold:     { type: Number, default: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  reviews:  [reviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);