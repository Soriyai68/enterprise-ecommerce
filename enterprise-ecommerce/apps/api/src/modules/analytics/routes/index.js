const express = require('express');
const router = express.Router();

const analyticsRoutes = require('./analyticsRoutes');

// Mount routes
router.use('/', analyticsRoutes);

module.exports = router;
