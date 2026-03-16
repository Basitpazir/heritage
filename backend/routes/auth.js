const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const { protectUser } = require('../middleware/auth');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// ─── Register ────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required.' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: 'Email is already registered.' });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Login ───────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required.' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: 'Invalid email or password.' });

    res.json({
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Get current user ─────────────────────────────────────────
router.get('/me', protectUser, async (req, res) => {
  res.json(req.user);
});

// ─── Update profile ───────────────────────────────────────────
router.put('/profile', protectUser, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    );
    res.json({ message: 'Profile updated.', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Google OAuth ─────────────────────────────────────────────

// Step 1 — Redirect to Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Step 2 — Google redirects back here
// UPDATED: Path changed from /google/callback to /callback/google to match Google Cloud Console
router.get('/callback/google',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user._id);

    // UPDATED: Dynamically choose between Localhost (for dev) and Vercel (for production)
    const frontendURL = process.env.NODE_ENV === 'production' 
      ? "https://heritage-six-delta.vercel.app" 
      : "http://localhost:5173";

    // Redirect to the success page with the token
    res.redirect(`${frontendURL}/auth/google/success?token=${token}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}&id=${req.user._id}`);
  }
);

module.exports = router;