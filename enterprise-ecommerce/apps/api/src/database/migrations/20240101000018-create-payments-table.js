'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payments', {
      payment_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'order_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      transaction_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,
        comment: 'External payment gateway transaction ID'
      },
      payment_method: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: 'e.g., credit_card, debit_card, paypal, stripe, cash_on_delivery'
      },
      payment_status: {
        type: Sequelize.ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'),
        defaultValue: 'pending'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Payment amount'
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'USD'
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Date when payment was completed'
      },
      payment_gateway: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Payment gateway used (e.g., Stripe, PayPal)'
      },
      gateway_response: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Response from payment gateway'
      },
      card_last_four: {
        type: Sequelize.STRING(4),
        allowNull: true,
        comment: 'Last 4 digits of card'
      },
      card_brand: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: 'Card brand (Visa, Mastercard, etc.)'
      },
      billing_address: {
        type: Sequelize.JSON,
        allowNull: true
      },
      refund_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
      },
      refund_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      refund_date: {
        type: Sequelize.DATE,
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
    await queryInterface.addIndex('payments', ['order_id'], {
      name: 'payments_order_id_index'
    });

    await queryInterface.addIndex('payments', ['transaction_id'], {
      unique: true,
      name: 'payments_transaction_id_unique'
    });

    await queryInterface.addIndex('payments', ['payment_status'], {
      name: 'payments_payment_status_index'
    });

    await queryInterface.addIndex('payments', ['payment_method'], {
      name: 'payments_payment_method_index'
    });

    await queryInterface.addIndex('payments', ['payment_date'], {
      name: 'payments_payment_date_index'
    });

    await queryInterface.addIndex('payments', ['deleted_at'], {
      name: 'payments_deleted_at_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('payments');
  }
};
