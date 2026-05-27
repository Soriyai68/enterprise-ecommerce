const AuditLog = require('../models/AuditLog');
const { User } = require('../models');
const { Op } = require('sequelize');

class AuditService {
  /**
   * Get audit logs with pagination and filters
   */
  async getAuditLogs(queryParams) {
    const {
      page = 1,
      limit = 50,
      user_id,
      action,
      entity_type,
      entity_id,
      start_date,
      end_date,
      sort = '-created_at'
    } = queryParams;

    const offset = (page - 1) * limit;

    // Build where clause
    const whereClause = {};

    if (user_id) {
      whereClause.user_id = user_id;
    }

    if (action) {
      whereClause.action = action;
    }

    if (entity_type) {
      whereClause.entity_type = entity_type;
    }

    if (entity_id) {
      whereClause.entity_id = entity_id;
    }

    if (start_date || end_date) {
      whereClause.created_at = {};
      if (start_date) whereClause.created_at[Op.gte] = new Date(start_date);
      if (end_date) whereClause.created_at[Op.lte] = new Date(end_date);
    }

    // Parse sort parameter
    const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
    const sortOrder = sort.startsWith('-') ? 'DESC' : 'ASC';

    const { count, rows } = await AuditLog.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortField, sortOrder]],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName']
        }
      ]
    });

    return {
      logs: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Get audit logs for specific entity
   */
  async getEntityAuditHistory(entityType, entityId) {
    const logs = await AuditLog.findAll({
      where: {
        entity_type: entityType,
        entity_id: entityId
      },
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName']
        }
      ]
    });

    return logs;
  }

  /**
   * Get user activity logs
   */
  async getUserActivity(userId, queryParams = {}) {
    const { page = 1, limit = 50, start_date, end_date } = queryParams;
    const offset = (page - 1) * limit;

    const whereClause = { user_id: userId };

    if (start_date || end_date) {
      whereClause.created_at = {};
      if (start_date) whereClause.created_at[Op.gte] = new Date(start_date);
      if (end_date) whereClause.created_at[Op.lte] = new Date(end_date);
    }

    const { count, rows } = await AuditLog.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    return {
      logs: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * Get audit statistics
   */
  async getAuditStats(queryParams = {}) {
    const { start_date, end_date, user_id } = queryParams;

    const whereClause = {};

    if (user_id) {
      whereClause.user_id = user_id;
    }

    if (start_date || end_date) {
      whereClause.created_at = {};
      if (start_date) whereClause.created_at[Op.gte] = new Date(start_date);
      if (end_date) whereClause.created_at[Op.lte] = new Date(end_date);
    }

    const totalLogs = await AuditLog.count({ where: whereClause });

    const actionCounts = await AuditLog.findAll({
      where: whereClause,
      attributes: [
        'action',
        [AuditLog.sequelize.fn('COUNT', AuditLog.sequelize.col('action')), 'count']
      ],
      group: ['action'],
      raw: true
    });

    const entityCounts = await AuditLog.findAll({
      where: whereClause,
      attributes: [
        'entity_type',
        [AuditLog.sequelize.fn('COUNT', AuditLog.sequelize.col('entity_type')), 'count']
      ],
      group: ['entity_type'],
      raw: true
    });

    const userCounts = await AuditLog.findAll({
      where: whereClause,
      attributes: [
        'user_id',
        [AuditLog.sequelize.fn('COUNT', AuditLog.sequelize.col('user_id')), 'count']
      ],
      group: ['user_id'],
      order: [[AuditLog.sequelize.fn('COUNT', AuditLog.sequelize.col('user_id')), 'DESC']],
      limit: 10,
      raw: true
    });

    return {
      totalLogs,
      actionCounts,
      entityCounts,
      topUsers: userCounts
    };
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit = 20) {
    const logs = await AuditLog.findAll({
      limit: parseInt(limit),
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'firstName', 'lastName']
        }
      ]
    });

    return logs;
  }
}

module.exports = new AuditService();
