const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { protectAdmin } = require('../middleware/auth');
 
const generateAdminToken = (id) =>
  jwt.sign({ id }, process.env.ADMIN_JWT_SECRET, { expiresIn: process.env.ADMIN_JWT_EXPIRE || '1d' });
 
// ─────────────────────────────────────────────────────────────
// POST /api/admin/register
// First-time admin setup — mirrors AdminAuth.jsx "Initialize Admin"
// Only works if NO admin exists yet (prevents multiple admins)
// ─────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const existing = await Admin.findOne();
    if (existing) {
      return res.status(400).json({ error: 'Admin already exists. Please login.' });
    }
 
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }
 
    const admin = await Admin.create({ name, email, password });
 
    res.status(201).json({
      token: generateAdminToken(admin._id),
      admin: { _id: admin._id, name: admin.name, email: admin.email }
    });
 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// ─────────────────────────────────────────────────────────────
// POST /api/admin/login
// Matches AdminAuth.jsx "Verify & Enter" flow
// ─────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
 
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
 
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: 'Unauthorized: Admin credentials do not match.' });
    }
 
    res.json({
      token: generateAdminToken(admin._id),
      admin: { _id: admin._id, name: admin.name, email: admin.email }
    });
 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// ─────────────────────────────────────────────────────────────
// GET /api/admin/me  — check if admin exists (for AdminAuth.jsx)
// ─────────────────────────────────────────────────────────────
router.get('/me', protectAdmin, async (req, res) => {
  res.json({ admin: { _id: req.admin._id, name: req.admin.name, email: req.admin.email } });
});
 
// ─────────────────────────────────────────────────────────────
// GET /api/admin/exists  — called on AdminAuth.jsx mount to
// determine whether to show "Create Admin" or "Login" form
// ─────────────────────────────────────────────────────────────
router.get('/exists', async (req, res) => {
  const admin = await Admin.findOne().select('_id');
  res.json({ exists: !!admin });
});
 
module.exports = router;
 