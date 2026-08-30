const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const jwt = require('jsonwebtoken');

// Simple admin-auth guard, matching the pattern used by your other admin-protected routes.
// Adjust the header/secret check here if your existing admin routes do it differently.
const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// GET /api/blog?limit=3 — list posts, newest first, optional limit
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10);
    let query = BlogPost.find().sort({ date: -1, createdAt: -1 });
    if (Number.isFinite(limit) && limit > 0) query = query.limit(limit);
    const posts = await query.exec();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/blog/:slug — single post by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug.toLowerCase() });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/blog — create a post (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, slug, excerpt, content, coverImage, date } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const post = await BlogPost.create({ title, slug, excerpt, content, coverImage, date });
    res.status(201).json(post);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'A post with that slug already exists' });
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/blog/:id — update a post (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/blog/:id — delete a post (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;