const express = require('express');
const router = express.Router();

const brandRoutes = require('./brandRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');

// Mount routes
router.use('/brands', brandRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);

module.exports = router;
