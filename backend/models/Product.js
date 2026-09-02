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

  // Who it's for — drives the top-level nav (Men / Women / Unisex)
  audience: {
    type: String,
    required: true,
    enum: ['Men', 'Women', 'Unisex']
  },

  // What it is — drives the sub-category links under each audience
  type: {
    type: String,
    required: true,
    enum: ['Fragrances', 'Accessories', 'Apparel', 'Tech', 'Lifestyle']
  },

  price:    { type: Number, required: true, min: 0 },
  // Legacy single-image field — kept (optional) for backward compatibility
  // with products created before the gallery upload existed. New writes
  // should populate `images` instead; readers should prefer images[0] and
  // fall back to `image` when images is empty.
  image:    { type: String, default: '' },
  images:   { type: [String], default: [] },
  details:  { type: String, default: '' },
  notes:    { type: String, default: '' },
  features: { type: String, default: '' },
  stock:    { type: Number, required: true, default: 0 },
  sold:     { type: Number, default: 0 },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  reviews:  [reviewSchema]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);