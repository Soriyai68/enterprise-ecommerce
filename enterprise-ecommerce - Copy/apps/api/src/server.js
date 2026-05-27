const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// Import configurations
const config = require('./common/config');
const logger = require('./common/utils/logger');
const { errorHandler, AppError } = require('./common/middleware/errorHandler');
const { testConnection } = require('./common/config/database');
const { connectRedis } = require('./common/config/redis');

// Initialize Express app
const app = express();

// Security Middleware
app.use(helmet());
app.use(cors(config.cors));

// Rate limiting
const limiter = rateLimit(config.rateLimit);
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: { write: message => logger.info(message.trim()) }
  }));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    environment: config.env
  });
});

// API Routes
app.get('/api', (req, res) => {
  res.json({
    status: 'success',
    message: 'Enterprise E-Commerce API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      orders: '/api/orders',
      payments: '/api/payments',
      analytics: '/api/analytics'
    }
  });
});

// Module routes (to be implemented)
app.use('/api/auth', require('./modules/auth/routes'));
// app.use('/api/users', require('./modules/users/routes'));
// app.use('/api/products', require('./modules/products/routes'));
// app.use('/api/orders', require('./modules/orders/routes'));
// app.use('/api/payments', require('./modules/payments/routes'));
// app.use('/api/analytics', require('./modules/analytics/routes'));

// 404 handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Connect to Redis
    await connectRedis();
    
    // Start listening
    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`);
      logger.info(`📝 Environment: ${config.env}`);
      logger.info(`🌐 API URL: ${config.apiUrl}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        logger.info('Process terminated!');
      });
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
