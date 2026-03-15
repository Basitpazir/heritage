const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protectUser, protectAdmin } = require('../middleware/auth');

// ─────────────────────────────────────────────────────────────
// POST /api/orders
// Called by: Cart.jsx handleCheckout → placeOrder()
// Body: { customer, items, total, paymentMethod }
// ─────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { customer, items, total, paymentMethod, userId } = req.body;

    if (!customer || !items || !total || !paymentMethod) {
      return res.status(400).json({ error: 'customer, items, total and paymentMethod are required.' });
    }

    // Generate ORD-xxx id — matches frontend format exactly
    const orderId = `ORD-${Date.now()}`;

    const order = await Order.create({
      orderId,
      customer,
      items,
      total,
      paymentMethod,
      status: 'Processing',
      userId: userId || null
    });

    // Auto-increment sold count for each product in the order
    for (const item of items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { sold: 1 } });
      }
    }

    // Return the orderId so Cart.jsx can display it as order reference
    res.status(201).json({ orderId: order.orderId, _id: order._id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/orders/track/:orderId
// Called by: TrackOrder.jsx — looks up by ORD-xxx string
// ─────────────────────────────────────────────────────────────
router.get('/track/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: 'No order found with that reference.' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/orders/my
// Called by: CustomerAccount.jsx — orders for logged-in user
// ─────────────────────────────────────────────────────────────
router.get('/my', protectUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/orders
// Called by: Admin.jsx orders tab — all orders list
// Admin protected
// ─────────────────────────────────────────────────────────────
router.get('/', protectAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// PUT /api/orders/:id/status
// Called by: Admin.jsx status dropdown (updateOrderStatus)
// Body: { status: "Processing" | "Shipped" | "Delivered" }
// ─────────────────────────────────────────────────────────────
router.put('/:id/status', protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Processing', 'Shipped', 'Delivered'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${allowed.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
