'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('Admin@123456', 12);
    
    await queryInterface.bulkInsert('users', [{
      id: queryInterface.sequelize.literal('UUID()'),
      email: 'admin@ecommerce.com',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      phone: '+1234567890',
      role: 'admin',
      status: 'active',
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      email: 'admin@ecommerce.com'
    }, {});
  }
};
