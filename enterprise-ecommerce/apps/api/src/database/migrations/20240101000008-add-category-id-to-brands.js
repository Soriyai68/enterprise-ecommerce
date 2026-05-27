'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('brands', 'category_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'category_id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Add index on category_id for faster lookups
    await queryInterface.addIndex('brands', ['category_id'], {
      name: 'brands_category_id_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('brands', 'brands_category_id_index');
    await queryInterface.removeColumn('brands', 'category_id');
  }
};
