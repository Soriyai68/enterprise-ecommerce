const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { productSchemas, validateRequest } = require('../validators/productValidator');
const { authenticate } = require('../../../common/middleware/auth');
// const { authorize } = require('../../../common/middleware/auth'); // Uncomment when RBAC is needed

/**
 * @route   GET /api/v1/products/featured
 * @desc    Get featured products
 * @access  Public
 */
router.get(
  '/featured',
  productController.getFeaturedProducts
);

/**
 * @route   GET /api/v1/products/slug/:slug
 * @desc    Get single product by slug
 * @access  Public
 */
router.get(
  '/slug/:slug',
  productController.getProductBySlug
);

/**
 * @route   POST /api/v1/products
 * @desc    Create a new product
 * @access  Private/Admin/Vendor
 */
router.post(
  '/',
  authenticate,
  // authorize('admin', 'vendor'), // Uncomment when RBAC is implemented
  validateRequest(productSchemas.createProduct, 'body'),
  productController.createProduct
);

/**
 * @route   GET /api/v1/products
 * @desc    Get all products with pagination, search, and filters
 * @access  Public
 */
router.get(
  '/',
  validateRequest(productSchemas.queryParams, 'query'),
  productController.getAllProducts
);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get(
  '/:id',
  validateRequest(productSchemas.productId, 'params'),
  productController.getProductById
);

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update product
 * @access  Private/Admin/Vendor
 */
router.put(
  '/:id',
  authenticate,
  // authorize('admin', 'vendor'), // Uncomment when RBAC is implemented
  validateRequest(productSchemas.productId, 'params'),
  validateRequest(productSchemas.updateProduct, 'body'),
  productController.updateProduct
);

/**
 * @route   PATCH /api/v1/products/:id/stock
 * @desc    Update product stock
 * @access  Private/Admin/Vendor
 */
router.patch(
  '/:id/stock',
  authenticate,
  // authorize('admin', 'vendor'), // Uncomment when RBAC is implemented
  validateRequest(productSchemas.productId, 'params'),
  productController.updateStock
);

/**
 * @route   POST /api/v1/products/:id/restore
 * @desc    Restore deleted product
 * @access  Private/Admin
 */
router.post(
  '/:id/restore',
  authenticate,
  // authorize('admin'), // Uncomment when RBAC is implemented
  validateRequest(productSchemas.productId, 'params'),
  productController.restoreProduct
);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete product (soft delete)
 * @access  Private/Admin/Vendor
 */
router.delete(
  '/:id',
  authenticate,
  // authorize('admin', 'vendor'), // Uncomment when RBAC is implemented
  validateRequest(productSchemas.productId, 'params'),
  productController.deleteProduct
);

module.exports = router;
