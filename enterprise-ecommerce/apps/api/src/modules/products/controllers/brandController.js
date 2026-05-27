const brandService = require('../services/brandService');
const { successResponse, ApiResponse } = require('../../../common/utils/response');
const asyncHandler = require('../../../common/utils/asyncHandler');

/**
 * @desc    Create a new brand
 * @route   POST /api/v1/brands
 * @access  Private/Admin
 */
exports.createBrand = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const brand = await brandService.createBrand(req.body, userId);
  
  successResponse(res, {
    message: 'Brand created successfully',
    data: { brand },
    statusCode: 201
  });
});

/**
 * @desc    Get all brands with pagination and search
 * @route   GET /api/v1/brands
 * @access  Public
 */
exports.getAllBrands = asyncHandler(async (req, res) => {
  const result = await brandService.getAllBrands(req.query);
  
  ApiResponse.paginated(res, { brands: result.brands }, result.pagination, 'Brands retrieved successfully');
});

/**
 * @desc    Get single brand by ID
 * @route   GET /api/v1/brands/:id
 * @access  Public
 */
exports.getBrandById = asyncHandler(async (req, res) => {
  const brand = await brandService.getBrandById(req.params.id);
  
  successResponse(res, {
    message: 'Brand retrieved successfully',
    data: { brand }
  });
});

/**
 * @desc    Update brand
 * @route   PUT /api/v1/brands/:id
 * @access  Private/Admin
 */
exports.updateBrand = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const brand = await brandService.updateBrand(req.params.id, req.body, userId);
  
  successResponse(res, {
    message: 'Brand updated successfully',
    data: { brand }
  });
});

/**
 * @desc    Delete brand (soft delete)
 * @route   DELETE /api/v1/brands/:id
 * @access  Private/Admin
 */
exports.deleteBrand = asyncHandler(async (req, res) => {
  const userId = req.user?.userId || req.user?.id;
  const result = await brandService.deleteBrand(req.params.id, userId);
  
  successResponse(res, {
    message: result.message,
    data: null
  });
});

/**
 * @desc    Get brand statistics
 * @route   GET /api/v1/brands/:id/stats
 * @access  Private/Admin
 */
exports.getBrandStats = asyncHandler(async (req, res) => {
  const result = await brandService.getBrandStats(req.params.id);
  
  successResponse(res, {
    message: 'Brand statistics retrieved successfully',
    data: result
  });
});
