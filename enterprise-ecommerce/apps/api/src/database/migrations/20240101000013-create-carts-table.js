'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('carts', {
      cart_id: {
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
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('active', 'abandoned', 'converted', 'merged'),
        defaultValue: 'active',
        comment: 'Cart status'
      },
      session_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Session ID for guest carts'
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Cart expiration date'
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
    await queryInterface.addIndex('carts', ['user_id'], {
      name: 'carts_user_id_index'
    });

    await queryInterface.addIndex('carts', ['status'], {
      name: 'carts_status_index'
    });

    await queryInterface.addIndex('carts', ['session_id'], {
      name: 'carts_session_id_index'
    });

    await queryInterface.addIndex('carts', ['deleted_at'], {
      name: 'carts_deleted_at_index'
    });

    await queryInterface.addIndex('carts', ['expires_at'], {
      name: 'carts_expires_at_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('carts');
  }
};
