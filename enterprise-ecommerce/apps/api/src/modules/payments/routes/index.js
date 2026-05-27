const express = require('express');
const router = express.Router();

const paymentRoutes = require('./paymentRoutes');

// Mount routes
router.use('/', paymentRoutes);

module.exports = router;
