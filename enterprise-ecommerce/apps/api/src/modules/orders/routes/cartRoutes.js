const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { cartSchemas, validateRequest } = require('../validators/cartValidator');
const { authenticate } = require('../../../common/middleware/auth');

/**
 * @route   GET /api/v1/cart/summary
 * @desc    Get cart summary
 * @access  Private
 */
router.get(
  '/summary',
  authenticate,
  cartController.getCartSummary
);

/**
 * @route   GET /api/v1/cart
 * @desc    Get or create user's cart
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  cartController.getCart
);

/**
 * @route   POST /api/v1/cart/items
 * @desc    Add item to cart
 * @access  Private
 */
router.post(
  '/items',
  authenticate,
  validateRequest(cartSchemas.addToCart, 'body'),
  cartController.addToCart
);

/**
 * @route   PUT /api/v1/cart/items/:itemId
 * @desc    Update cart item quantity
 * @access  Private
 */
router.put(
  '/items/:itemId',
  authenticate,
  validateRequest(cartSchemas.cartItemId, 'params'),
  validateRequest(cartSchemas.updateCartItem, 'body'),
  cartController.updateCartItem
);

/**
 * @route   DELETE /api/v1/cart/items/:itemId
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete(
  '/items/:itemId',
  authenticate,
  validateRequest(cartSchemas.cartItemId, 'params'),
  cartController.removeFromCart
);

/**
 * @route   DELETE /api/v1/cart
 * @desc    Clear cart
 * @access  Private
 */
router.delete(
  '/',
  authenticate,
  cartController.clearCart
);

/**
 * @route   POST /api/v1/cart/merge
 * @desc    Merge guest cart with user cart
 * @access  Private
 */
router.post(
  '/merge',
  authenticate,
  cartController.mergeCarts
);

module.exports = router;
