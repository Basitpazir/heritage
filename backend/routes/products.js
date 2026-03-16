const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protectAdmin } = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Setup Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'heritage_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

const upload = multer({ storage: storage });

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products (UPDATED FOR UPLOADS)
router.post('/', protectAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, brand, category, price, details, notes, features, stock, discount } = req.body;
    
    // If a file was uploaded, use the Cloudinary URL. Otherwise, check if a text URL was sent.
    const imageUrl = req.file ? req.file.path : req.body.image;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image is required' });
    }

    const product = await Product.create({
      name, brand, category,
      price: Number(price),
      image: imageUrl,
      details: details || '',
      notes: notes || '',
      features: features || '',
      stock: Number(stock) || 0,
      discount: Number(discount) || 0,
      sold: 0,
      reviews: []
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id (UPDATED FOR UPLOADS)
router.put('/:id', protectAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, brand, category, price, details, notes, features, stock, discount } = req.body;
    
    let updateData = {
      name, brand, category,
      price: Number(price),
      details: details || '',
      notes: notes || '',
      features: features || '',
      stock: Number(stock),
      discount: Number(discount)
    };

    // If a new image file is uploaded, update the URL
    if (req.file) {
      updateData.image = req.file.path;
    } else if (req.body.image) {
      updateData.image = req.body.image;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json({ message: 'Product removed from vault.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/products/:id/reviews
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