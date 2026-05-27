const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../common/config/database');

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  display_name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  sort: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  group: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'permissions',
  timestamps: true,
  underscored: true,
  paranoid: true,
  deletedAt: 'deleted_at',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
Permission.associate = function(models) {
  Permission.belongsToMany(models.Role, {
    through: 'permission_role',
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    as: 'roles'
  });
};

// Instance methods
Permission.prototype.toJSON = function() {
  const values = { ...this.get() };
  return values;
};

module.exports = Permission;
