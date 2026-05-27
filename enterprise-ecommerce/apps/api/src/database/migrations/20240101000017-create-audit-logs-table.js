'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('audit_logs', {
      audit_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        comment: 'User who performed the action'
      },
      action: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Action performed (e.g., CREATE, UPDATE, DELETE, LOGIN, LOGOUT)'
      },
      entity_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Type of entity affected (e.g., User, Product, Order)'
      },
      entity_id: {
        type: Sequelize.UUID,
        allowNull: true,
        comment: 'ID of the affected entity'
      },
      old_values: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Previous values before change'
      },
      new_values: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'New values after change'
      },
      ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true,
        comment: 'IP address of the user'
      },
      user_agent: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Browser/client user agent'
      },
      request_method: {
        type: Sequelize.STRING(10),
        allowNull: true,
        comment: 'HTTP method (GET, POST, PUT, DELETE)'
      },
      request_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'Request URL'
      },
      status_code: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'HTTP status code'
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Error message if action failed'
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Additional metadata'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('audit_logs', ['user_id'], {
      name: 'audit_logs_user_id_index'
    });

    await queryInterface.addIndex('audit_logs', ['action'], {
      name: 'audit_logs_action_index'
    });

    await queryInterface.addIndex('audit_logs', ['entity_type'], {
      name: 'audit_logs_entity_type_index'
    });

    await queryInterface.addIndex('audit_logs', ['entity_id'], {
      name: 'audit_logs_entity_id_index'
    });

    await queryInterface.addIndex('audit_logs', ['created_at'], {
      name: 'audit_logs_created_at_index'
    });

    await queryInterface.addIndex('audit_logs', ['entity_type', 'entity_id'], {
      name: 'audit_logs_entity_composite_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('audit_logs');
  }
};
