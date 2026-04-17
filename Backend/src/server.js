const express = require('express');
const cors = require('cors');
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
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
      process.env.FRONTEND_URL
    ];
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

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
  const message = err.message || 'Internal Server Error';
  
  console.error('❌ ERROR HANDLER TRIGGERED:', {
    name: err.name,
    status,
    message,
    code: err.code,
    stack: err.stack,
    url: `${req.method} ${req.path}`,
    body: req.body
  });
  
  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { details: err.stack, name: err.name })
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
