const express = require('express');
const TradeController = require('../controllers/tradeController');
const authMiddleware = require('../middlewares/authMiddleware');
const { apiLimiter } = require('../middlewares/rateLimitMiddleware');
const { tradeValidator } = require('../validators/tradeValidator');

const router = express.Router();

// Apply authMiddleware globally to all trade routes
router.use(authMiddleware);
router.use(apiLimiter);

router.post('/', tradeValidator, TradeController.createTrade);
router.get('/', TradeController.getTrades);
router.get('/analytics', TradeController.getAnalytics);
router.get('/:id', TradeController.getTradeById);
router.put('/:id', tradeValidator, TradeController.updateTrade);
router.delete('/:id', TradeController.deleteTrade);

module.exports = router;
