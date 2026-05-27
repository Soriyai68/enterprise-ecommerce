const categoryService = require('../services/categoryService');
const { successResponse, ApiResponse } = require('../../../common/utils/response');
const asyncHandler = require('../../../common/utils/asyncHandler');

/**
 * @desc    Create a new category
 * @route   POST /api/v1/categories
 * @access  Private/Admin
 */
exports.createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  
  successResponse(res, {
    message: 'Category created successfully',
    data: { category },
    statusCode: 201
  });
});

/**
 * @desc    Get all categories with pagination and search
 * @route   GET /api/v1/categories
 * @access  Public
 */
exports.getAllCategories = asyncHandler(async (req, res) => {
  const result = await categoryService.getAllCategories(req.query);
  
  ApiResponse.paginated(res, { categories: result.categories }, result.pagination, 'Categories retrieved successfully');
});

/**
 * @desc    Get single category by ID
 * @route   GET /api/v1/categories/:id
 * @access  Public
 */
exports.getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  
  successResponse(res, {
    message: 'Category retrieved successfully',
    data: { category }
  });
});

/**
 * @desc    Update category
 * @route   PUT /api/v1/categories/:id
 * @access  Private/Admin
 */
exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  
  successResponse(res, {
    message: 'Category updated successfully',
    data: { category }
  });
});

/**
 * @desc    Delete category
 * @route   DELETE /api/v1/categories/:id
 * @access  Private/Admin
 */
exports.deleteCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.deleteCategory(req.params.id);
  
  successResponse(res, {
    message: result.message,
    data: null
  });
});

/**
 * @desc    Get category statistics
 * @route   GET /api/v1/categories/:id/stats
 * @access  Private/Admin
 */
exports.getCategoryStats = asyncHandler(async (req, res) => {
  const result = await categoryService.getCategoryStats(req.params.id);
  
  successResponse(res, {
    message: 'Category statistics retrieved successfully',
    data: result
  });
});

/**
 * @desc    Bulk create categories
 * @route   POST /api/v1/categories/bulk
 * @access  Private/Admin
 */
exports.bulkCreateCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.bulkCreateCategories(req.body.categories);
  
  successResponse(res, {
    message: `${categories.length} categories created successfully`,
    data: { categories },
    statusCode: 201
  });
});
