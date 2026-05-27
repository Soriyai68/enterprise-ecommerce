'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add audit fields to users table
    await queryInterface.addColumn('users', 'created_by', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('users', 'updated_by', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('users', 'deleted_by', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('users', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Add index on deleted_at for soft delete queries
    await queryInterface.addIndex('users', ['deleted_at'], {
      name: 'users_deleted_at_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('users', 'users_deleted_at_index');
    await queryInterface.removeColumn('users', 'deleted_at');
    await queryInterface.removeColumn('users', 'deleted_by');
    await queryInterface.removeColumn('users', 'updated_by');
    await queryInterface.removeColumn('users', 'created_by');
  }
};
