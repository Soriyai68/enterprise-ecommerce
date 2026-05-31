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
  tableName: 'brands',
  timestamps: true,
  underscored: true,
  paranoid: true,
  deletedAt: 'deleted_at',
  indexes: [
    {
      unique: true,
      fields: ['brand_name']
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

  // Audit tracking associations
  if (models.User) {
    Brand.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });

    Brand.belongsTo(models.User, {
      foreignKey: 'updated_by',
      as: 'updater'
    });

    Brand.belongsTo(models.User, {
      foreignKey: 'deleted_by',
      as: 'deleter'
    });
  }
};

module.exports = Brand;
