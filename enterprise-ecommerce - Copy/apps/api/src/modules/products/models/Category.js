const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../common/config/database');

const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'category_id'
  },
  category_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'category_name',
    validate: {
      notEmpty: {
        msg: 'Category name cannot be empty'
      },
      len: {
        args: [2, 100],
        msg: 'Category name must be between 2 and 100 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'description'
  }
}, {
  tableName: 'categories',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['category_name']
    }
  ]
});

// Associations
Category.associate = function(models) {
  // Category has many Brands
  if (models.Brand) {
    Category.hasMany(models.Brand, {
      foreignKey: 'category_id',
      as: 'brands'
    });
  }

  // Category has many Products
  if (models.Product) {
    Category.hasMany(models.Product, {
      foreignKey: 'category_id',
      as: 'products'
    });
  }
};

module.exports = Category;
