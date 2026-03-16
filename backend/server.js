const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('./config/passport');

dotenv.config();

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────

const allowedOrigins = [
  'http://localhost:5173',
  'https://heritage-six-delta.vercel.app',
  'https://heritage-frontend-gamma.vercel.app',
  'https://heritage-frontend-nnxykces8-basitpazirs-projects.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS blocked: Origin not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle pre-flight OPTIONS requests for all routes
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session (Adjusted for cross-site cookies on Vercel)
app.use(session({
  secret: process.env.JWT_SECRET || 'secret_placeholder',
  resave: false,
  saveUninitialized: false,
  proxy: true, // Required for Vercel
  cookie: {
    secure: true, // Must be true for 'none' sameSite
    sameSite: 'none' // Required for cross-domain cookies (frontend vs backend)
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
    if (process.env.NODE_ENV !== 'production') {
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    }
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
  });

module.exports = app;