const Joi = require('joi');

// Validation schemas
const categorySchemas = {
  // Create category validation
  createCategory: Joi.object({
    category_name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .trim()
      .messages({
        'string.base': 'Category name must be a string',
        'string.empty': 'Category name is required',
        'string.min': 'Category name must be at least 2 characters long',
        'string.max': 'Category name must not exceed 100 characters',
        'any.required': 'Category name is required'
      }),
    description: Joi.string()
      .allow('', null)
      .max(5000)
      .trim()
      .messages({
        'string.base': 'Description must be a string',
        'string.max': 'Description must not exceed 5000 characters'
      })
  }),

  // Update category validation
  updateCategory: Joi.object({
    category_name: Joi.string()
      .min(2)
      .max(100)
      .trim()
      .messages({
        'string.base': 'Category name must be a string',
        'string.min': 'Category name must be at least 2 characters long',
        'string.max': 'Category name must not exceed 100 characters'
      }),
    description: Joi.string()
      .allow('', null)
      .max(5000)
      .trim()
      .messages({
        'string.base': 'Description must be a string',
        'string.max': 'Description must not exceed 5000 characters'
      })
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update'
  }),

  // Category ID validation
  categoryId: Joi.object({
    id: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.base': 'Category ID must be a string',
        'string.guid': 'Category ID must be a valid UUID',
        'any.required': 'Category ID is required'
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
      .valid('category_name', 'created_at', 'updated_at', '-category_name', '-created_at', '-updated_at')
      .default('-created_at')
      .messages({
        'string.base': 'Sort must be a string',
        'any.only': 'Sort must be one of: category_name, created_at, updated_at (prefix with - for descending)'
      })
  }),

  // Bulk create categories validation
  bulkCreateCategories: Joi.object({
    categories: Joi.array()
      .items(
        Joi.object({
          category_name: Joi.string()
            .min(2)
            .max(100)
            .required()
            .trim(),
          description: Joi.string()
            .allow('', null)
            .max(5000)
            .trim()
        })
      )
      .min(1)
      .max(50)
      .required()
      .messages({
        'array.base': 'Categories must be an array',
        'array.min': 'At least one category is required',
        'array.max': 'Cannot create more than 50 categories at once',
        'any.required': 'Categories array is required'
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
  categorySchemas,
  validateRequest
};
