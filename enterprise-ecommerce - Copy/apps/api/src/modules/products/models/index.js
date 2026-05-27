const Brand = require('./Brand');
const Category = require('./Category');

const models = {
  Brand,
  Category
};

// Setup associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
