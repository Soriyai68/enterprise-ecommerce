const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../common/config/database');

const RoleUser = sequelize.define('RoleUser', {
  role_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'role_user',
  timestamps: false,
  underscored: true
});

module.exports = RoleUser;
