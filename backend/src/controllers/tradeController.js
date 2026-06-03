const TradeService = require('../services/tradeService');
const ApiResponse = require('../utils/apiResponse');

class TradeController {
  static async createTrade(req, res, next) {
    try {
      const trade = await TradeService.createTrade(req.user.userId, req.body);
      return ApiResponse.success(res, 'Trade recorded successfully', { trade }, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getTrades(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1');
      const limit = parseInt(req.query.limit || '10');
      
      const { trades, total } = await TradeService.getTrades(req.user.userId, req.query);
      const totalPages = Math.ceil(total / limit);

      const pagination = {
        page,
        limit,
        total,
        totalPages
      };

      return ApiResponse.success(res, 'Trades fetched successfully', trades, 200, pagination);
    } catch (err) {
      next(err);
    }
  }

  static async getTradeById(req, res, next) {
    try {
      const trade = await TradeService.getTradeById(req.user.userId, req.params.id, req.user.role);
      return ApiResponse.success(res, 'Trade retrieved successfully', { trade }, 200);
    } catch (err) {
      next(err);
    }
  }

  static async updateTrade(req, res, next) {
    try {
      const trade = await TradeService.updateTrade(req.user.userId, req.params.id, req.body);
      return ApiResponse.success(res, 'Trade updated successfully', { trade }, 200);
    } catch (err) {
      next(err);
    }
  }

  static async deleteTrade(req, res, next) {
    try {
      await TradeService.deleteTrade(req.user.userId, req.params.id, req.user.role);
      return ApiResponse.success(res, 'Trade deleted successfully', {}, 200);
    } catch (err) {
      next(err);
    }
  }

  static async getAnalytics(req, res, next) {
    try {
      const analytics = await TradeService.getAnalytics(req.user.userId);
      return ApiResponse.success(res, 'Analytics retrieved successfully', analytics, 200);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TradeController;
