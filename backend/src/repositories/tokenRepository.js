const { prisma } = require('../config/db');

class TokenRepository {
  static async create(token, userId, expiresAt) {
    const record = await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt
      }
    });
    return record.id;
  }

  static async findByToken(token) {
    return await prisma.refreshToken.findUnique({
      where: { token }
    });
  }

  static async deleteByToken(token) {
    try {
      await prisma.refreshToken.delete({
        where: { token }
      });
      return true;
    } catch (err) {
      // Prisma throws error if record not found
      return false;
    }
  }

  static async deleteByUserId(userId) {
    const result = await prisma.refreshToken.deleteMany({
      where: { userId }
    });
    return result.count > 0;
  }

  static async deleteExpired() {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
    return result.count;
  }
}

module.exports = TokenRepository;
