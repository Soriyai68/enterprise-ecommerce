const auditService = require('../services/auditService');
const { successResponse, ApiResponse } = require('../../../common/utils/response');
const asyncHandler = require('../../../common/utils/asyncHandler');

/**
 * @desc    Get audit logs with filters
 * @route   GET /api/v1/audit-logs
 * @access  Private/Admin
 */
exports.getAuditLogs = asyncHandler(async (req, res) => {
  const result = await auditService.getAuditLogs(req.query);

  ApiResponse.paginated(res, { logs: result.logs }, result.pagination, 'Audit logs retrieved successfully');
});

/**
 * @desc    Get audit history for specific entity
 * @route   GET /api/v1/audit-logs/entity/:entityType/:entityId
 * @access  Private/Admin
 */
exports.getEntityAuditHistory = asyncHandler(async (req, res) => {
  const { entityType, entityId } = req.params;
  const logs = await auditService.getEntityAuditHistory(entityType, entityId);

  successResponse(res, {
    message: 'Entity audit history retrieved successfully',
    data: { logs }
  });
});

/**
 * @desc    Get user activity logs
 * @route   GET /api/v1/audit-logs/user/:userId
 * @access  Private/Admin or Own User
 */
exports.getUserActivity = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user?.userId || req.user?.id;
  const userRole = req.user?.role;

  // Users can only view their own activity unless they're admin
  if (userRole !== 'admin' && userId !== currentUserId) {
    return res.status(403).json({
      status: 'error',
      message: 'You can only view your own activity'
    });
  }

  const result = await auditService.getUserActivity(userId, req.query);

  ApiResponse.paginated(res, { logs: result.logs }, result.pagination, 'User activity retrieved successfully');
});

/**
 * @desc    Get audit statistics
 * @route   GET /api/v1/audit-logs/stats
 * @access  Private/Admin
 */
exports.getAuditStats = asyncHandler(async (req, res) => {
  const stats = await auditService.getAuditStats(req.query);

  successResponse(res, {
    message: 'Audit statistics retrieved successfully',
    data: stats
  });
});

/**
 * @desc    Get recent activity
 * @route   GET /api/v1/audit-logs/recent
 * @access  Private/Admin
 */
exports.getRecentActivity = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 20;
  const logs = await auditService.getRecentActivity(limit);

  successResponse(res, {
    message: 'Recent activity retrieved successfully',
    data: { logs }
  });
});

/**
 * @desc    Get my activity logs
 * @route   GET /api/v1/audit-logs/my-activity
 * @access  Private
 */
exports.getMyActivity = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const result = await auditService.getUserActivity(userId, req.query);

  ApiResponse.paginated(res, { logs: result.logs }, result.pagination, 'Your activity retrieved successfully');
});
