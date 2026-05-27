const jwt = require('jsonwebtoken');
const config = require('../config');
const { AppError } = require('./errorHandler');

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('No token provided. Please login.', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Attach user to request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please login again.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired. Please login again.', 401));
    }
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

module.exports = { authenticate, authorize };
