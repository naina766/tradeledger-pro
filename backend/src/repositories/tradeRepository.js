const { prisma } = require('../config/db');

class TradeRepository {
  static mapToSnakeCase(t) {
    if (!t) return null;
    return {
      id: t.id,
      asset_name: t.assetName,
      asset_category: t.assetCategory,
      exchange: t.exchange,
      trade_type: t.tradeType,
      status: t.status,
      entry_price: parseFloat(t.entryPrice.toString()),
      exit_price: parseFloat(t.exitPrice.toString()),
      quantity: parseFloat(t.quantity.toString()),
      profit_loss: parseFloat(t.profitLoss.toString()),
      trade_date: t.tradeDate,
      notes: t.notes,
      user_id: t.userId,
      created_at: t.createdAt,
      updated_at: t.updatedAt
    };
  }

  static async create({
    asset_name,
    asset_category,
    exchange,
    trade_type,
    status = 'CLOSED',
    entry_price,
    exit_price = 0,
    quantity,
    profit_loss = 0,
    notes,
    trade_date,
    user_id
  }) {
    const trade = await prisma.trade.create({
      data: {
        assetName: asset_name,
        assetCategory: asset_category,
        exchange: exchange || null,
        tradeType: trade_type,
        status: status,
        entryPrice: entry_price,
        exitPrice: exit_price,
        quantity: quantity,
        profitLoss: profit_loss,
        notes: notes || null,
        tradeDate: trade_date ? new Date(trade_date) : new Date(),
        userId: user_id
      }
    });
    return trade.id;
  }

  static async findById(id) {
    const trade = await prisma.trade.findUnique({
      where: { id }
    });
    return this.mapToSnakeCase(trade);
  }

  static async update(id, data) {
    const updateData = {};
    if (data.asset_name !== undefined) updateData.assetName = data.asset_name;
    if (data.asset_category !== undefined) updateData.assetCategory = data.asset_category;
    if (data.exchange !== undefined) updateData.exchange = data.exchange || null;
    if (data.trade_type !== undefined) updateData.tradeType = data.trade_type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.entry_price !== undefined) updateData.entryPrice = data.entry_price;
    if (data.exit_price !== undefined) updateData.exitPrice = data.exit_price;
    if (data.quantity !== undefined) updateData.quantity = data.quantity;
    if (data.profit_loss !== undefined) updateData.profitLoss = data.profit_loss;
    if (data.notes !== undefined) updateData.notes = data.notes || null;
    if (data.trade_date !== undefined) updateData.tradeDate = data.trade_date ? new Date(data.trade_date) : undefined;

    const updated = await prisma.trade.update({
      where: { id },
      data: updateData
    });
    return !!updated;
  }

  static async delete(id) {
    const deleted = await prisma.trade.delete({
      where: { id }
    });
    return !!deleted;
  }

  static async findAll({
    user_id = null,
    page = 1,
    limit = 10,
    search = '',
    trade_type = '',
    asset_category = '',
    status = '',
    sort = 'trade_date',
    order = 'DESC'
  }) {
    const where = {};
    if (user_id) {
      where.userId = user_id;
    }
    if (search) {
      where.assetName = {
        contains: search,
        mode: 'insensitive'
      };
    }
    if (trade_type) {
      where.tradeType = trade_type;
    }
    if (asset_category) {
      where.assetCategory = asset_category;
    }
    if (status) {
      where.status = status;
    }

    const sortMap = {
      'trade_date': 'tradeDate',
      'profit_loss': 'profitLoss',
      'entry_price': 'entryPrice',
      'quantity': 'quantity',
      'asset_name': 'assetName'
    };
    const prismaSortField = sortMap[sort] || 'tradeDate';
    const prismaOrder = order.toLowerCase() === 'asc' ? 'asc' : 'desc';

    const offset = (page - 1) * limit;

    const trades = await prisma.trade.findMany({
      where,
      orderBy: {
        [prismaSortField]: prismaOrder
      },
      skip: offset,
      take: limit
    });

    const total = await prisma.trade.count({ where });

    return {
      trades: trades.map(t => this.mapToSnakeCase(t)),
      total
    };
  }

  static async getAnalytics(userId) {
    const totalTrades = await prisma.trade.count({ where: { userId } });
    
    const wins = await prisma.trade.count({
      where: { userId, profitLoss: { gt: 0 } }
    });

    const losses = await prisma.trade.count({
      where: { userId, profitLoss: { lt: 0 } }
    });

    const profitSum = await prisma.trade.aggregate({
      where: { userId },
      _sum: { profitLoss: true }
    });

    const bestAssetGroup = await prisma.trade.groupBy({
      by: ['assetName'],
      where: { userId },
      _sum: { profitLoss: true },
      orderBy: {
        _sum: {
          profitLoss: 'desc'
        }
      },
      take: 1
    });

    const bestAsset = bestAssetGroup[0]?.assetName || 'N/A';
    const winRate = totalTrades > 0 ? parseFloat(((wins / totalTrades) * 100).toFixed(2)) : 0;
    const netProfit = parseFloat(parseFloat(profitSum._sum.profitLoss || 0).toFixed(2));

    return {
      totalTrades,
      winningTrades: wins,
      losingTrades: losses,
      winRate,
      netProfit,
      bestAsset
    };
  }

  static async getAdminAnalytics() {
    const totalUsers = await prisma.user.count();
    const totalTrades = await prisma.trade.count();
    
    const activeUsers = await prisma.user.count({
      where: {
        trades: {
          some: {}
        }
      }
    });

    const profitSum = await prisma.trade.aggregate({
      _sum: { profitLoss: true }
    });

    const topAssetsGroup = await prisma.trade.groupBy({
      by: ['assetName'],
      _count: { id: true },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    });

    const topAssets = topAssetsGroup.map(item => ({
      asset_name: item.assetName,
      tradeCount: item._count.id
    }));

    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    const recentRegistrations = recentUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      created_at: u.createdAt
    }));

    return {
      totalUsers,
      totalTrades,
      activeUsers,
      totalProfit: parseFloat(parseFloat(profitSum._sum.profitLoss || 0).toFixed(2)),
      topAssets,
      recentRegistrations
    };
  }
}

module.exports = TradeRepository;
