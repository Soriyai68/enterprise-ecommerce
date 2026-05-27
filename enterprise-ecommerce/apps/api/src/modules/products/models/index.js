const Brand = require('./Brand');
const Category = require('./Category');
const Product = require('./Product');

const models = {
  Brand,
  Category,
  Product
};

// Setup associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
