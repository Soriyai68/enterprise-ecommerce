const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { categorySchemas, validateRequest } = require('../validators/categoryValidator');
const { authenticate } = require('../../../common/middleware/auth');
// const { authorize } = require('../../../common/middleware/auth'); // Uncomment when RBAC is needed

/**
 * @route   POST /api/v1/categories/bulk
 * @desc    Bulk create categories
 * @access  Private/Admin
 */
router.post(
  '/bulk',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  validateRequest(categorySchemas.bulkCreateCategories, 'body'),
  categoryController.bulkCreateCategories
);

/**
 * @route   POST /api/v1/categories
 * @desc    Create a new category
 * @access  Private/Admin
 */
router.post(
  '/',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  validateRequest(categorySchemas.createCategory, 'body'),
  categoryController.createCategory
);

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories with pagination and search
 * @access  Public
 */
router.get(
  '/',
  validateRequest(categorySchemas.queryParams, 'query'),
  categoryController.getAllCategories
);

/**
 * @route   GET /api/v1/categories/:id
 * @desc    Get single category by ID
 * @access  Public
 */
router.get(
  '/:id',
  validateRequest(categorySchemas.categoryId, 'params'),
  categoryController.getCategoryById
);

/**
 * @route   PUT /api/v1/categories/:id
 * @desc    Update category
 * @access  Private/Admin
 */
router.put(
  '/:id',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  validateRequest(categorySchemas.categoryId, 'params'),
  validateRequest(categorySchemas.updateCategory, 'body'),
  categoryController.updateCategory
);

/**
 * @route   DELETE /api/v1/categories/:id
 * @desc    Delete category (soft delete)
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  validateRequest(categorySchemas.categoryId, 'params'),
  categoryController.deleteCategory
);

/**
 * @route   GET /api/v1/categories/:id/stats
 * @desc    Get category statistics
 * @access  Private/Admin
 */
router.get(
  '/:id/stats',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  validateRequest(categorySchemas.categoryId, 'params'),
  categoryController.getCategoryStats
);

module.exports = router;
