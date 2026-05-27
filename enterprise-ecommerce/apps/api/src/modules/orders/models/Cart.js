const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../common/config/database');

const Cart = sequelize.define('Cart', {
  cart_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'cart_id'
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
  status: {
    type: DataTypes.ENUM('active', 'abandoned', 'converted', 'merged'),
    defaultValue: 'active',
    validate: {
      isIn: {
        args: [['active', 'abandoned', 'converted', 'merged']],
        msg: 'Status must be one of: active, abandoned, converted, merged'
      }
    }
  },
  session_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'session_id'
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expires_at'
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
  tableName: 'carts',
  timestamps: true,
  underscored: true,
  paranoid: true,
  deletedAt: 'deleted_at',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['session_id']
    },
    {
      fields: ['expires_at']
    }
  ]
});

// Associations
Cart.associate = function(models) {
  // Cart belongs to User
  if (models.User) {
    Cart.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    // Audit tracking
    Cart.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'creator'
    });

    Cart.belongsTo(models.User, {
      foreignKey: 'updated_by',
      as: 'updater'
    });

    Cart.belongsTo(models.User, {
      foreignKey: 'deleted_by',
      as: 'deleter'
    });
  }

  // Cart has many CartItems
  if (models.CartItem) {
    Cart.hasMany(models.CartItem, {
      foreignKey: 'cart_id',
      as: 'items'
    });
  }
};

// Instance methods
Cart.prototype.isExpired = function() {
  return this.expires_at && new Date() > new Date(this.expires_at);
};

Cart.prototype.isActive = function() {
  return this.status === 'active' && !this.isExpired();
};

Cart.prototype.getTotalItems = async function() {
  const CartItem = require('./CartItem');
  const items = await CartItem.findAll({
    where: { cart_id: this.cart_id }
  });
  return items.reduce((total, item) => total + item.quantity, 0);
};

Cart.prototype.getTotalPrice = async function() {
  const CartItem = require('./CartItem');
  const items = await CartItem.findAll({
    where: { cart_id: this.cart_id }
  });
  return items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
};

module.exports = Cart;
