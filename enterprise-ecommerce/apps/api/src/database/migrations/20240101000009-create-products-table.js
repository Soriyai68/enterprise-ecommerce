'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      product_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'category_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      brand_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'brands',
          key: 'brand_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      compare_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Original price for showing discounts'
      },
      cost_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Cost price for profit calculation'
      },
      stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      sku: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
        comment: 'Stock Keeping Unit'
      },
      image: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'Main product image URL'
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Array of additional product images'
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'draft', 'out_of_stock'),
        defaultValue: 'draft'
      },
      is_featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      weight: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Product weight in kg'
      },
      dimensions: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Product dimensions (length, width, height)'
      },
      meta_title: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'SEO meta title'
      },
      meta_description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'SEO meta description'
      },
      meta_keywords: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'SEO meta keywords'
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      deleted_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('products', ['category_id'], {
      name: 'products_category_id_index'
    });

    await queryInterface.addIndex('products', ['brand_id'], {
      name: 'products_brand_id_index'
    });

    await queryInterface.addIndex('products', ['slug'], {
      unique: true,
      name: 'products_slug_unique'
    });

    await queryInterface.addIndex('products', ['sku'], {
      unique: true,
      name: 'products_sku_unique'
    });

    await queryInterface.addIndex('products', ['status'], {
      name: 'products_status_index'
    });

    await queryInterface.addIndex('products', ['is_featured'], {
      name: 'products_is_featured_index'
    });

    await queryInterface.addIndex('products', ['deleted_at'], {
      name: 'products_deleted_at_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  }
};
