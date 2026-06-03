const { prisma } = require('../config/db');

class UserRepository {
  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  static async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  static async create({ name, email, password, role = 'user' }) {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: role // Matches Prisma schema ENUM (user/admin lowercase)
      }
    });
    return user.id;
  }

  static async update(id, { name, email, password }) {
    const data = { name, email };
    if (password) {
      data.password = password;
    }

    const updated = await prisma.user.update({
      where: { id },
      data
    });
    return !!updated;
  }

  static async findAll() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  static async getActiveUsersCount() {
    // Count users who have logged at least one trade
    return await prisma.user.count({
      where: {
        trades: {
          some: {}
        }
      }
    });
  }
}

module.exports = UserRepository;
