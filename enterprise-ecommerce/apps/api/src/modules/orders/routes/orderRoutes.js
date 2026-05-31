const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate } = require('../../../common/middleware/auth');
// const { authorize } = require('../../../common/middleware/auth'); // Uncomment when RBAC is needed

/**
 * @route   POST /api/orders/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  orderController.createOrder
);

/**
 * @route   GET /api/orders/orders
 * @desc    Get all orders
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  orderController.getOrders
);

/**
 * @route   GET /api/orders/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  orderController.getOrderById
);

/**
 * @route   PUT /api/orders/orders/:id
 * @desc    Update order
 * @access  Private/Admin
 */
router.put(
  '/:id',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  orderController.updateOrder
);

/**
 * @route   POST /api/orders/orders/:id/cancel
 * @desc    Cancel order
 * @access  Private
 */
router.post(
  '/:id/cancel',
  authenticate,
  orderController.cancelOrder
);

/**
 * @route   GET /api/orders/orders/:id/tracking
 * @desc    Get order tracking information
 * @access  Private
 */
router.get(
  '/:id/tracking',
  authenticate,
  orderController.getOrderTracking
);

/**
 * @route   DELETE /api/orders/orders/:id
 * @desc    Delete order (soft delete)
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  orderController.deleteOrder
);

module.exports = router;
