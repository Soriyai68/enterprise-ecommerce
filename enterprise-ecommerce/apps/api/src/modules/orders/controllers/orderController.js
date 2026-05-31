const orderService = require('../services/orderService');
const { successResponse } = require('../../../common/utils/response');
const asyncHandler = require('../../../common/utils/asyncHandler');
const { AppError } = require('../../../common/middleware/errorHandler');

/**
 * @desc    Create a new order from cart
 * @route   POST /api/orders
 * @access  Private
 */
exports.createOrder = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const orderData = req.body;

  const order = await orderService.createOrderFromCart(userId, orderData);

  successResponse(res, {
    message: 'Order created successfully',
    data: { order },
    statusCode: 201
  });
});

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @access  Private
 */
exports.getOrders = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const userRole = req.user?.role;
  const queryParams = req.query;

  const result = await orderService.getAllOrders(queryParams, userId, userRole);

  successResponse(res, {
    message: 'Orders retrieved successfully',
    data: result
  });
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrderById = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const userRole = req.user?.role;
  const { id } = req.params;

  const order = await orderService.getOrderById(id, userId, userRole);

  successResponse(res, {
    message: 'Order retrieved successfully',
    data: { order }
  });
});

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id
 * @access  Private/Admin
 */
exports.updateOrder = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const userRole = req.user?.role;
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new AppError('Status is required', 400);
  }

  const order = await orderService.updateOrderStatus(id, status, userId, userRole);

  successResponse(res, {
    message: 'Order status updated successfully',
    data: { order }
  });
});

/**
 * @desc    Cancel order
 * @route   POST /api/orders/:id/cancel
 * @access  Private
 */
exports.cancelOrder = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const userRole = req.user?.role;
  const { id } = req.params;
  const { reason } = req.body;

  const order = await orderService.cancelOrder(id, reason, userId, userRole);

  successResponse(res, {
    message: 'Order cancelled successfully',
    data: { order }
  });
});

/**
 * @desc    Get order tracking information
 * @route   GET /api/orders/:id/tracking
 * @access  Private
 */
exports.getOrderTracking = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const userRole = req.user?.role;
  const { id } = req.params;

  const order = await orderService.getOrderById(id, userId, userRole);

  const trackingInfo = {
    order_id: order.order_id,
    order_number: order.order_number,
    status: order.status,
    order_date: order.order_date,
    shipped_date: order.shipped_date,
    delivered_date: order.delivered_date,
    cancelled_date: order.cancelled_date,
    tracking_history: [
      {
        status: 'pending',
        timestamp: order.order_date,
        description: 'Order placed'
      }
    ]
  };

  // Add more tracking steps based on status
  if (order.status !== 'pending' && order.status !== 'cancelled') {
    trackingInfo.tracking_history.push({
      status: 'confirmed',
      timestamp: order.updatedAt, // Approximation
      description: 'Order confirmed'
    });
  }

  if (order.shipped_date) {
    trackingInfo.tracking_history.push({
      status: 'shipped',
      timestamp: order.shipped_date,
      description: 'Order has been shipped'
    });
  }

  if (order.delivered_date) {
    trackingInfo.tracking_history.push({
      status: 'delivered',
      timestamp: order.delivered_date,
      description: 'Order has been delivered'
    });
  }

  if (order.cancelled_date) {
    trackingInfo.tracking_history.push({
      status: 'cancelled',
      timestamp: order.cancelled_date,
      description: `Order cancelled. Reason: ${order.cancellation_reason || 'N/A'}`
    });
  }

  successResponse(res, {
    message: 'Order tracking information retrieved successfully',
    data: { tracking: trackingInfo }
  });
});

/**
 * @desc    Delete order (soft delete)
 * @route   DELETE /api/orders/:id
 * @access  Private/Admin
 */
exports.deleteOrder = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const userRole = req.user?.role;
  const { id } = req.params;

  const order = await orderService.getOrderById(id, userId, userRole);

  // Only allow admins to delete orders or users to delete their own pending/cancelled orders
  if (userRole !== 'admin' && !['pending', 'cancelled'].includes(order.status)) {
    throw new AppError('You cannot delete an active order', 403);
  }

  await order.destroy({
    defaultValue: {
      deleted_by: userId
    }
  });

  // Since order model has paranoid: true, we might need to manually set deleted_by
  await order.update({ deleted_by: userId });
  await order.destroy();

  successResponse(res, {
    message: 'Order deleted successfully',
    data: null
  });
});
