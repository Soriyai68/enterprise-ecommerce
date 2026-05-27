const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { authenticate } = require('../../../common/middleware/auth');
// const { authorize } = require('../../../common/middleware/auth'); // Uncomment when RBAC is needed

/**
 * @route   GET /api/v1/audit-logs/my-activity
 * @desc    Get current user's activity logs
 * @access  Private
 */
router.get(
  '/my-activity',
  authenticate,
  auditController.getMyActivity
);

/**
 * @route   GET /api/v1/audit-logs/recent
 * @desc    Get recent activity
 * @access  Private/Admin
 */
router.get(
  '/recent',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  auditController.getRecentActivity
);

/**
 * @route   GET /api/v1/audit-logs/stats
 * @desc    Get audit statistics
 * @access  Private/Admin
 */
router.get(
  '/stats',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  auditController.getAuditStats
);

/**
 * @route   GET /api/v1/audit-logs/entity/:entityType/:entityId
 * @desc    Get audit history for specific entity
 * @access  Private/Admin
 */
router.get(
  '/entity/:entityType/:entityId',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  auditController.getEntityAuditHistory
);

/**
 * @route   GET /api/v1/audit-logs/user/:userId
 * @desc    Get user activity logs
 * @access  Private/Admin or Own User
 */
router.get(
  '/user/:userId',
  authenticate,
  auditController.getUserActivity
);

/**
 * @route   GET /api/v1/audit-logs
 * @desc    Get all audit logs with filters
 * @access  Private/Admin
 */
router.get(
  '/',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  auditController.getAuditLogs
);

module.exports = router;
