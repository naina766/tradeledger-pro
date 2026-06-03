const AdminService = require('../services/adminService');
const TradeService = require('../services/tradeService');
const ApiResponse = require('../utils/apiResponse');

class AdminController {
  static async getUsers(req, res, next) {
    try {
      const users = await AdminService.getUsers();
      return ApiResponse.success(res, 'Users fetched successfully', users, 200);
    } catch (err) {
      next(err);
    }
  }

  static async getTrades(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1');
      const limit = parseInt(req.query.limit || '10');

      const { trades, total } = await AdminService.getTrades(req.query);
      const totalPages = Math.ceil(total / limit);

      const pagination = {
        page,
        limit,
        total,
        totalPages
      };

      return ApiResponse.success(res, 'Global trades fetched successfully', trades, 200, pagination);
    } catch (err) {
      next(err);
    }
  }

  static async deleteTrade(req, res, next) {
    try {
      await TradeService.deleteTrade(null, req.params.id, 'admin');
      return ApiResponse.success(res, 'Trade deleted by administrator', {}, 200);
    } catch (err) {
      next(err);
    }
  }

  static async getAnalytics(req, res, next) {
    try {
      const analytics = await AdminService.getAnalytics();
      return ApiResponse.success(res, 'Admin analytics retrieved successfully', analytics, 200);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AdminController;
