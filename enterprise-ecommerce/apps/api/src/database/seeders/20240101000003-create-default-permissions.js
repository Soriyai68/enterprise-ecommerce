'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    
    await queryInterface.bulkInsert('permissions', [
      // User Management Permissions
      {
        id: uuidv4(),
        name: 'users.view',
        display_name: 'View Users',
        sort: 1,
        group: 'User Management',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'users.create',
        display_name: 'Create Users',
        sort: 2,
        group: 'User Management',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'users.edit',
        display_name: 'Edit Users',
        sort: 3,
        group: 'User Management',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'users.delete',
        display_name: 'Delete Users',
        sort: 4,
        group: 'User Management',
        created_at: now,
        updated_at: now
      },

      // Role Management Permissions
      {
        id: uuidv4(),
        name: 'roles.view',
        display_name: 'View Roles',
        sort: 5,
        group: 'Role Management',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'roles.create',
        display_name: 'Create Roles',
        sort: 6,
        group: 'Role Management',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'roles.edit',
        display_name: 'Edit Roles',
        sort: 7,
        group: 'Role Management',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'roles.delete',
        display_name: 'Delete Roles',
        sort: 8,
        group: 'Role Management',
        created_at: now,
        updated_at: now
      },

      // Product Management Permissions
      {
        id: uuidv4(),
        name: 'products.view',
        display_name: 'View Products',
        sort: 9,
        group: 'Product Management',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'products.create',
        display_name: 'Create Products',
        sort: 10,
        group: 'Product Management',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'products.edit',
        display_name: 'Edit Products',
        sort: 11,
        group: 'Product Management',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'products.delete',
        display_name: 'Delete Products',
        sort: 12,
        group: 'Product Management',
        created_at: now,
        updated_at: now
      },

      // Order Management Permissions
      {
        id: uuidv4(),
        name: 'orders.view',
        display_name: 'View Orders',
        sort: 13,
        group: 'Order Management',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'orders.create',
        display_name: 'Create Orders',
        sort: 14,
        group: 'Order Management',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'orders.edit',
        display_name: 'Edit Orders',
        sort: 15,
        group: 'Order Management',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'orders.delete',
        display_name: 'Delete Orders',
        sort: 16,
        group: 'Order Management',
        created_at: now,
        updated_at: now
      },

      // Payment Management Permissions
      {
        id: uuidv4(),
        name: 'payments.view',
        display_name: 'View Payments',
        sort: 17,
        group: 'Payment Management',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'payments.process',
        display_name: 'Process Payments',
        sort: 18,
        group: 'Payment Management',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'payments.refund',
        display_name: 'Refund Payments',
        sort: 19,
        group: 'Payment Management',
        created_at: now,
        updated_at: now
      },

      // Analytics Permissions
      {
        id: uuidv4(),
        name: 'analytics.view',
        display_name: 'View Analytics',
        sort: 20,
        group: 'Analytics',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'analytics.export',
        display_name: 'Export Analytics',
        sort: 21,
        group: 'Analytics',
        created_at: now,
        updated_at: now
      },

      // Settings Permissions
      {
        id: uuidv4(),
        name: 'settings.view',
        display_name: 'View Settings',
        sort: 22,
        group: 'Settings',
        created_at: now,
        updated_at: now
      },
      {
        id: uuidv4(),
        name: 'settings.edit',
        display_name: 'Edit Settings',
        sort: 23,
        group: 'Settings',
        created_at: now,
        updated_at: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
