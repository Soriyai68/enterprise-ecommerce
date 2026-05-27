const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../common/config/database');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  module_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  role_abbr: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  is_super: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  updated_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  deleted_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'roles',
  timestamps: true,
  underscored: true,
  paranoid: true,
  deletedAt: 'deleted_at',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Associations
Role.associate = function(models) {
  Role.belongsToMany(models.User, {
    through: 'role_user',
    foreignKey: 'role_id',
    otherKey: 'user_id',
    as: 'users'
  });

  Role.belongsToMany(models.Permission, {
    through: 'permission_role',
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    as: 'permissions'
  });

  // Audit trail associations
  Role.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'creator'
  });

  Role.belongsTo(models.User, {
    foreignKey: 'updated_by',
    as: 'updater'
  });

  Role.belongsTo(models.User, {
    foreignKey: 'deleted_by',
    as: 'deleter'
  });
};

// Instance methods
Role.prototype.toJSON = function() {
  const values = { ...this.get() };
  return values;
};

module.exports = Role;
