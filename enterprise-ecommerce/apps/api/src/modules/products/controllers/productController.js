const productService = require('../services/productService');
const { successResponse, ApiResponse } = require('../../../common/utils/response');
const asyncHandler = require('../../../common/utils/asyncHandler');

/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private/Admin/Vendor
 */
exports.createProduct = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const product = await productService.createProduct(req.body, userId);

  successResponse(res, {
    message: 'Product created successfully',
    data: { product },
    statusCode: 201
  });
});

/**
 * @desc    Get all products with pagination, search, and filters
 * @route   GET /api/v1/products
 * @access  Public
 */
exports.getAllProducts = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query);

  ApiResponse.paginated(res, { products: result.products }, result.pagination, 'Products retrieved successfully');
});

/**
 * @desc    Get single product by ID
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  successResponse(res, {
    message: 'Product retrieved successfully',
    data: { product }
  });
});

/**
 * @desc    Get single product by slug
 * @route   GET /api/v1/products/slug/:slug
 * @access  Public
 */
exports.getProductBySlug = asyncHandler(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);

  successResponse(res, {
    message: 'Product retrieved successfully',
    data: { product }
  });
});

/**
 * @desc    Update product
 * @route   PUT /api/v1/products/:id
 * @access  Private/Admin/Vendor
 */
exports.updateProduct = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const product = await productService.updateProduct(req.params.id, req.body, userId);

  successResponse(res, {
    message: 'Product updated successfully',
    data: { product }
  });
});

/**
 * @desc    Delete product (soft delete)
 * @route   DELETE /api/v1/products/:id
 * @access  Private/Admin/Vendor
 */
exports.deleteProduct = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const result = await productService.deleteProduct(req.params.id, userId);

  successResponse(res, {
    message: result.message,
    data: null
  });
});

/**
 * @desc    Restore deleted product
 * @route   POST /api/v1/products/:id/restore
 * @access  Private/Admin
 */
exports.restoreProduct = asyncHandler(async (req, res) => {
  const product = await productService.restoreProduct(req.params.id);

  successResponse(res, {
    message: 'Product restored successfully',
    data: { product }
  });
});

/**
 * @desc    Update product stock
 * @route   PATCH /api/v1/products/:id/stock
 * @access  Private/Admin/Vendor
 */
exports.updateStock = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const { quantity } = req.body;

  const product = await productService.updateStock(req.params.id, quantity, userId);

  successResponse(res, {
    message: 'Stock updated successfully',
    data: { product }
  });
});

/**
 * @desc    Get featured products
 * @route   GET /api/v1/products/featured
 * @access  Public
 */
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 10;
  const products = await productService.getFeaturedProducts(limit);

  successResponse(res, {
    message: 'Featured products retrieved successfully',
    data: { products }
  });
});
