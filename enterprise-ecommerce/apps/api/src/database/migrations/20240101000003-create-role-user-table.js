'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('role_user', {
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
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });

    // Add composite index for faster lookups
    await queryInterface.addIndex('role_user', ['user_id', 'role_id'], {
      name: 'role_user_user_role_idx'
    });

    await queryInterface.addIndex('role_user', ['role_id'], {
      name: 'role_user_role_idx'
    });

    await queryInterface.addIndex('role_user', ['user_id'], {
      name: 'role_user_user_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('role_user');
  }
};
