const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../../../common/middleware/auth');
// const { authorize } = require('../../../common/middleware/auth'); // Uncomment when RBAC is needed

/**
 * @route   GET /api/v1/payments/stats
 * @desc    Get payment statistics
 * @access  Private/Admin
 */
router.get(
  '/stats',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  paymentController.getPaymentStats
);

/**
 * @route   POST /api/v1/payments
 * @desc    Create payment
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  paymentController.createPayment
);

/**
 * @route   GET /api/v1/payments
 * @desc    Get all payments
 * @access  Private/Admin
 */
router.get(
  '/',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  paymentController.getAllPayments
);

/**
 * @route   GET /api/v1/payments/:id
 * @desc    Get payment by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  paymentController.getPaymentById
);

/**
 * @route   POST /api/v1/payments/:id/process
 * @desc    Process payment
 * @access  Private
 */
router.post(
  '/:id/process',
  authenticate,
  paymentController.processPayment
);

/**
 * @route   POST /api/v1/payments/:id/refund
 * @desc    Refund payment
 * @access  Private/Admin
 */
router.post(
  '/:id/refund',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  paymentController.refundPayment
);

module.exports = router;
