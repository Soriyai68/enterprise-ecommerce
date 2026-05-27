const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../common/config/database');

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'order_id'
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  order_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    field: 'order_number'
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    field: 'total_amount',
    validate: {
      min: {
        args: [0],
        msg: 'Total amount must be greater than or equal to 0'
      }
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    field: 'tax_amount'
  },
  shipping_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    field: 'shipping_amount'
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    field: 'discount_amount'
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
    defaultValue: 'pending',
    validate: {
      isIn: {
        args: [['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']],
        msg: 'Invalid order status'
      }
    }
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending',
    field: 'payment_status'
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'payment_method'
  },
  shipping_address: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'shipping_address'
  },
  billing_address: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'billing_address'
  },
  order_date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'order_date'
  },
  shipped_date: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'shipped_date'
  },
  delivered_date: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'delivered_date'
  },
  cancelled_date: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'cancelled_date'
  },
  cancellation_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'cancellation_reason'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
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
  tableName: 'orders',
  timestamps: true,
  underscored: true,
  paranoid: true,
  deletedAt: 'deleted_at',
  indexes: [
    {
      unique: true,
      fields: ['order_number']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['payment_status']
    },
    {
      fields: ['order_date']
    }
  ]
});

// Associations
Order.associate = function(models) {
  // Order belongs to User
  if (models.User) {
    Order.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    // Audit tracking
    Order.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });

    Order.belongsTo(models.User, {
      foreignKey: 'updated_by',
      as: 'updater'
    });

    Order.belongsTo(models.User, {
      foreignKey: 'deleted_by',
      as: 'deleter'
    });
  }

  // Order has many OrderItems
  if (models.OrderItem) {
    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'items'
    });
  }
};

// Instance methods
Order.prototype.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

Order.prototype.canBeRefunded = function() {
  return ['delivered'].includes(this.status) && this.payment_status === 'paid';
};

Order.prototype.isPaid = function() {
  return this.payment_status === 'paid';
};

Order.prototype.isDelivered = function() {
  return this.status === 'delivered';
};

// Static method to generate order number
Order.generateOrderNumber = function() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

module.exports = Order;
