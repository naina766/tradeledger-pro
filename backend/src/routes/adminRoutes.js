const express = require('express');
const AdminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { apiLimiter } = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

// Apply auth, admin-role and rate limiting globally
router.use(authMiddleware);
router.use(roleMiddleware('admin'));
router.use(apiLimiter);

router.get('/users', AdminController.getUsers);
router.get('/trades', AdminController.getTrades);
router.get('/analytics', AdminController.getAnalytics);
router.delete('/trades/:id', AdminController.deleteTrade);

module.exports = router;
