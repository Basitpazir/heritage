const mongoose = require('mongoose');
 
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true   // one cart per user
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name:      String,
      brand:     String,
      image:     String,
      price:     Number,
      discount:  Number
    }
  ]
}, { timestamps: true });
 
module.exports = mongoose.model('Cart', cartSchema);
 