const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate } = require('../../../common/middleware/auth');
// const { authorize } = require('../../../common/middleware/auth'); // Uncomment when RBAC is needed

/**
 * @route   GET /api/v1/analytics/dashboard
 * @desc    Get dashboard statistics
 * @access  Private/Admin
 */
router.get(
  '/dashboard',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  analyticsController.getDashboardStats
);

/**
 * @route   GET /api/v1/analytics/sales
 * @desc    Get sales analytics
 * @access  Private/Admin
 */
router.get(
  '/sales',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  analyticsController.getSalesAnalytics
);

/**
 * @route   GET /api/v1/analytics/customers
 * @desc    Get customer analytics
 * @access  Private/Admin
 */
router.get(
  '/customers',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  analyticsController.getCustomerAnalytics
);

/**
 * @route   GET /api/v1/analytics/products
 * @desc    Get product analytics
 * @access  Private/Admin
 */
router.get(
  '/products',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  analyticsController.getProductAnalytics
);

/**
 * @route   GET /api/v1/analytics/carts
 * @desc    Get cart analytics
 * @access  Private/Admin
 */
router.get(
  '/carts',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  analyticsController.getCartAnalytics
);

/**
 * @route   GET /api/v1/analytics/revenue-report
 * @desc    Get revenue report
 * @access  Private/Admin
 */
router.get(
  '/revenue-report',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  analyticsController.getRevenueReport
);

module.exports = router;
