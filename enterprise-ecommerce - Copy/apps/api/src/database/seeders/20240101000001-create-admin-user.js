'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if admin user already exists
    const existingAdmin = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'admin@ecommerce.com' LIMIT 1;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists, skipping...');
      return;
    }

    const hashedPassword = await bcrypt.hash('Admin@123456', 12);
    
    await queryInterface.bulkInsert('users', [{
      id: uuidv4(),
      email: 'admin@ecommerce.com',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      phone: '+1234567890',
      role: 'admin',
      status: 'active',
      email_verified: true,
      login_attempts: 0,
      created_at: new Date(),
      updated_at: new Date()
    }], { validate: false });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      email: 'admin@ecommerce.com'
    }, {});
  }
};
