'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get all roles
    const roles = await queryInterface.sequelize.query(
      `SELECT id, code FROM roles;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Get all permissions
    const permissions = await queryInterface.sequelize.query(
      `SELECT id, name FROM permissions;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Create a map for easy lookup
    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.code] = role.id;
    });

    const permissionMap = {};
    permissions.forEach(permission => {
      permissionMap[permission.name] = permission.id;
    });

    const permissionRoleData = [];

    // Super Admin - All permissions
    if (roleMap['SUPER_ADMIN']) {
      permissions.forEach(permission => {
        permissionRoleData.push({
          role_id: roleMap['SUPER_ADMIN'],
          permission_id: permission.id
        });
      });
    }

    // Admin - Most permissions except some sensitive ones
    if (roleMap['ADMIN']) {
      const adminPermissions = [
        'users.view', 'users.create', 'users.edit',
        'roles.view',
        'products.view', 'products.create', 'products.edit', 'products.delete',
        'orders.view', 'orders.create', 'orders.edit',
        'payments.view', 'payments.process',
        'analytics.view', 'analytics.export',
        'settings.view'
      ];

      adminPermissions.forEach(permName => {
        if (permissionMap[permName]) {
          permissionRoleData.push({
            role_id: roleMap['ADMIN'],
            permission_id: permissionMap[permName]
          });
        }
      });
    }

    // Vendor - Product and order related permissions
    if (roleMap['VENDOR']) {
      const vendorPermissions = [
        'products.view', 'products.create', 'products.edit',
        'orders.view', 'orders.edit',
        'analytics.view'
      ];

      vendorPermissions.forEach(permName => {
        if (permissionMap[permName]) {
          permissionRoleData.push({
            role_id: roleMap['VENDOR'],
            permission_id: permissionMap[permName]
          });
        }
      });
    }

    // Customer - Basic permissions
    if (roleMap['CUSTOMER']) {
      const customerPermissions = [
        'products.view',
        'orders.view', 'orders.create'
      ];

      customerPermissions.forEach(permName => {
        if (permissionMap[permName]) {
          permissionRoleData.push({
            role_id: roleMap['CUSTOMER'],
            permission_id: permissionMap[permName]
          });
        }
      });
    }

    // Support - View and limited edit permissions
    if (roleMap['SUPPORT']) {
      const supportPermissions = [
        'users.view',
        'products.view',
        'orders.view', 'orders.edit',
        'payments.view'
      ];

      supportPermissions.forEach(permName => {
        if (permissionMap[permName]) {
          permissionRoleData.push({
            role_id: roleMap['SUPPORT'],
            permission_id: permissionMap[permName]
          });
        }
      });
    }

    // Insert all permission-role associations
    if (permissionRoleData.length > 0) {
      await queryInterface.bulkInsert('permission_role', permissionRoleData, {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('permission_role', null, {});
  }
};
