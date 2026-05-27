const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../common/config/database');

const AuditLog = sequelize.define('AuditLog', {
  audit_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    field: 'audit_id'
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Action cannot be empty'
      }
    }
  },
  entity_type: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'entity_type',
    validate: {
      notEmpty: {
        msg: 'Entity type cannot be empty'
      }
    }
  },
  entity_id: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'entity_id'
  },
  old_values: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'old_values'
  },
  new_values: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'new_values'
  },
  ip_address: {
    type: DataTypes.STRING(45),
    allowNull: true,
    field: 'ip_address'
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'user_agent'
  },
  request_method: {
    type: DataTypes.STRING(10),
    allowNull: true,
    field: 'request_method'
  },
  request_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'request_url'
  },
  status_code: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'status_code'
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'error_message'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'audit_logs',
  timestamps: true,
  updatedAt: false, // Audit logs are immutable, no updates
  underscored: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['action']
    },
    {
      fields: ['entity_type']
    },
    {
      fields: ['entity_id']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['entity_type', 'entity_id']
    }
  ]
});

// Associations
AuditLog.associate = function(models) {
  // AuditLog belongs to User
  if (models.User) {
    AuditLog.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  }
};

// Static methods for common audit actions
AuditLog.logAction = async function(data) {
  try {
    return await AuditLog.create(data);
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error to prevent audit logging from breaking the main flow
  }
};

AuditLog.logLogin = async function(userId, ipAddress, userAgent, success = true) {
  return await AuditLog.logAction({
    user_id: userId,
    action: success ? 'LOGIN_SUCCESS' : 'LOGIN_FAILED',
    entity_type: 'User',
    entity_id: userId,
    ip_address: ipAddress,
    user_agent: userAgent,
    status_code: success ? 200 : 401
  });
};

AuditLog.logLogout = async function(userId, ipAddress, userAgent) {
  return await AuditLog.logAction({
    user_id: userId,
    action: 'LOGOUT',
    entity_type: 'User',
    entity_id: userId,
    ip_address: ipAddress,
    user_agent: userAgent,
    status_code: 200
  });
};

AuditLog.logCreate = async function(userId, entityType, entityId, newValues, req = null) {
  return await AuditLog.logAction({
    user_id: userId,
    action: 'CREATE',
    entity_type: entityType,
    entity_id: entityId,
    new_values: newValues,
    ip_address: req?.ip,
    user_agent: req?.get('user-agent'),
    request_method: req?.method,
    request_url: req?.originalUrl,
    status_code: 201
  });
};

AuditLog.logUpdate = async function(userId, entityType, entityId, oldValues, newValues, req = null) {
  return await AuditLog.logAction({
    user_id: userId,
    action: 'UPDATE',
    entity_type: entityType,
    entity_id: entityId,
    old_values: oldValues,
    new_values: newValues,
    ip_address: req?.ip,
    user_agent: req?.get('user-agent'),
    request_method: req?.method,
    request_url: req?.originalUrl,
    status_code: 200
  });
};

AuditLog.logDelete = async function(userId, entityType, entityId, oldValues, req = null) {
  return await AuditLog.logAction({
    user_id: userId,
    action: 'DELETE',
    entity_type: entityType,
    entity_id: entityId,
    old_values: oldValues,
    ip_address: req?.ip,
    user_agent: req?.get('user-agent'),
    request_method: req?.method,
    request_url: req?.originalUrl,
    status_code: 200
  });
};

AuditLog.logPasswordChange = async function(userId, ipAddress, userAgent, success = true) {
  return await AuditLog.logAction({
    user_id: userId,
    action: success ? 'PASSWORD_CHANGE_SUCCESS' : 'PASSWORD_CHANGE_FAILED',
    entity_type: 'User',
    entity_id: userId,
    ip_address: ipAddress,
    user_agent: userAgent,
    status_code: success ? 200 : 400
  });
};

AuditLog.logPasswordReset = async function(userId, ipAddress, userAgent) {
  return await AuditLog.logAction({
    user_id: userId,
    action: 'PASSWORD_RESET',
    entity_type: 'User',
    entity_id: userId,
    ip_address: ipAddress,
    user_agent: userAgent,
    status_code: 200
  });
};

AuditLog.logEmailVerification = async function(userId, ipAddress, userAgent) {
  return await AuditLog.logAction({
    user_id: userId,
    action: 'EMAIL_VERIFIED',
    entity_type: 'User',
    entity_id: userId,
    ip_address: ipAddress,
    user_agent: userAgent,
    status_code: 200
  });
};

module.exports = AuditLog;
