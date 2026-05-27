'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('permissions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      display_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      sort: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      group: {
        type: Sequelize.STRING(100),
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
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Add indexes
    await queryInterface.addIndex('permissions', ['name'], {
      name: 'permissions_name_idx',
      unique: true
    });

    await queryInterface.addIndex('permissions', ['group'], {
      name: 'permissions_group_idx'
    });

    await queryInterface.addIndex('permissions', ['sort'], {
      name: 'permissions_sort_idx'
    });

    await queryInterface.addIndex('permissions', ['deleted_at'], {
      name: 'permissions_deleted_at_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('permissions');
  }
};
