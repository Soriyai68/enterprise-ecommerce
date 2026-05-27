const { Brand } = require('../models');
const { AppError } = require('../../../common/middleware/errorHandler');
const { Op } = require('sequelize');

class BrandService {
  /**
   * Create a new brand
   */
  async createBrand(brandData) {
    const { Category } = require('../models');

    // Check if brand name already exists
    const existingBrand = await Brand.findOne({
      where: { brand_name: brandData.brand_name }
    });

    if (existingBrand) {
      throw new AppError('Brand name already exists', 409);
    }

    // Validate category_id if provided
    if (brandData.category_id) {
      const category = await Category.findByPk(brandData.category_id);
      if (!category) {
        throw new AppError('Category not found', 404);
      }
    }

    const brand = await Brand.create(brandData);
    
    // Load category relationship
    await brand.reload({
      include: [{
        model: Category,
        as: 'category',
        attributes: ['category_id', 'category_name']
      }]
    });

    return brand;
  }

  /**
   * Get all brands with pagination and search
   */
  async getAllBrands(queryParams) {
    const { Category } = require('../models');
    const { page = 1, limit = 10, search = '', sort = '-created_at', category_id } = queryParams;
    
    const offset = (page - 1) * limit;
    
    // Build where clause for search
    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { brand_name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Filter by category_id if provided
    if (category_id) {
      whereClause.category_id = category_id;
    }

    // Parse sort parameter
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';

    const { count, rows } = await Brand.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortField, sortOrder]],
      include: [{
        model: Category,
        as: 'category',
        attributes: ['category_id', 'category_name']
      }]
    });

    return {
      brands: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Get brand by ID
   */
  async getBrandById(brandId) {
    const { Category } = require('../models');

    const brand = await Brand.findByPk(brandId, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['category_id', 'category_name', 'description']
      }]
    });

    if (!brand) {
      throw new AppError('Brand not found', 404);
    }

    return brand;
  }

  /**
   * Update brand
   */
  async updateBrand(brandId, updateData) {
    const { Category } = require('../models');
    const brand = await this.getBrandById(brandId);

    // Check if new brand name already exists (if brand_name is being updated)
    if (updateData.brand_name && updateData.brand_name !== brand.brand_name) {
      const existingBrand = await Brand.findOne({
        where: { 
          brand_name: updateData.brand_name,
          brand_id: { [Op.ne]: brandId }
        }
      });

      if (existingBrand) {
        throw new AppError('Brand name already exists', 409);
      }
    }

    // Validate category_id if provided
    if (updateData.category_id) {
      const category = await Category.findByPk(updateData.category_id);
      if (!category) {
        throw new AppError('Category not found', 404);
      }
    }

    await brand.update(updateData);
    
    // Reload with category relationship
    await brand.reload({
      include: [{
        model: Category,
        as: 'category',
        attributes: ['category_id', 'category_name']
      }]
    });

    return brand;
  }

  /**
   * Delete brand
   */
  async deleteBrand(brandId) {
    const brand = await this.getBrandById(brandId);
    
    // TODO: Check if brand has associated products
    // Uncomment when Product model is created
    // const productCount = await brand.countProducts();
    // if (productCount > 0) {
    //   throw new AppError('Cannot delete brand with associated products', 400);
    // }

    await brand.destroy();
    return { message: 'Brand deleted successfully' };
  }

  /**
   * Get brand statistics
   */
  async getBrandStats(brandId) {
    const brand = await this.getBrandById(brandId);
    
    // TODO: Add product count when Product model is created
    // const productCount = await brand.countProducts();
    
    return {
      brand,
      stats: {
        // productCount,
        createdAt: brand.created_at,
        updatedAt: brand.updated_at
      }
    };
  }
}

module.exports = new BrandService();
