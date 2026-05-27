const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const { brandSchemas, validateRequest } = require('../validators/brandValidator');
const { authenticate } = require('../../../common/middleware/auth');
// const { authorize } = require('../../../common/middleware/auth'); // Uncomment when RBAC is needed

/**
 * @route   POST /api/v1/brands
 * @desc    Create a new brand
 * @access  Private/Admin
 */
router.post(
  '/',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  validateRequest(brandSchemas.createBrand, 'body'),
  brandController.createBrand
);

/**
 * @route   GET /api/v1/brands
 * @desc    Get all brands with pagination and search
 * @access  Public
 */
router.get(
  '/',
  validateRequest(brandSchemas.queryParams, 'query'),
  brandController.getAllBrands
);

/**
 * @route   GET /api/v1/brands/:id
 * @desc    Get single brand by ID
 * @access  Public
 */
router.get(
  '/:id',
  validateRequest(brandSchemas.brandId, 'params'),
  brandController.getBrandById
);

/**
 * @route   PUT /api/v1/brands/:id
 * @desc    Update brand
 * @access  Private/Admin
 */
router.put(
  '/:id',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  validateRequest(brandSchemas.brandId, 'params'),
  validateRequest(brandSchemas.updateBrand, 'body'),
  brandController.updateBrand
);

/**
 * @route   DELETE /api/v1/brands/:id
 * @desc    Delete brand
 * @access  Private/Admin
 */
router.delete(
  '/:id',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  validateRequest(brandSchemas.brandId, 'params'),
  brandController.deleteBrand
);

/**
 * @route   GET /api/v1/brands/:id/stats
 * @desc    Get brand statistics
 * @access  Private/Admin
 */
router.get(
  '/:id/stats',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  validateRequest(brandSchemas.brandId, 'params'),
  brandController.getBrandStats
);

module.exports = router;
