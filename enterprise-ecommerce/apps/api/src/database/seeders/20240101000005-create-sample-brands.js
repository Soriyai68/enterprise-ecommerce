'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if brands already exist
    const existingBrands = await queryInterface.sequelize.query(
      `SELECT brand_id FROM brands LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (existingBrands.length > 0) {
      console.log('Brands already exist, skipping...');
      return;
    }

    const brands = [
      {
        brand_id: uuidv4(),
        brand_name: 'Nike',
        description: 'American multinational corporation engaged in the design, development, manufacturing, and worldwide marketing and sales of footwear, apparel, equipment, accessories, and services.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        brand_id: uuidv4(),
        brand_name: 'Adidas',
        description: 'German multinational corporation, founded and headquartered in Herzogenaurach, Germany, that designs and manufactures shoes, clothing and accessories.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        brand_id: uuidv4(),
        brand_name: 'Apple',
        description: 'American multinational technology company that specializes in consumer electronics, software and online services.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        brand_id: uuidv4(),
        brand_name: 'Samsung',
        description: 'South Korean multinational manufacturing conglomerate headquartered in Samsung Town, Seoul, South Korea.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        brand_id: uuidv4(),
        brand_name: 'Sony',
        description: 'Japanese multinational conglomerate corporation headquartered in Kōnan, Minato, Tokyo, Japan.',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('brands', brands, { validate: false });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('brands', null, {});
  }
};
