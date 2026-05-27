const paymentService = require('../services/paymentService');
const { successResponse, ApiResponse } = require('../../../common/utils/response');
const asyncHandler = require('../../../common/utils/asyncHandler');

/**
 * @desc    Create payment
 * @route   POST /api/v1/payments
 * @access  Private
 */
exports.createPayment = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const payment = await paymentService.createPayment(req.body, userId);

  successResponse(res, {
    message: 'Payment created successfully',
    data: { payment },
    statusCode: 201
  });
});

/**
 * @desc    Process payment
 * @route   POST /api/v1/payments/:id/process
 * @access  Private
 */
exports.processPayment = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const payment = await paymentService.processPayment(req.params.id, req.body, userId);

  successResponse(res, {
    message: payment.payment_status === 'completed' ? 'Payment processed successfully' : 'Payment processing failed',
    data: { payment }
  });
});

/**
 * @desc    Get all payments
 * @route   GET /api/v1/payments
 * @access  Private/Admin
 */
exports.getAllPayments = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const userRole = req.user?.role;
  const result = await paymentService.getAllPayments(req.query, userId, userRole);

  ApiResponse.paginated(res, { payments: result.payments }, result.pagination, 'Payments retrieved successfully');
});

/**
 * @desc    Get payment by ID
 * @route   GET /api/v1/payments/:id
 * @access  Private
 */
exports.getPaymentById = asyncHandler(async (req, res) => {
  const payment = await paymentService.getPaymentById(req.params.id);

  successResponse(res, {
    message: 'Payment retrieved successfully',
    data: { payment }
  });
});

/**
 * @desc    Refund payment
 * @route   POST /api/v1/payments/:id/refund
 * @access  Private/Admin
 */
exports.refundPayment = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const payment = await paymentService.refundPayment(req.params.id, req.body, userId);

  successResponse(res, {
    message: 'Payment refunded successfully',
    data: { payment }
  });
});

/**
 * @desc    Get payment statistics
 * @route   GET /api/v1/payments/stats
 * @access  Private/Admin
 */
exports.getPaymentStats = asyncHandler(async (req, res) => {
  const stats = await paymentService.getPaymentStats(req.query);

  successResponse(res, {
    message: 'Payment statistics retrieved successfully',
    data: stats
  });
});
