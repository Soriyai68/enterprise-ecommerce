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
  tableName: 'categories',
  timestamps: true,
  underscored: true,
  paranoid: true,
  deletedAt: 'deleted_at',
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

  // Audit tracking associations
  if (models.User) {
    Category.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });

    Category.belongsTo(models.User, {
      foreignKey: 'updated_by',
      as: 'updater'
    });

    Category.belongsTo(models.User, {
      foreignKey: 'deleted_by',
      as: 'deleter'
    });
  }
};

module.exports = Category;
