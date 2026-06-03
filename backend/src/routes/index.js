const express = require('express');
const authRoutes = require('./authRoutes');
const tradeRoutes = require('./tradeRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/trades', tradeRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
