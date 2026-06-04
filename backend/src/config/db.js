const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'info', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
    { level: 'error', emit: 'stdout' }
  ]
});

// Forward Prisma database queries to Winston Logger
prisma.$on('query', (e) => {
  logger.debug(`Prisma SQL: ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`);
});

async function initializeDatabase() {
  try {
    // Check connection health
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection established successfully with Neon PostgreSQL via Prisma Client');
  } catch (error) {
    logger.error('Failed to establish database connection check: %o', error);
  }
}

module.exports = {
  prisma,
  initializeDatabase
};
