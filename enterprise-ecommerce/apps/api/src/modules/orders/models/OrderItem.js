const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../common/config/database');

const OrderItem = sequelize.define('OrderItem', {
  order_item_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'order_item_id'
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'order_id',
    references: {
      model: 'orders',
      key: 'order_id'
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
  product_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'product_name',
    comment: 'Product name at time of order'
  },
  product_sku: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'product_sku',
    comment: 'Product SKU at time of order'
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
    },
    comment: 'Price per unit at time of order'
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'price * quantity'
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
  tableName: 'order_items',
  timestamps: true,
  underscored: true,
  paranoid: true,
  deletedAt: 'deleted_at',
  indexes: [
    {
      fields: ['order_id']
    },
    {
      fields: ['product_id']
    }
  ],
  hooks: {
    beforeSave: (orderItem) => {
      // Calculate subtotal
      orderItem.subtotal = parseFloat(orderItem.price) * orderItem.quantity;
    }
  }
});

// Associations
OrderItem.associate = function(models) {
  // OrderItem belongs to Order
  if (models.Order) {
    OrderItem.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order'
    });
  }

  // OrderItem belongs to Product
  if (models.Product) {
    OrderItem.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  }

  // Audit tracking
  if (models.User) {
    OrderItem.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });

    OrderItem.belongsTo(models.User, {
      foreignKey: 'updated_by',
      as: 'updater'
    });

    OrderItem.belongsTo(models.User, {
      foreignKey: 'deleted_by',
      as: 'deleter'
    });
  }
};

// Instance methods
OrderItem.prototype.getSubtotal = function() {
  return parseFloat(this.price) * this.quantity;
};

module.exports = OrderItem;
