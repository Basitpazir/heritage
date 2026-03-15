const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('./config/passport');

dotenv.config();

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://heritage-frontend-gamma.vercel.app',
    'https://heritage-frontend-nnxykces8-basitpazirs-projects.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session (required for passport)
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// ─── Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/admin',    require('./routes/admin'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/settings', require('./routes/settings'));

// ─── Health Check ──────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🌸 Heritage Perfume API is running' });
});

// ─── Error Handler ─────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// ─── Connect & Listen ──────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;