const Joi = require('joi');

// Validation schemas
const cartSchemas = {
  // Add item to cart validation
  addToCart: Joi.object({
    product_id: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.base': 'Product ID must be a string',
        'string.guid': 'Product ID must be a valid UUID',
        'any.required': 'Product ID is required'
      }),
    quantity: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        'number.base': 'Quantity must be a number',
        'number.integer': 'Quantity must be an integer',
        'number.min': 'Quantity must be at least 1'
      })
  }),

  // Update cart item validation
  updateCartItem: Joi.object({
    quantity: Joi.number()
      .integer()
      .min(1)
      .required()
      .messages({
        'number.base': 'Quantity must be a number',
        'number.integer': 'Quantity must be an integer',
        'number.min': 'Quantity must be at least 1',
        'any.required': 'Quantity is required'
      })
  }),

  // Cart item ID validation
  cartItemId: Joi.object({
    itemId: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.base': 'Cart item ID must be a string',
        'string.guid': 'Cart item ID must be a valid UUID',
        'any.required': 'Cart item ID is required'
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
  cartSchemas,
  validateRequest
};
