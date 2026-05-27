const config = require('../config');

/**
 * Extract pagination parameters from request
 */
const getPagination = (req) => {
  const page = parseInt(req.query.page) || config.pagination.defaultPage;
  const limit = Math.min(
    parseInt(req.query.limit) || config.pagination.defaultLimit,
    config.pagination.maxLimit
  );
  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

/**
 * Format pagination response
 */
const formatPaginationResponse = (data, total, page, limit) => {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
};

module.exports = { getPagination, formatPaginationResponse };
