'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add audit fields to categories table
    await queryInterface.addColumn('categories', 'created_by', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('categories', 'updated_by', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('categories', 'deleted_by', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('categories', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Add index on deleted_at for soft delete queries
    await queryInterface.addIndex('categories', ['deleted_at'], {
      name: 'categories_deleted_at_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('categories', 'categories_deleted_at_index');
    await queryInterface.removeColumn('categories', 'deleted_at');
    await queryInterface.removeColumn('categories', 'deleted_by');
    await queryInterface.removeColumn('categories', 'updated_by');
    await queryInterface.removeColumn('categories', 'created_by');
  }
};
