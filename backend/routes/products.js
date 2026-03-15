const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protectAdmin } = require('../middleware/auth');
 
// ─────────────────────────────────────────────────────────────
// GET /api/products
// Called by: Products.jsx on mount
// Returns all products — frontend filters by category & search
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// ─────────────────────────────────────────────────────────────
// GET /api/products/:id
// Called by: ProductDetails.jsx via useParams
// ─────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// ─────────────────────────────────────────────────────────────
// POST /api/products
// Called by: Admin.jsx "Add to Vault" form (handleSubmit)
// Fields: name, brand, category, price, image, details, stock, discount
// ─────────────────────────────────────────────────────────────
router.post('/', protectAdmin, async (req, res) => {
  try {
    const { name, brand, category, price, image, details, notes, features, stock, discount } = req.body;
 
    const product = await Product.create({
      name, brand, category,
      price:    Number(price),
      image,
      details:  details  || '',
      notes:    notes    || '',
      features: features || '',
      stock:    Number(stock)    || 0,
      discount: Number(discount) || 0,
      sold:     0,
      reviews:  []
    });
 
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// ─────────────────────────────────────────────────────────────
// PUT /api/products/:id
// Called by: Admin.jsx Edit modal (handleEditSubmit)
// ─────────────────────────────────────────────────────────────
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const { name, brand, category, price, image, details, notes, features, stock, discount } = req.body;
 
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name, brand, category,
        price:    Number(price),
        image,
        details:  details  || '',
        notes:    notes    || '',
        features: features || '',
        stock:    Number(stock),
        discount: Number(discount)
      },
      { new: true, runValidators: true }
    );
 
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// ─────────────────────────────────────────────────────────────
// DELETE /api/products/:id
// Called by: Admin.jsx "Drop" button (deleteProduct)
// ─────────────────────────────────────────────────────────────
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json({ message: 'Product removed from vault.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// ─────────────────────────────────────────────────────────────
// POST /api/products/:id/reviews
// Called by: ProductDetails.jsx review form (handlePostReview)
// ─────────────────────────────────────────────────────────────
router.post('/:id/reviews', async (req, res) => {
  try {
    const { user, email, comment, rating } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
 
    product.reviews.push({ user, email, comment, rating: Number(rating) });
    await product.save();
 
    res.status(201).json({ message: 'Review posted.', reviews: product.reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
module.exports = router;
 