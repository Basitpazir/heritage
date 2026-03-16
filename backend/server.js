const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('./config/passport');

dotenv.config();

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────

// Added a wildcard check and explicit Vercel support
const allowedOrigins = [
  'http://localhost:5173',
  'https://heritage-six-delta.vercel.app',
  'https://heritage-frontend-gamma.vercel.app',
  'https://heritage-frontend-nnxykces8-basitpazirs-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps)
    if (!origin) return callback(null, true);
    
    // Check if origin is in the list OR if it's a vercel.app subdomain
    const isAllowed = allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app');
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('CORS blocked: Origin not allowed'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// IMPORTANT: Manual Pre-flight handler (Vercel fix)
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  return res.sendStatus(200);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session (Adjusted for cross-site cookies on Vercel)
app.use(session({
  secret: process.env.JWT_SECRET || 'secret_placeholder',
  resave: false,
  saveUninitialized: false,
  proxy: true, 
  cookie: {
    secure: true, 
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// ─── Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/admin',    require('./routes/admin'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/settings', require('./routes/settings'));

app.get('/', (req, res) => {
  res.json({ message: '🌸 Heritage Perfume API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas connected');
    const PORT = process.env.PORT || 5000;
    // Vercel handles the listening, so we only listen locally
    if (process.env.NODE_ENV !== 'production') {
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    }
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
  });

module.exports = app;