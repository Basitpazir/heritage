const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// ── Protect user routes ───────────────────────────────────────
exports.protectUser = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) return res.status(401).json({ error: 'Not authorized. Please login.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ error: 'User not found.' });
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid or expired.' });
  }
};

// ── Protect admin routes (uses separate ADMIN_JWT_SECRET) ─────
exports.protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) return res.status(401).json({ error: 'Admin access required.' });

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    req.admin = await Admin.findById(decoded.id);
    if (!req.admin) return res.status(401).json({ error: 'Admin not found.' });
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Admin token invalid or expired.' });
  }
};