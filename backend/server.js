const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

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
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5273',
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

// ─── Database connection (serverless-safe) ─────────────────────────────────
// On Vercel, this whole module can be re-invoked on every cold start. Without
// caching, each cold start opened a brand new mongoose.connect() and exported
// `app` immediately — before the connection promise resolved — so the first
// query on a fresh instance would sit in Mongoose's command buffer waiting on
// a connection that hadn't finished handshaking yet, and time out after 10s.
//
// The fix: cache the connection promise on the global object (survives across
// invocations on a warm instance) and gate every request behind it, so a
// request never reaches a route handler before the DB is actually connected.
let cachedConnection = global._mongooseConnection;

if (!cachedConnection) {
  mongoose.set('bufferCommands', false); // fail fast instead of buffering silently for 10s
  cachedConnection = global._mongooseConnection = mongoose
    .connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10,
    })
    .then((conn) => {
      console.log('✅ MongoDB Atlas connected');
      return conn;
    })
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err.message);
      // Reset the cache on failure so the NEXT request retries the connection
      // instead of being stuck reusing a rejected promise forever.
      global._mongooseConnection = null;
      throw err;
    });
}

// Gate all /api routes behind the connection being ready. If the DB isn't
// connected yet, wait for it here (once) instead of letting Mongoose buffer
// the query inside the route handler and silently time out later.
app.use('/api', async (req, res, next) => {
  try {
    await cachedConnection;
    next();
  } catch (err) {
    res.status(503).json({ error: 'Database connection unavailable. Please try again.' });
  }
});

// ─── Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/admin',    require('./routes/admin'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/blog',     require('./routes/blog'));

app.get('/', (req, res) => {
  res.json({ message: '🌸 Heritage Perfume API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Local dev only — Vercel handles invocation of the exported app directly and
// never calls app.listen(), so this block is skipped in production.
if (process.env.NODE_ENV !== 'production') {
  cachedConnection
    .then(() => {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch(() => {
      // connection error already logged above
    });
}

module.exports = app;