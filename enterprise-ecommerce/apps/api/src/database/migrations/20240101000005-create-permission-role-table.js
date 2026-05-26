'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('permission_role', {
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'roles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      permission_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'permissions',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });

    // Add composite index for faster lookups
    await queryInterface.addIndex('permission_role', ['role_id', 'permission_id'], {
      name: 'permission_role_role_permission_idx'
    });

    await queryInterface.addIndex('permission_role', ['permission_id'], {
      name: 'permission_role_permission_idx'
    });

    await queryInterface.addIndex('permission_role', ['role_id'], {
      name: 'permission_role_role_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('permission_role');
  }
};
