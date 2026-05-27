const { Category } = require('../models');
const { AppError } = require('../../../common/middleware/errorHandler');
const { Op } = require('sequelize');

class CategoryService {
  /**
   * Create a new category
   */
  async createCategory(categoryData) {
    // Check if category name already exists
    const existingCategory = await Category.findOne({
      where: { category_name: categoryData.category_name }
    });

    if (existingCategory) {
      throw new AppError('Category name already exists', 409);
    }

    const category = await Category.create(categoryData);
    return category;
  }

  /**
   * Get all categories with pagination and search
   */
  async getAllCategories(queryParams) {
    const { page = 1, limit = 10, search = '', sort = '-created_at' } = queryParams;
    
    const offset = (page - 1) * limit;
    
    // Build where clause for search
    const whereClause = search
      ? {
          [Op.or]: [
            { category_name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    // Parse sort parameter
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';

    const { count, rows } = await Category.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortField, sortOrder]]
    });

    return {
      categories: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Get category by ID
   */
  async getCategoryById(categoryId) {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  /**
   * Update category
   */
  async updateCategory(categoryId, updateData) {
    const category = await this.getCategoryById(categoryId);

    // Check if new category name already exists (if category_name is being updated)
    if (updateData.category_name && updateData.category_name !== category.category_name) {
      const existingCategory = await Category.findOne({
        where: { 
          category_name: updateData.category_name,
          category_id: { [Op.ne]: categoryId }
        }
      });

      if (existingCategory) {
        throw new AppError('Category name already exists', 409);
      }
    }

    await category.update(updateData);
    return category;
  }

  /**
   * Delete category
   */
  async deleteCategory(categoryId) {
    const { Brand } = require('../models');
    const category = await this.getCategoryById(categoryId);
    
    // Check if category has associated brands
    const brandCount = await Brand.count({
      where: { category_id: categoryId }
    });
    
    if (brandCount > 0) {
      throw new AppError('Cannot delete category with associated brands. Please reassign or delete the brands first.', 400);
    }
    
    // TODO: Check if category has associated products
    // Uncomment when Product model is created
    // const productCount = await category.countProducts();
    // if (productCount > 0) {
    //   throw new AppError('Cannot delete category with associated products', 400);
    // }

    await category.destroy();
    return { message: 'Category deleted successfully' };
  }

  /**
   * Get category statistics
   */
  async getCategoryStats(categoryId) {
    const { Brand } = require('../models');
    const category = await this.getCategoryById(categoryId);
    
    // Count brands in this category
    const brandCount = await Brand.count({
      where: { category_id: categoryId }
    });
    
    // TODO: Add product count when Product model is created
    // const productCount = await category.countProducts();
    
    return {
      category,
      stats: {
        brandCount,
        // productCount,
        createdAt: category.created_at,
        updatedAt: category.updated_at
      }
    };
  }

  /**
   * Bulk create categories
   */
  async bulkCreateCategories(categoriesData) {
    const categories = await Category.bulkCreate(categoriesData, {
      validate: true,
      ignoreDuplicates: false
    });
    
    return categories;
  }
}

module.exports = new CategoryService();
