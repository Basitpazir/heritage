const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protectUser } = require('../middleware/auth');

// All cart routes require logged-in user

// ─────────────────────────────────────────────────────────────
// GET /api/cart
// Get current user's cart (called on app load)
// ─────────────────────────────────────────────────────────────
router.get('/', protectUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.productId');
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/cart/add
// Add a product to cart — called by ProductDetails.jsx addToCart
// Body: { productId, name, brand, image, price, discount }
// ─────────────────────────────────────────────────────────────
router.post('/add', protectUser, async (req, res) => {
  try {
    const { productId, name, brand, image, price, discount } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    const newItem = { productId, name, brand, image, price, discount };

    if (!cart) {
      // First item — create cart
      cart = await Cart.create({ user: req.user._id, items: [newItem] });
    } else {
      // Push item (allows duplicates, same as frontend behavior)
      cart.items.push(newItem);
      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/cart/remove/:itemId
// Remove a single item by its _id — called by Cart.jsx removeFromCart
// ─────────────────────────────────────────────────────────────
router.delete('/remove/:itemId', protectUser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: 'Cart not found.' });

    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// DELETE /api/cart/clear
// Empty the entire cart — called after order is placed
// ─────────────────────────────────────────────────────────────
router.delete('/clear', protectUser, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] }
    );
    res.json({ message: 'Cart cleared.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
