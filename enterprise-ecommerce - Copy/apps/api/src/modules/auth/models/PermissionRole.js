const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../common/config/database');

const PermissionRole = sequelize.define('PermissionRole', {
  role_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  permission_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'permissions',
      key: 'id'
    }
  }
}, {
  tableName: 'permission_role',
  timestamps: false,
  underscored: true
});

module.exports = PermissionRole;
