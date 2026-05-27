'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add audit fields to brands table
    await queryInterface.addColumn('brands', 'created_by', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('brands', 'updated_by', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('brands', 'deleted_by', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('brands', 'deleted_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // Add index on deleted_at for soft delete queries
    await queryInterface.addIndex('brands', ['deleted_at'], {
      name: 'brands_deleted_at_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('brands', 'brands_deleted_at_index');
    await queryInterface.removeColumn('brands', 'deleted_at');
    await queryInterface.removeColumn('brands', 'deleted_by');
    await queryInterface.removeColumn('brands', 'updated_by');
    await queryInterface.removeColumn('brands', 'created_by');
  }
};
