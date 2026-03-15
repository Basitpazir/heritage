const express = require('express');
const router = express.Router();
const StoreSettings = require('../models/StoreSettings');
const { protectAdmin } = require('../middleware/auth');

// Helper — get or create the single settings document
const getSettings = async () => {
  let settings = await StoreSettings.findOne();
  if (!settings) settings = await StoreSettings.create({});
  return settings;
};

// ─────────────────────────────────────────────────────────────
// GET /api/settings
// Called by: App.jsx on load (to populate storeInfo + heroImages)
// Public — no auth needed
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const settings = await getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// PUT /api/settings/store
// Called by: Admin.jsx Settings tab "Save Configuration"
// Body: { email, phone, address, shippingPolicy, returnPolicy }
// ─────────────────────────────────────────────────────────────
router.put('/store', protectAdmin, async (req, res) => {
  try {
    const { email, phone, address, shippingPolicy, returnPolicy } = req.body;
    const settings = await getSettings();

    if (email)          settings.email          = email;
    if (phone)          settings.phone          = phone;
    if (address)        settings.address        = address;
    if (shippingPolicy) settings.shippingPolicy = shippingPolicy;
    if (returnPolicy)   settings.returnPolicy   = returnPolicy;

    await settings.save();
    res.json({ message: 'Store settings saved.', settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// PUT /api/settings/hero
// Called by: Admin.jsx Design tab — hero image add/remove + zoom
// Body: { heroImages: [...urls], heroZoom: 100 }
// ─────────────────────────────────────────────────────────────
router.put('/hero', protectAdmin, async (req, res) => {
  try {
    const { heroImages, heroZoom } = req.body;
    const settings = await getSettings();

    if (heroImages !== undefined) settings.heroImages = heroImages;
    if (heroZoom   !== undefined) settings.heroZoom   = heroZoom;

    await settings.save();
    res.json({ message: 'Hero settings saved.', settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
