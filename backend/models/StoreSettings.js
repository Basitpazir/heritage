const mongoose = require('mongoose');
 
// Single-document collection — only one store settings record ever exists
const storeSettingsSchema = new mongoose.Schema({
  // Admin Design tab — hero carousel
  heroImages: { type: [String], default: [] },
  heroZoom:   { type: Number, default: 100, min: 100, max: 150 },
 
  // Admin Settings tab — store info shown in Footer
  email:          { type: String, default: 'contact@heritage.com' },
  phone:          { type: String, default: '+92 300 1234567' },
  address:        { type: String, default: 'Heritage Flagship Store, Pakistan' },
  shippingPolicy: { type: String, default: 'Free shipping on all orders. Delivery in 3-5 business days.' },
  returnPolicy:   { type: String, default: 'Returns accepted within 14 days of delivery.' }
 
}, { timestamps: true });
 
module.exports = mongoose.model('StoreSettings', storeSettingsSchema);