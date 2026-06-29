const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const { loadProductsFromJSON } = require('./utils/dataLoader');

// Import routes
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const safetyRoutes = require('./routes/safety');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      'https://skinshy.vercel.app',
      process.env.FRONTEND_URL
    ].filter(Boolean).map(o => o.trim().replace(/\/$/, '')); // Strip trailing slashes

    const normalizedOrigin = origin.trim().replace(/\/$/, '');

    // Check if origin is allowed
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Rate limiting setup
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Max 1000 requests per IP per 15 min
  message: { error: 'Too many requests, please try again later' }
});

const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Max 10 requests per IP per minute
  message: { error: 'Rate limit exceeded' }
});

// Middleware
app.use(cors(corsOptions));
app.use(globalLimiter);
app.use('/api/safety/calculate', strictLimiter);
app.use('/api/users/complete-onboarding', strictLimiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Connect to database
connectDB().catch(err => console.error('Failed to connect to database:', err));

// Load products from JSON (if not already in DB) - Commented out to debug
// loadProductsFromJSON();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/safety', safetyRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Skinshy Backend is running' });
});

// Error handling middleware (MUST have exactly 4 parameters)
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;

  // Log internally — NEVER send stack traces to client
  console.error('ERROR:', { status, message: err.message, url: req.path });

  res.status(status).json({
    success: false,
    // Only send generic message to client — never err.stack
    error: status === 500 ? 'Internal Server Error' : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Skinshy Backend running on port ${PORT}`);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app;
