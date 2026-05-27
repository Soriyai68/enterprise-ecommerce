const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../common/config/database');

const CartItem = sequelize.define('CartItem', {
  cart_item_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'cart_item_id'
  },
  cart_id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'cart_id',
    references: {
      model: 'carts',
      key: 'cart_id'
    }
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'product_id',
    references: {
      model: 'products',
      key: 'product_id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: {
        args: [1],
        msg: 'Quantity must be at least 1'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Price must be greater than or equal to 0'
      }
    }
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
  tableName: 'cart_items',
  timestamps: true,
  underscored: true,
  paranoid: true,
  deletedAt: 'deleted_at',
  indexes: [
    {
      fields: ['cart_id']
    },
    {
      fields: ['product_id']
    },
    {
      unique: true,
      fields: ['cart_id', 'product_id'],
      where: {
        deleted_at: null
      }
    }
  ]
});

// Associations
CartItem.associate = function(models) {
  // CartItem belongs to Cart
  if (models.Cart) {
    CartItem.belongsTo(models.Cart, {
      foreignKey: 'cart_id',
      as: 'cart'
    });
  }

  // CartItem belongs to Product
  if (models.Product) {
    CartItem.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  }

  // Audit tracking
  if (models.User) {
    CartItem.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });

    CartItem.belongsTo(models.User, {
      foreignKey: 'updated_by',
      as: 'updater'
    });

    CartItem.belongsTo(models.User, {
      foreignKey: 'deleted_by',
      as: 'deleter'
    });
  }
};

// Instance methods
CartItem.prototype.getSubtotal = function() {
  return parseFloat(this.price) * this.quantity;
};

module.exports = CartItem;
