'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
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
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
