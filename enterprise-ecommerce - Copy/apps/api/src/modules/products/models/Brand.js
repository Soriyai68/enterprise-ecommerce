const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../common/config/database');

const Brand = sequelize.define('Brand', {
  brand_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'brand_id'
  },
  brand_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'brand_name',
    validate: {
      notEmpty: {
        msg: 'Brand name cannot be empty'
      },
      len: {
        args: [2, 100],
        msg: 'Brand name must be between 2 and 100 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'description'
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'category_id',
    references: {
      model: 'categories',
      key: 'category_id'
    }
  }
}, {
  tableName: 'brands',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['brand_name']
    },
    {
      fields: ['category_id']
    }
  ]
});

// Associations
Brand.associate = function(models) {
  // Brand belongs to Category
  if (models.Category) {
    Brand.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });
  }

  // Brand has many Products
  if (models.Product) {
    Brand.hasMany(models.Product, {
      foreignKey: 'brand_id',
      as: 'products'
    });
  }
};

module.exports = Brand;
