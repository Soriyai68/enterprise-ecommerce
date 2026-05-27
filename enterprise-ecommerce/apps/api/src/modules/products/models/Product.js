const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../common/config/database');

const Product = sequelize.define('Product', {
  product_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'product_id'
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'category_id',
    references: {
      model: 'categories',
      key: 'category_id'
    }
  },
  brand_id: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'brand_id',
    references: {
      model: 'brands',
      key: 'brand_id'
    }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Product name cannot be empty'
      },
      len: {
        args: [2, 255],
        msg: 'Product name must be between 2 and 255 characters'
      }
    }
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Slug cannot be empty'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: {
        args: [0],
        msg: 'Price must be greater than or equal to 0'
      }
    }
  },
  compare_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'compare_price'
  },
  cost_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'cost_price'
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Stock must be greater than or equal to 0'
      }
    }
  },
  sku: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'draft', 'out_of_stock'),
    defaultValue: 'draft'
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_featured'
  },
  weight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  dimensions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  meta_title: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'meta_title'
  },
  meta_description: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'meta_description'
  },
  meta_keywords: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'meta_keywords'
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'created_by'
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'updated_by'
  },
  deleted_by: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'deleted_by'
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'deleted_at'
  }
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true,
  paranoid: true, // Enables soft deletes
  deletedAt: 'deleted_at',
  indexes: [
    {
      unique: true,
      fields: ['slug']
    },
    {
      unique: true,
      fields: ['sku']
    },
    {
      fields: ['category_id']
    },
    {
      fields: ['brand_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['is_featured']
    }
  ]
});

// Associations
Product.associate = function(models) {
  // Product belongs to Category
  if (models.Category) {
    Product.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });
  }

  // Product belongs to Brand
  if (models.Brand) {
    Product.belongsTo(models.Brand, {
      foreignKey: 'brand_id',
      as: 'brand'
    });
  }

  // Product created by User
  if (models.User) {
    Product.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });

    Product.belongsTo(models.User, {
      foreignKey: 'updated_by',
      as: 'updater'
    });

    Product.belongsTo(models.User, {
      foreignKey: 'deleted_by',
      as: 'deleter'
    });
  }
};

// Instance methods
Product.prototype.isInStock = function() {
  return this.stock > 0 && this.status === 'active';
};

Product.prototype.hasDiscount = function() {
  return this.compare_price && this.compare_price > this.price;
};

Product.prototype.getDiscountPercentage = function() {
  if (!this.hasDiscount()) return 0;
  return Math.round(((this.compare_price - this.price) / this.compare_price) * 100);
};

module.exports = Product;
