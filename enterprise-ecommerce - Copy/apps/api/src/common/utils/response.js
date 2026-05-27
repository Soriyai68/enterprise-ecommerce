/**
 * Standard API response format
 */
class ApiResponse {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data
    });
  }

  static error(res, message = 'Error', statusCode = 500, errors = null) {
    const response = {
      status: 'error',
      message
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  static paginated(res, data, pagination, message = 'Success') {
    return res.status(200).json({
      status: 'success',
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit)
      }
    });
  }
}

// Helper function for success responses
const successResponse = (res, { message = 'Success', data = null, statusCode = 200 }) => {
  return ApiResponse.success(res, data, message, statusCode);
};

module.exports = { ApiResponse, successResponse };
