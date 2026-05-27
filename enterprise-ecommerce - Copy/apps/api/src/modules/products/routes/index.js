const express = require('express');
const router = express.Router();

const brandRoutes = require('./brandRoutes');
const categoryRoutes = require('./categoryRoutes');

// Mount routes
router.use('/brands', brandRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;
