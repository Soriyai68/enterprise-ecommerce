'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if categories already exist
    const existingCategories = await queryInterface.sequelize.query(
      `SELECT category_id FROM categories LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (existingCategories.length > 0) {
      console.log('Categories already exist, skipping...');
      return;
    }

    const categories = [
      {
        category_id: uuidv4(),
        category_name: 'Electronics',
        description: 'Electronic devices, gadgets, and accessories including smartphones, laptops, tablets, and wearables.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: uuidv4(),
        category_name: 'Clothing',
        description: 'Fashion apparel for men, women, and children including shirts, pants, dresses, and outerwear.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: uuidv4(),
        category_name: 'Footwear',
        description: 'Shoes, sneakers, boots, sandals, and other footwear for all occasions and activities.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: uuidv4(),
        category_name: 'Home & Kitchen',
        description: 'Home appliances, kitchenware, furniture, and home decor items.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: uuidv4(),
        category_name: 'Sports & Outdoors',
        description: 'Sports equipment, outdoor gear, fitness accessories, and athletic wear.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: uuidv4(),
        category_name: 'Books',
        description: 'Physical and digital books across all genres including fiction, non-fiction, educational, and reference.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: uuidv4(),
        category_name: 'Beauty & Personal Care',
        description: 'Cosmetics, skincare, haircare, fragrances, and personal hygiene products.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: uuidv4(),
        category_name: 'Toys & Games',
        description: 'Toys, board games, video games, puzzles, and entertainment products for all ages.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: uuidv4(),
        category_name: 'Automotive',
        description: 'Car parts, accessories, tools, and automotive maintenance products.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        category_id: uuidv4(),
        category_name: 'Jewelry & Watches',
        description: 'Fine jewelry, fashion jewelry, luxury watches, and accessories.',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('categories', categories, { validate: false });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
