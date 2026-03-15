const mongoose = require('mongoose');
 
// Matches frontend ProductDetails review form fields: user, email, comment, rating
const reviewSchema = new mongoose.Schema({
  user:    { type: String, required: true },
  email:   { type: String, required: true },
  comment: { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });
 
const productSchema = new mongoose.Schema({
  // Core — exact field names used in Products.jsx and ProductDetails.jsx
  name:     { type: String, required: true, trim: true },
  brand:    { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['Men', 'Women', 'Unisex'] },
  price:    { type: Number, required: true, min: 0 },
  image:    { type: String, required: true },
 
  // Product page fields
  details:  { type: String, default: '' },   // shown as italic quote in ProductDetails
  notes:    { type: String, default: '' },   // "Notes" section
  features: { type: String, default: '' },   // "Features" section
 
  // Inventory — frontend calculates: remaining = stock - sold
  stock:    { type: Number, required: true, default: 0 },
  sold:     { type: Number, default: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },  // percentage
 
  reviews: [reviewSchema]
}, { timestamps: true });
 
module.exports = mongoose.model('Product', productSchema);