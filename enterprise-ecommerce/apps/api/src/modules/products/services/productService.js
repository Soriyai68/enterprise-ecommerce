const { Product, Category, Brand } = require('../models');
const { AppError } = require('../../../common/middleware/errorHandler');
const { Op } = require('sequelize');

// Helper function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

class ProductService {
  /**
   * Create a new product
   */
  async createProduct(productData, userId) {
    // Validate category exists
    const category = await Category.findByPk(productData.category_id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Validate brand exists if provided
    if (productData.brand_id) {
      const brand = await Brand.findByPk(productData.brand_id);
      if (!brand) {
        throw new AppError('Brand not found', 404);
      }
    }

    // Generate slug from name if not provided
    if (!productData.slug) {
      productData.slug = generateSlug(productData.name);
    }

    // Check if slug already exists
    const existingProduct = await Product.findOne({
      where: { slug: productData.slug }
    });

    if (existingProduct) {
      // Add random suffix to make slug unique
      productData.slug = `${productData.slug}-${Date.now()}`;
    }

    // Check if SKU already exists
    if (productData.sku) {
      const existingSKU = await Product.findOne({
        where: { sku: productData.sku }
      });

      if (existingSKU) {
        throw new AppError('SKU already exists', 409);
      }
    }

    // Add created_by
    productData.created_by = userId;

    const product = await Product.create(productData);

    // Load relationships
    await product.reload({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['category_id', 'category_name']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['brand_id', 'brand_name']
        }
      ]
    });

    return product;
  }

  /**
   * Get all products with pagination, search, and filters
   */
  async getAllProducts(queryParams) {
    const {
      page = 1,
      limit = 10,
      search = '',
      category_id,
      brand_id,
      status,
      is_featured,
      min_price,
      max_price,
      sort = '-created_at'
    } = queryParams;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } }
      ];
    }

    if (category_id) {
      whereClause.category_id = category_id;
    }

    if (brand_id) {
      whereClause.brand_id = brand_id;
    }

    if (status) {
      whereClause.status = status;
    }

    if (is_featured !== undefined && is_featured !== null && is_featured !== '') {
      whereClause.is_featured = is_featured;
    }

    if (min_price || max_price) {
      whereClause.price = {};
      if (min_price) whereClause.price[Op.gte] = min_price;
      if (max_price) whereClause.price[Op.lte] = max_price;
    }

    // Parse sort parameter
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortField, sortOrder]],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['category_id', 'category_name']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['brand_id', 'brand_name']
        }
      ]
    });

    return {
      products: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Get product by ID
   */
  async getProductById(productId) {
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['category_id', 'category_name', 'description']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['brand_id', 'brand_name', 'description']
        }
      ]
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  /**
   * Get product by slug
   */
  async getProductBySlug(slug) {
    const product = await Product.findOne({
      where: { slug },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['category_id', 'category_name', 'description']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['brand_id', 'brand_name', 'description']
        }
      ]
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  /**
   * Update product
   */
  async updateProduct(productId, updateData, userId) {
    const product = await this.getProductById(productId);

    // Validate category if being updated
    if (updateData.category_id && updateData.category_id !== product.category_id) {
      const category = await Category.findByPk(updateData.category_id);
      if (!category) {
        throw new AppError('Category not found', 404);
      }
    }

    // Validate brand if being updated
    if (updateData.brand_id && updateData.brand_id !== product.brand_id) {
      const brand = await Brand.findByPk(updateData.brand_id);
      if (!brand) {
        throw new AppError('Brand not found', 404);
      }
    }

    // Check if new SKU already exists
    if (updateData.sku && updateData.sku !== product.sku) {
      const existingSKU = await Product.findOne({
        where: {
          sku: updateData.sku,
          product_id: { [Op.ne]: productId }
        }
      });

      if (existingSKU) {
        throw new AppError('SKU already exists', 409);
      }
    }

    // Update slug if name is changed
    if (updateData.name && updateData.name !== product.name) {
      updateData.slug = generateSlug(updateData.name);

      // Check if new slug exists
      const existingSlug = await Product.findOne({
        where: {
          slug: updateData.slug,
          product_id: { [Op.ne]: productId }
        }
      });

      if (existingSlug) {
        updateData.slug = `${updateData.slug}-${Date.now()}`;
      }
    }

    // Add updated_by
    updateData.updated_by = userId;

    await product.update(updateData);

    // Reload with relationships
    await product.reload({
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['category_id', 'category_name']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['brand_id', 'brand_name']
        }
      ]
    });

    return product;
  }

  /**
   * Delete product (soft delete)
   */
  async deleteProduct(productId, userId) {
    const product = await this.getProductById(productId);

    // Set deleted_by before soft delete
    await product.update({ deleted_by: userId });

    // Soft delete
    await product.destroy();

    return { message: 'Product deleted successfully' };
  }

  /**
   * Restore deleted product
   */
  async restoreProduct(productId) {
    const product = await Product.findByPk(productId, {
      paranoid: false // Include soft deleted records
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (!product.deleted_at) {
      throw new AppError('Product is not deleted', 400);
    }

    await product.restore();
    await product.update({ deleted_by: null });

    return product;
  }

  /**
   * Update product stock
   */
  async updateStock(productId, quantity, userId) {
    const product = await this.getProductById(productId);

    const newStock = product.stock + quantity;

    if (newStock < 0) {
      throw new AppError('Insufficient stock', 400);
    }

    await product.update({
      stock: newStock,
      updated_by: userId,
      status: newStock === 0 ? 'out_of_stock' : product.status
    });

    return product;
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit = 10) {
    const products = await Product.findAll({
      where: {
        is_featured: true,
        status: 'active'
      },
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['category_id', 'category_name']
        },
        {
          model: Brand,
          as: 'brand',
          attributes: ['brand_id', 'brand_name']
        }
      ]
    });

    return products;
  }
}

module.exports = new ProductService();
