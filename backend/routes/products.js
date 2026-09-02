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

const MAX_PRODUCT_IMAGES = 8;

// Normalize the images[] array coming from the client (JSON body from the
// gallery uploader) and keep the legacy `image` field in sync as
// images[0], so any old code still reading `image` keeps working.
function normalizeImages(body, uploadedFile) {
  let images = Array.isArray(body.images) ? body.images.filter(Boolean) : [];
  images = images.slice(0, MAX_PRODUCT_IMAGES);

  // A direct multipart file upload (if ever used) takes precedence and
  // becomes the cover image.
  if (uploadedFile) {
    images = [uploadedFile.path, ...images.filter(img => img !== uploadedFile.path)].slice(0, MAX_PRODUCT_IMAGES);
  }

  const legacyImage = images[0] || body.image || '';
  return { images, legacyImage };
}

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

// POST /api/products
// No minimum image count required — the admin gallery uploader allows 0-8
// images per product. Do NOT reintroduce a hard "image is required" check.
router.post('/', protectAdmin, upload.single('image'), async (req, res) => {
  try {
    const { images, legacyImage } = normalizeImages(req.body, req.file);

    const product = await Product.create({
      ...req.body,
      image: legacyImage,
      images,
      price: Number(req.body.price),
      stock: Number(req.body.stock) || 0,
      discount: Number(req.body.discount) || 0,
      sold: 0,
      reviews: []
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id
router.put('/:id', protectAdmin, upload.single('image'), async (req, res) => {
  try {
    const { images, legacyImage } = normalizeImages(req.body, req.file);

    let updateData = {
      ...req.body,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      discount: Number(req.body.discount)
    };

    // Only overwrite images/image when the client actually sent an images
    // array or a new file — otherwise leave the product's existing images
    // untouched (e.g. a settings-only edit shouldn't wipe the gallery).
    if (Array.isArray(req.body.images) || req.file) {
      updateData.images = images;
      updateData.image = legacyImage;
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