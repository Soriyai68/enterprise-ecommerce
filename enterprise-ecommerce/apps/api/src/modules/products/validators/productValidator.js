const Joi = require('joi');

// Validation schemas
const productSchemas = {
  // Create product validation
  createProduct: Joi.object({
    category_id: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.base': 'Category ID must be a string',
        'string.guid': 'Category ID must be a valid UUID',
        'any.required': 'Category ID is required'
      }),
    brand_id: Joi.string()
      .uuid()
      .allow(null)
      .messages({
        'string.base': 'Brand ID must be a string',
        'string.guid': 'Brand ID must be a valid UUID'
      }),
    name: Joi.string()
      .min(2)
      .max(255)
      .required()
      .trim()
      .messages({
        'string.base': 'Product name must be a string',
        'string.empty': 'Product name is required',
        'string.min': 'Product name must be at least 2 characters long',
        'string.max': 'Product name must not exceed 255 characters',
        'any.required': 'Product name is required'
      }),
    description: Joi.string()
      .allow('', null)
      .max(10000)
      .trim()
      .messages({
        'string.base': 'Description must be a string',
        'string.max': 'Description must not exceed 10000 characters'
      }),
    price: Joi.number()
      .min(0)
      .precision(2)
      .required()
      .messages({
        'number.base': 'Price must be a number',
        'number.min': 'Price must be greater than or equal to 0',
        'any.required': 'Price is required'
      }),
    compare_price: Joi.number()
      .min(0)
      .precision(2)
      .allow(null)
      .messages({
        'number.base': 'Compare price must be a number',
        'number.min': 'Compare price must be greater than or equal to 0'
      }),
    cost_price: Joi.number()
      .min(0)
      .precision(2)
      .allow(null)
      .messages({
        'number.base': 'Cost price must be a number',
        'number.min': 'Cost price must be greater than or equal to 0'
      }),
    stock: Joi.number()
      .integer()
      .min(0)
      .default(0)
      .messages({
        'number.base': 'Stock must be a number',
        'number.integer': 'Stock must be an integer',
        'number.min': 'Stock must be greater than or equal to 0'
      }),
    sku: Joi.string()
      .max(100)
      .allow('', null)
      .trim()
      .messages({
        'string.base': 'SKU must be a string',
        'string.max': 'SKU must not exceed 100 characters'
      }),
    image: Joi.string()
      .uri()
      .allow('', null)
      .max(500)
      .messages({
        'string.base': 'Image must be a string',
        'string.uri': 'Image must be a valid URL',
        'string.max': 'Image URL must not exceed 500 characters'
      }),
    images: Joi.array()
      .items(Joi.string().uri())
      .allow(null)
      .messages({
        'array.base': 'Images must be an array',
        'string.uri': 'Each image must be a valid URL'
      }),
    status: Joi.string()
      .valid('active', 'inactive', 'draft', 'out_of_stock')
      .default('draft')
      .messages({
        'string.base': 'Status must be a string',
        'any.only': 'Status must be one of: active, inactive, draft, out_of_stock'
      }),
    is_featured: Joi.boolean()
      .default(false)
      .messages({
        'boolean.base': 'Is featured must be a boolean'
      }),
    weight: Joi.number()
      .min(0)
      .precision(2)
      .allow(null)
      .messages({
        'number.base': 'Weight must be a number',
        'number.min': 'Weight must be greater than or equal to 0'
      }),
    dimensions: Joi.object({
      length: Joi.number().min(0).allow(null),
      width: Joi.number().min(0).allow(null),
      height: Joi.number().min(0).allow(null)
    })
      .allow(null)
      .messages({
        'object.base': 'Dimensions must be an object'
      }),
    meta_title: Joi.string()
      .max(255)
      .allow('', null)
      .trim()
      .messages({
        'string.base': 'Meta title must be a string',
        'string.max': 'Meta title must not exceed 255 characters'
      }),
    meta_description: Joi.string()
      .max(1000)
      .allow('', null)
      .trim()
      .messages({
        'string.base': 'Meta description must be a string',
        'string.max': 'Meta description must not exceed 1000 characters'
      }),
    meta_keywords: Joi.string()
      .max(500)
      .allow('', null)
      .trim()
      .messages({
        'string.base': 'Meta keywords must be a string',
        'string.max': 'Meta keywords must not exceed 500 characters'
      })
  }),

  // Update product validation
  updateProduct: Joi.object({
    category_id: Joi.string()
      .uuid()
      .messages({
        'string.base': 'Category ID must be a string',
        'string.guid': 'Category ID must be a valid UUID'
      }),
    brand_id: Joi.string()
      .uuid()
      .allow(null)
      .messages({
        'string.base': 'Brand ID must be a string',
        'string.guid': 'Brand ID must be a valid UUID'
      }),
    name: Joi.string()
      .min(2)
      .max(255)
      .trim()
      .messages({
        'string.base': 'Product name must be a string',
        'string.min': 'Product name must be at least 2 characters long',
        'string.max': 'Product name must not exceed 255 characters'
      }),
    description: Joi.string()
      .allow('', null)
      .max(10000)
      .trim()
      .messages({
        'string.base': 'Description must be a string',
        'string.max': 'Description must not exceed 10000 characters'
      }),
    price: Joi.number()
      .min(0)
      .precision(2)
      .messages({
        'number.base': 'Price must be a number',
        'number.min': 'Price must be greater than or equal to 0'
      }),
    compare_price: Joi.number()
      .min(0)
      .precision(2)
      .allow(null)
      .messages({
        'number.base': 'Compare price must be a number',
        'number.min': 'Compare price must be greater than or equal to 0'
      }),
    cost_price: Joi.number()
      .min(0)
      .precision(2)
      .allow(null)
      .messages({
        'number.base': 'Cost price must be a number',
        'number.min': 'Cost price must be greater than or equal to 0'
      }),
    stock: Joi.number()
      .integer()
      .min(0)
      .messages({
        'number.base': 'Stock must be a number',
        'number.integer': 'Stock must be an integer',
        'number.min': 'Stock must be greater than or equal to 0'
      }),
    sku: Joi.string()
      .max(100)
      .allow('', null)
      .trim()
      .messages({
        'string.base': 'SKU must be a string',
        'string.max': 'SKU must not exceed 100 characters'
      }),
    image: Joi.string()
      .uri()
      .allow('', null)
      .max(500)
      .messages({
        'string.base': 'Image must be a string',
        'string.uri': 'Image must be a valid URL',
        'string.max': 'Image URL must not exceed 500 characters'
      }),
    images: Joi.array()
      .items(Joi.string().uri())
      .allow(null)
      .messages({
        'array.base': 'Images must be an array',
        'string.uri': 'Each image must be a valid URL'
      }),
    status: Joi.string()
      .valid('active', 'inactive', 'draft', 'out_of_stock')
      .messages({
        'string.base': 'Status must be a string',
        'any.only': 'Status must be one of: active, inactive, draft, out_of_stock'
      }),
    is_featured: Joi.boolean()
      .messages({
        'boolean.base': 'Is featured must be a boolean'
      }),
    weight: Joi.number()
      .min(0)
      .precision(2)
      .allow(null)
      .messages({
        'number.base': 'Weight must be a number',
        'number.min': 'Weight must be greater than or equal to 0'
      }),
    dimensions: Joi.object({
      length: Joi.number().min(0).allow(null),
      width: Joi.number().min(0).allow(null),
      height: Joi.number().min(0).allow(null)
    })
      .allow(null)
      .messages({
        'object.base': 'Dimensions must be an object'
      }),
    meta_title: Joi.string()
      .max(255)
      .allow('', null)
      .trim()
      .messages({
        'string.base': 'Meta title must be a string',
        'string.max': 'Meta title must not exceed 255 characters'
      }),
    meta_description: Joi.string()
      .max(1000)
      .allow('', null)
      .trim()
      .messages({
        'string.base': 'Meta description must be a string',
        'string.max': 'Meta description must not exceed 1000 characters'
      }),
    meta_keywords: Joi.string()
      .max(500)
      .allow('', null)
      .trim()
      .messages({
        'string.base': 'Meta keywords must be a string',
        'string.max': 'Meta keywords must not exceed 500 characters'
      })
  }).min(1).messages({
    'object.min': 'At least one field must be provided for update'
  }),

  // Product ID validation
  productId: Joi.object({
    id: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.base': 'Product ID must be a string',
        'string.guid': 'Product ID must be a valid UUID',
        'any.required': 'Product ID is required'
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
    category_id: Joi.string()
      .uuid()
      .allow('', null)
      .messages({
        'string.base': 'Category ID must be a string',
        'string.guid': 'Category ID must be a valid UUID'
      }),
    brand_id: Joi.string()
      .uuid()
      .allow('', null)
      .messages({
        'string.base': 'Brand ID must be a string',
        'string.guid': 'Brand ID must be a valid UUID'
      }),
    status: Joi.string()
      .valid('active', 'inactive', 'draft', 'out_of_stock', '')
      .allow('', null)
      .messages({
        'string.base': 'Status must be a string',
        'any.only': 'Status must be one of: active, inactive, draft, out_of_stock'
      }),
    is_featured: Joi.boolean()
      .allow('', null)
      .messages({
        'boolean.base': 'Is featured must be a boolean'
      }),
    min_price: Joi.number()
      .min(0)
      .allow('', null)
      .messages({
        'number.base': 'Min price must be a number',
        'number.min': 'Min price must be greater than or equal to 0'
      }),
    max_price: Joi.number()
      .min(0)
      .allow('', null)
      .messages({
        'number.base': 'Max price must be a number',
        'number.min': 'Max price must be greater than or equal to 0'
      }),
    sort: Joi.string()
      .valid('name', 'price', 'stock', 'created_at', 'updated_at', '-name', '-price', '-stock', '-created_at', '-updated_at')
      .default('-created_at')
      .messages({
        'string.base': 'Sort must be a string',
        'any.only': 'Sort must be one of: name, price, stock, created_at, updated_at (prefix with - for descending)'
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
  productSchemas,
  validateRequest
};
