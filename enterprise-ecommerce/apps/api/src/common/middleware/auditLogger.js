const AuditLog = require('../../modules/auth/models/AuditLog');

/**
 * Middleware to automatically log all requests
 */
const auditLogger = (options = {}) => {
  const {
    excludePaths = ['/health', '/api/docs'],
    excludeMethods = ['GET'],
    logGetRequests = false
  } = options;

  return async (req, res, next) => {
    // Skip excluded paths
    if (excludePaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    // Skip excluded methods unless explicitly enabled
    if (!logGetRequests && excludeMethods.includes(req.method)) {
      return next();
    }

    // Capture response
    const originalSend = res.send;
    let responseBody;

    res.send = function(data) {
      responseBody = data;
      originalSend.call(this, data);
    };

    // Log after response is sent
    res.on('finish', async () => {
      try {
        const userId = req.user?.userId || req.user?.id || null;
        
        // Determine action based on method and path
        let action = req.method;
        let entityType = 'Unknown';
        let entityId = null;

        // Extract entity info from path
        const pathParts = req.path.split('/').filter(Boolean);
        if (pathParts.length >= 3) {
          entityType = pathParts[2]; // e.g., /api/v1/products -> products
          if (pathParts.length >= 4 && pathParts[3].match(/^[0-9a-f-]{36}$/i)) {
            entityId = pathParts[3]; // UUID
          }
        }

        // Map HTTP methods to actions
        const actionMap = {
          'POST': 'CREATE',
          'PUT': 'UPDATE',
          'PATCH': 'UPDATE',
          'DELETE': 'DELETE',
          'GET': 'READ'
        };

        action = actionMap[req.method] || req.method;

        // Don't log sensitive data
        const sanitizedBody = { ...req.body };
        if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
        if (sanitizedBody.currentPassword) sanitizedBody.currentPassword = '[REDACTED]';
        if (sanitizedBody.newPassword) sanitizedBody.newPassword = '[REDACTED]';

        await AuditLog.logAction({
          user_id: userId,
          action,
          entity_type: entityType,
          entity_id: entityId,
          new_values: req.method !== 'GET' ? sanitizedBody : null,
          ip_address: req.ip || req.connection.remoteAddress,
          user_agent: req.get('user-agent'),
          request_method: req.method,
          request_url: req.originalUrl,
          status_code: res.statusCode,
          error_message: res.statusCode >= 400 ? responseBody : null
        });
      } catch (error) {
        console.error('Audit logging error:', error);
        // Don't throw error to prevent audit logging from breaking the main flow
      }
    });

    next();
  };
};

/**
 * Manual audit logging helper
 */
const logAudit = async (req, action, entityType, entityId, oldValues = null, newValues = null) => {
  try {
    const userId = req.user?.userId || req.user?.id || null;

    await AuditLog.logAction({
      user_id: userId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_values: oldValues,
      new_values: newValues,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.get('user-agent'),
      request_method: req.method,
      request_url: req.originalUrl,
      status_code: 200
    });
  } catch (error) {
    console.error('Manual audit logging error:', error);
  }
};

module.exports = {
  auditLogger,
  logAudit
};
