const User = require('./User');
const Role = require('./Role');
const RoleUser = require('./RoleUser');
const Permission = require('./Permission');
const PermissionRole = require('./PermissionRole');

// Initialize associations
const models = {
  User,
  Role,
  RoleUser,
  Permission,
  PermissionRole
};

// Set up associations if they exist
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  User,
  Role,
  RoleUser,
  Permission,
  PermissionRole
};
