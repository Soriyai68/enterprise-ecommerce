const cartService = require('../services/cartService');
const { successResponse } = require('../../../common/utils/response');
const asyncHandler = require('../../../common/utils/asyncHandler');

/**
 * @desc    Get or create user's cart
 * @route   GET /api/v1/cart
 * @access  Private
 */
exports.getCart = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const cart = await cartService.getOrCreateCart(userId);

  successResponse(res, {
    message: 'Cart retrieved successfully',
    data: { cart }
  });
});

/**
 * @desc    Get cart summary
 * @route   GET /api/v1/cart/summary
 * @access  Private
 */
exports.getCartSummary = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const result = await cartService.getCartSummary(userId);

  successResponse(res, {
    message: 'Cart summary retrieved successfully',
    data: result
  });
});

/**
 * @desc    Add item to cart
 * @route   POST /api/v1/cart/items
 * @access  Private
 */
exports.addToCart = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const { product_id, quantity } = req.body;

  const cart = await cartService.addToCart(userId, product_id, quantity);

  successResponse(res, {
    message: 'Item added to cart successfully',
    data: { cart },
    statusCode: 201
  });
});

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/v1/cart/items/:itemId
 * @access  Private
 */
exports.updateCartItem = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  const cart = await cartService.updateCartItem(userId, itemId, quantity);

  successResponse(res, {
    message: 'Cart item updated successfully',
    data: { cart }
  });
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/v1/cart/items/:itemId
 * @access  Private
 */
exports.removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const { itemId } = req.params;

  const cart = await cartService.removeFromCart(userId, itemId);

  successResponse(res, {
    message: 'Item removed from cart successfully',
    data: { cart }
  });
});

/**
 * @desc    Clear cart
 * @route   DELETE /api/v1/cart
 * @access  Private
 */
exports.clearCart = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const cart = await cartService.clearCart(userId);

  successResponse(res, {
    message: 'Cart cleared successfully',
    data: { cart }
  });
});

/**
 * @desc    Merge guest cart with user cart
 * @route   POST /api/v1/cart/merge
 * @access  Private
 */
exports.mergeCarts = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const { guest_cart_id } = req.body;

  const cart = await cartService.mergeCarts(userId, guest_cart_id);

  successResponse(res, {
    message: 'Carts merged successfully',
    data: { cart }
  });
});
