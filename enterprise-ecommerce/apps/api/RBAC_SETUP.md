# RBAC (Role-Based Access Control) System Setup

## Overview
A complete RBAC system has been implemented with Users, Roles, Permissions, and their relationships.

## Database Schema

### Tables Created

#### 1. **users**
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `first_name`, `last_name` (String)
- `phone` (String, Optional)
- `role` (Enum: customer, admin, vendor, support)
- `status` (Enum: active, inactive, suspended, pending)
- `email_verified` (Boolean)
- `email_verification_token`, `email_verification_expires` (String, Date)
- `password_reset_token`, `password_reset_expires` (String, Date)
- `refresh_token` (Text)
- `last_login` (Date)
- `login_attempts` (Integer)
- `lock_until` (Date)
- `avatar` (String)
- `address` (JSON)
- `preferences` (JSON)
- `created_at`, `updated_at` (Timestamps)

#### 2. **roles**
- `id` (UUID, Primary Key)
- `code` (String, Unique) - e.g., "SUPER_ADMIN", "ADMIN"
- `name` (String) - Display name
- `module_name` (String) - Associated module
- `role_abbr` (String) - Abbreviation
- `is_super` (Boolean) - Super admin flag
- `created_at`, `updated_at` (Timestamps)
- `created_by`, `updated_by`, `deleted_by` (UUID, Foreign Keys to users)
- `deleted_at` (Date, Soft Delete)

#### 3. **permissions**
- `id` (UUID, Primary Key)
- `name` (String, Unique) - e.g., "users.view", "products.create"
- `display_name` (String) - Human-readable name
- `sort` (Integer) - Display order
- `group` (String) - Permission group/category
- `created_at`, `updated_at` (Timestamps)
- `deleted_at` (Date, Soft Delete)

#### 4. **role_user** (Junction Table)
- `role_id` (UUID, Foreign Key to roles)
- `user_id` (UUID, Foreign Key to users)
- Composite Primary Key: (role_id, user_id)

#### 5. **permission_role** (Junction Table)
- `role_id` (UUID, Foreign Key to roles)
- `permission_id` (UUID, Foreign Key to permissions)
- Composite Primary Key: (role_id, permission_id)

## Relationships

```
Users ←→ Roles ←→ Permissions
  ↓        ↓
role_user  permission_role
```

- **Users** can have multiple **Roles** (Many-to-Many)
- **Roles** can have multiple **Permissions** (Many-to-Many)
- **Roles** track audit information (created_by, updated_by, deleted_by)

## Default Roles

| Code | Name | Abbreviation | Super Admin | Module |
|------|------|--------------|-------------|--------|
| SUPER_ADMIN | Super Administrator | SA | Yes | auth |
| ADMIN | Administrator | ADM | No | auth |
| VENDOR | Vendor | VND | No | products |
| CUSTOMER | Customer | CUST | No | orders |
| SUPPORT | Support Staff | SUP | No | support |

## Default Permissions

### User Management
- `users.view` - View Users
- `users.create` - Create Users
- `users.edit` - Edit Users
- `users.delete` - Delete Users

### Role Management
- `roles.view` - View Roles
- `roles.create` - Create Roles
- `roles.edit` - Edit Roles
- `roles.delete` - Delete Roles

### Product Management
- `products.view` - View Products
- `products.create` - Create Products
- `products.edit` - Edit Products
- `products.delete` - Delete Products

### Order Management
- `orders.view` - View Orders
- `orders.create` - Create Orders
- `orders.edit` - Edit Orders
- `orders.delete` - Delete Orders

### Payment Management
- `payments.view` - View Payments
- `payments.process` - Process Payments
- `payments.refund` - Refund Payments

### Analytics
- `analytics.view` - View Analytics
- `analytics.export` - Export Analytics

### Settings
- `settings.view` - View Settings
- `settings.edit` - Edit Settings

## Role-Permission Assignments

### Super Admin
- **All permissions** (23 permissions)

### Admin
- User Management: view, create, edit
- Role Management: view
- Product Management: all
- Order Management: view, create, edit
- Payment Management: view, process
- Analytics: view, export
- Settings: view

### Vendor
- Product Management: view, create, edit
- Order Management: view, edit
- Analytics: view

### Customer
- Product Management: view
- Order Management: view, create

### Support
- User Management: view
- Product Management: view
- Order Management: view, edit
- Payment Management: view

## Usage Examples

### Get User with Roles and Permissions
```javascript
const { User, Role } = require('./src/modules/auth/models');

const user = await User.findByPk(userId, {
  include: [{
    model: Role,
    as: 'roles',
    include: ['permissions']
  }]
});
```

### Assign Role to User
```javascript
const user = await User.findByPk(userId);
const role = await Role.findOne({ where: { code: 'ADMIN' } });

await user.addRole(role);
```

### Check User Permissions
```javascript
const user = await User.findByPk(userId, {
  include: [{
    model: Role,
    as: 'roles',
    include: ['permissions']
  }]
});

// Get all user permissions
const permissions = user.roles.flatMap(role => 
  role.permissions.map(p => p.name)
);

// Check if user has specific permission
const hasPermission = permissions.includes('users.create');
```

### Assign Permission to Role
```javascript
const role = await Role.findOne({ where: { code: 'VENDOR' } });
const permission = await Permission.findOne({ where: { name: 'products.delete' } });

await role.addPermission(permission);
```

### Get Role with Permissions
```javascript
const role = await Role.findByPk(roleId, {
  include: ['permissions']
});

console.log(role.permissions); // Array of permission objects
```

## Middleware Example

### Permission Check Middleware
```javascript
const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [{
          model: Role,
          as: 'roles',
          include: ['permissions']
        }]
      });

      const permissions = user.roles.flatMap(role => 
        role.permissions.map(p => p.name)
      );

      if (permissions.includes(requiredPermission)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error checking permissions'
      });
    }
  };
};

// Usage in routes
router.post('/users', 
  authenticate, 
  checkPermission('users.create'), 
  createUser
);
```

## Files Created

### Models
- `src/modules/auth/models/Role.js`
- `src/modules/auth/models/RoleUser.js`
- `src/modules/auth/models/Permission.js`
- `src/modules/auth/models/PermissionRole.js`
- `src/modules/auth/models/index.js` (updated)

### Migrations
- `src/database/migrations/20240101000002-create-roles-table.js`
- `src/database/migrations/20240101000003-create-role-user-table.js`
- `src/database/migrations/20240101000004-create-permissions-table.js`
- `src/database/migrations/20240101000005-create-permission-role-table.js`

### Seeders
- `src/database/seeders/20240101000002-create-default-roles.js`
- `src/database/seeders/20240101000003-create-default-permissions.js`
- `src/database/seeders/20240101000004-assign-permissions-to-roles.js`

## Database Commands

### Run Migrations
```bash
npx sequelize-cli db:migrate
```

### Run Seeders
```bash
npx sequelize-cli db:seed:all
```

### Undo Last Migration
```bash
npx sequelize-cli db:migrate:undo
```

### Undo All Migrations
```bash
npx sequelize-cli db:migrate:undo:all
```

### Undo Last Seeder
```bash
npx sequelize-cli db:seed:undo
```

### Undo All Seeders
```bash
npx sequelize-cli db:seed:undo:all
```

## Next Steps

1. **Create Permission Middleware**: Implement middleware to check user permissions
2. **Create Role Management API**: Build CRUD endpoints for roles
3. **Create Permission Management API**: Build CRUD endpoints for permissions
4. **Update Auth Controller**: Add role/permission checks to existing endpoints
5. **Create Admin Panel**: Build UI for managing roles and permissions
6. **Add Permission Caching**: Implement Redis caching for permission checks
7. **Add Audit Logging**: Track permission changes and access attempts

## Security Considerations

1. **Super Admin Protection**: Prevent deletion or modification of super admin role
2. **Permission Validation**: Always validate permissions on the server side
3. **Role Hierarchy**: Consider implementing role hierarchy if needed
4. **Audit Trail**: Log all permission changes and access attempts
5. **Cache Invalidation**: Clear permission cache when roles/permissions change
6. **Rate Limiting**: Implement rate limiting on permission-sensitive endpoints
