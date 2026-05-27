const analyticsService = require('../services/analyticsService');
const { successResponse } = require('../../../common/utils/response');
const asyncHandler = require('../../../common/utils/asyncHandler');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/v1/analytics/dashboard
 * @access  Private/Admin
 */
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const { start_date, end_date } = req.query;
  const stats = await analyticsService.getDashboardStats(start_date, end_date);

  successResponse(res, {
    message: 'Dashboard statistics retrieved successfully',
    data: stats
  });
});

/**
 * @desc    Get sales analytics
 * @route   GET /api/v1/analytics/sales
 * @access  Private/Admin
 */
exports.getSalesAnalytics = asyncHandler(async (req, res) => {
  const { period = 'daily', start_date, end_date } = req.query;
  const analytics = await analyticsService.getSalesAnalytics(period, start_date, end_date);

  successResponse(res, {
    message: 'Sales analytics retrieved successfully',
    data: analytics
  });
});

/**
 * @desc    Get customer analytics
 * @route   GET /api/v1/analytics/customers
 * @access  Private/Admin
 */
exports.getCustomerAnalytics = asyncHandler(async (req, res) => {
  const { start_date, end_date } = req.query;
  const analytics = await analyticsService.getCustomerAnalytics(start_date, end_date);

  successResponse(res, {
    message: 'Customer analytics retrieved successfully',
    data: analytics
  });
});

/**
 * @desc    Get product analytics
 * @route   GET /api/v1/analytics/products
 * @access  Private/Admin
 */
exports.getProductAnalytics = asyncHandler(async (req, res) => {
  const { start_date, end_date } = req.query;
  const analytics = await analyticsService.getProductAnalytics(start_date, end_date);

  successResponse(res, {
    message: 'Product analytics retrieved successfully',
    data: analytics
  });
});

/**
 * @desc    Get cart analytics
 * @route   GET /api/v1/analytics/carts
 * @access  Private/Admin
 */
exports.getCartAnalytics = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getCartAnalytics();

  successResponse(res, {
    message: 'Cart analytics retrieved successfully',
    data: analytics
  });
});

/**
 * @desc    Get revenue report
 * @route   GET /api/v1/analytics/revenue-report
 * @access  Private/Admin
 */
exports.getRevenueReport = asyncHandler(async (req, res) => {
  const { period = 'monthly', year = new Date().getFullYear() } = req.query;
  const report = await analyticsService.getRevenueReport(period, parseInt(year));

  successResponse(res, {
    message: 'Revenue report retrieved successfully',
    data: { report }
  });
});
