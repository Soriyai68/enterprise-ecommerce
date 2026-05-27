const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../common/config/database');

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'payment_id'
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
  transaction_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    field: 'transaction_id'
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'payment_method',
    validate: {
      notEmpty: {
        msg: 'Payment method cannot be empty'
      }
    }
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'),
    defaultValue: 'pending',
    field: 'payment_status'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Amount must be greater than or equal to 0'
      }
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'USD'
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'payment_date'
  },
  payment_gateway: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'payment_gateway'
  },
  gateway_response: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'gateway_response'
  },
  card_last_four: {
    type: DataTypes.STRING(4),
    allowNull: true,
    field: 'card_last_four'
  },
  card_brand: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'card_brand'
  },
  billing_address: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'billing_address'
  },
  refund_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00,
    field: 'refund_amount'
  },
  refund_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'refund_reason'
  },
  refund_date: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'refund_date'
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
  tableName: 'payments',
  timestamps: true,
  underscored: true,
  paranoid: true,
  deletedAt: 'deleted_at',
  indexes: [
    {
      unique: true,
      fields: ['transaction_id']
    },
    {
      fields: ['order_id']
    },
    {
      fields: ['payment_status']
    },
    {
      fields: ['payment_method']
    },
    {
      fields: ['payment_date']
    }
  ]
});

// Associations
Payment.associate = function(models) {
  // Payment belongs to Order
  if (models.Order) {
    Payment.belongsTo(models.Order, {
      foreignKey: 'order_id',
      as: 'order'
    });
  }

  // Audit tracking
  if (models.User) {
    Payment.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });

    Payment.belongsTo(models.User, {
      foreignKey: 'updated_by',
      as: 'updater'
    });

    Payment.belongsTo(models.User, {
      foreignKey: 'deleted_by',
      as: 'deleter'
    });
  }
};

// Instance methods
Payment.prototype.isCompleted = function() {
  return this.payment_status === 'completed';
};

Payment.prototype.isFailed = function() {
  return this.payment_status === 'failed';
};

Payment.prototype.isRefunded = function() {
  return this.payment_status === 'refunded';
};

Payment.prototype.canBeRefunded = function() {
  return this.payment_status === 'completed' && parseFloat(this.refund_amount) < parseFloat(this.amount);
};

Payment.prototype.getRemainingAmount = function() {
  return parseFloat(this.amount) - parseFloat(this.refund_amount || 0);
};

// Static method to generate transaction ID
Payment.generateTransactionId = function() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TXN-${timestamp}-${random}`;
};

module.exports = Payment;
