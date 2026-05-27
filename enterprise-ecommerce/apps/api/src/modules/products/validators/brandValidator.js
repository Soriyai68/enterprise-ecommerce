const Joi = require('joi');

// Validation schemas
const brandSchemas = {
  // Create brand validation
  createBrand: Joi.object({
    brand_name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .trim()
      .messages({
        'string.base': 'Brand name must be a string',
        'string.empty': 'Brand name is required',
        'string.min': 'Brand name must be at least 2 characters long',
        'string.max': 'Brand name must not exceed 100 characters',
        'any.required': 'Brand name is required'
      }),
    description: Joi.string()
      .allow('', null)
      .max(5000)
      .trim()
      .messages({
        'string.base': 'Description must be a string',
        'string.max': 'Description must not exceed 5000 characters'
      }),
    category_id: Joi.string()
      .uuid()
      .allow(null)
      .messages({
        'string.base': 'Category ID must be a string',
        'string.guid': 'Category ID must be a valid UUID'
      })
  }),

  // Update brand validation
  updateBrand: Joi.object({
    brand_name: Joi.string()
      .min(2)
      .max(100)
      .trim()
      .messages({
        'string.base': 'Brand name must be a string',
        'string.min': 'Brand name must be at least 2 characters long',
        'string.max': 'Brand name must not exceed 100 characters'
      }),
    description: Joi.string()
      .allow('', null)
      .max(5000)
      .trim()
      .messages({
        'string.base': 'Description must be a string',
        'string.max': 'Description must not exceed 5000 characters'
      }),
    category_id: Joi.string()
      .uuid()
      .allow(null)
      .messages({
        'string.base': 'Category ID must be a string',
        'string.guid': 'Category ID must be a valid UUID'
      })
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update'
  }),

  // Brand ID validation
  brandId: Joi.object({
    id: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.base': 'Brand ID must be a string',
        'string.guid': 'Brand ID must be a valid UUID',
        'any.required': 'Brand ID is required'
      })
  }),

  // Query parameters validation
  queryParams: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        'number.base': 'Page must be a number',
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1'
      }),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .messages({
        'number.base': 'Limit must be a number',
        'number.integer': 'Limit must be an integer',
        'number.min': 'Limit must be at least 1',
        'number.max': 'Limit must not exceed 100'
      }),
    search: Joi.string()
      .allow('', null)
      .max(100)
      .trim()
      .messages({
        'string.base': 'Search must be a string',
        'string.max': 'Search must not exceed 100 characters'
      }),
    sort: Joi.string()
      .valid('brand_name', 'created_at', 'updated_at', '-brand_name', '-created_at', '-updated_at')
      .default('-created_at')
      .messages({
        'string.base': 'Sort must be a string',
        'any.only': 'Sort must be one of: brand_name, created_at, updated_at (prefix with - for descending)'
      }),
    category_id: Joi.string()
      .uuid()
      .allow('', null)
      .messages({
        'string.base': 'Category ID must be a string',
        'string.guid': 'Category ID must be a valid UUID'
      })
  })
};

// Middleware to validate request
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    // Replace request data with validated and sanitized data
    req[property] = value;
    next();
  };
};

module.exports = {
  brandSchemas,
  validateRequest
};
