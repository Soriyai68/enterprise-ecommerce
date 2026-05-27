'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if roles already exist
    const existingRoles = await queryInterface.sequelize.query(
      `SELECT id FROM roles LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (existingRoles.length > 0) {
      console.log('Roles already exist, skipping...');
      return;
    }

    const now = new Date();
    
    await queryInterface.bulkInsert('roles', [
      {
        id: uuidv4(),
        code: 'SUPER_ADMIN',
        name: 'Super Administrator',
        module_name: 'auth',
        role_abbr: 'SA',
        is_super: true,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        code: 'ADMIN',
        name: 'Administrator',
        module_name: 'auth',
        role_abbr: 'ADM',
        is_super: false,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        code: 'VENDOR',
        name: 'Vendor',
        module_name: 'products',
        role_abbr: 'VND',
        is_super: false,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        code: 'CUSTOMER',
        name: 'Customer',
        module_name: 'orders',
        role_abbr: 'CUST',
        is_super: false,
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        code: 'SUPPORT',
        name: 'Support Staff',
        module_name: 'support',
        role_abbr: 'SUP',
        is_super: false,
        created_at: now,
        updated_at: now
      }
    ], { validate: false });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
