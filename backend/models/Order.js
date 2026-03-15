const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customer: {
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    phone:   { type: String, required: true },
    address: { type: String, required: true },
    city:    { type: String, required: true }
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name:      String,
      brand:     String,
      image:     String,
      price:     Number,
      discount:  Number
    }
  ],
  total: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Bank Transfer', 'Debit/Credit Card'],
    required: true
  },
  status: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered'],
    default: 'Processing'
  },
  // Full date + time string
  date:     { type: String },
  time:     { type: String },
  dateTime: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

// Auto-set date and time before saving
orderSchema.pre('save', async function () {
  if (!this.date) {
    const now = new Date();
    this.date = now.toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' });
    this.time = now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: true });
    this.dateTime = `${this.date} at ${this.time}`;
  }
});

module.exports = mongoose.model('Order', orderSchema);