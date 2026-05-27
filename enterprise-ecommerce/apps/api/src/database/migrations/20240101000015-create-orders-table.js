'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      order_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      order_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      tax_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      shipping_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      discount_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'),
        defaultValue: 'pending'
      },
      payment_status: {
        type: Sequelize.ENUM('pending', 'paid', 'failed', 'refunded'),
        defaultValue: 'pending'
      },
      payment_method: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      shipping_address: {
        type: Sequelize.JSON,
        allowNull: true
      },
      billing_address: {
        type: Sequelize.JSON,
        allowNull: true
      },
      order_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      shipped_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      delivered_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      cancelled_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      cancellation_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      updated_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      deleted_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('orders', ['user_id'], {
      name: 'orders_user_id_index'
    });

    await queryInterface.addIndex('orders', ['order_number'], {
      unique: true,
      name: 'orders_order_number_unique'
    });

    await queryInterface.addIndex('orders', ['status'], {
      name: 'orders_status_index'
    });

    await queryInterface.addIndex('orders', ['payment_status'], {
      name: 'orders_payment_status_index'
    });

    await queryInterface.addIndex('orders', ['order_date'], {
      name: 'orders_order_date_index'
    });

    await queryInterface.addIndex('orders', ['deleted_at'], {
      name: 'orders_deleted_at_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  }
};
