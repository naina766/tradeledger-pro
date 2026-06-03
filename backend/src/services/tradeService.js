const TradeRepository = require('../repositories/tradeRepository');
const CustomError = require('../utils/customError');

class TradeService {
  static calculateProfitLoss(type, entryPrice, exitPrice, quantity, status) {
    if (status === 'OPEN') return 0;
    
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice || 0);
    const qty = parseFloat(quantity);

    if (type === 'BUY') {
      return (exit - entry) * qty;
    } else if (type === 'SELL') {
      return (entry - exit) * qty;
    }
    return 0;
  }

  static async createTrade(userId, tradeData) {
    const profitLoss = this.calculateProfitLoss(
      tradeData.trade_type,
      tradeData.entry_price,
      tradeData.exit_price,
      tradeData.quantity,
      tradeData.status
    );

    const tradeId = await TradeRepository.create({
      ...tradeData,
      profit_loss: profitLoss,
      user_id: userId
    });

    return await TradeRepository.findById(tradeId);
  }

  static async getTradeById(userId, tradeId, userRole) {
    const trade = await TradeRepository.findById(tradeId);
    if (!trade) {
      throw new CustomError('Trade not found', 404);
    }

    if (userRole !== 'admin' && trade.user_id !== userId) {
      throw new CustomError('Access denied', 403);
    }

    return trade;
  }

  static async updateTrade(userId, tradeId, updateData) {
    const trade = await TradeRepository.findById(tradeId);
    if (!trade) {
      throw new CustomError('Trade not found', 404);
    }

    if (trade.user_id !== userId) {
      throw new CustomError('Access denied. You can only update your own trades.', 403);
    }

    // Recalculate profit loss if prices, quantity, status or type change
    const merged = { ...trade, ...updateData };
    const profitLoss = this.calculateProfitLoss(
      merged.trade_type,
      merged.entry_price,
      merged.exit_price,
      merged.quantity,
      merged.status
    );

    await TradeRepository.update(tradeId, {
      ...updateData,
      profit_loss: profitLoss
    });

    return await TradeRepository.findById(tradeId);
  }

  static async deleteTrade(userId, tradeId, userRole) {
    const trade = await TradeRepository.findById(tradeId);
    if (!trade) {
      throw new CustomError('Trade not found', 404);
    }

    if (userRole !== 'admin' && trade.user_id !== userId) {
      throw new CustomError('Access denied. You can only delete your own trades.', 403);
    }

    await TradeRepository.delete(tradeId);
    return true;
  }

  static async getTrades(userId, query) {
    const {
      page = 1,
      limit = 10,
      search = '',
      trade_type = '',
      asset_category = '',
      status = '',
      sort = 'trade_date',
      order = 'DESC'
    } = query;

    return await TradeRepository.findAll({
      user_id: userId,
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      trade_type,
      asset_category,
      status,
      sort,
      order
    });
  }

  static async getAnalytics(userId) {
    return await TradeRepository.getAnalytics(userId);
  }
}

module.exports = TradeService;
