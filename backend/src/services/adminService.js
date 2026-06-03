const UserRepository = require('../repositories/userRepository');
const TradeRepository = require('../repositories/tradeRepository');

class AdminService {
  static async getUsers() {
    return await UserRepository.findAll();
  }

  static async getTrades(query) {
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
      user_id: null, // Admin sees all trades
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

  static async getAnalytics() {
    return await TradeRepository.getAdminAnalytics();
  }
}

module.exports = AdminService;
