require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/database');
const validateEnv = require('./config/env');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const tripRoutes = require('./routes/tripRoutes');

// Validate environment variables on startup
validateEnv();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Security Middleware ─────────────────────────────────────────────────────
app.use(helmet());

const frontendUrl = process.env.FRONTEND_URL;
if (!frontendUrl && process.env.NODE_ENV === 'production') {
  throw new Error('FRONTEND_URL environment variable is required in production');
}

app.use(
  cors({
    origin: frontendUrl || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ─── Logging ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Trao API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use(notFound);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Trao API running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;
