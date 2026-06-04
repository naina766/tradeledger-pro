const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');

const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./utils/logger');
const { initializeDatabase } = require('./config/db');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const { swaggerUi, swaggerDocs } = require('./docs/swagger');
const ApiResponse = require('./utils/apiResponse');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan Request Logging integrated with Winston
const morganStream = {
  write: (message) => logger.info(message.trim())
};
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream: morganStream }));

// Health Check API
const healthCheck = (req, res) => {
  return ApiResponse.success(res, 'TradeLedger Pro API is healthy', {
    uptime: process.uptime(),
    timestamp: new Date()
  });
};
app.get('/health', healthCheck);
app.get('/api/v1/health', healthCheck);


// Swagger API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API version 1 Routes
app.use('/api/v1', routes);

// Route Not Found Handler (404)
app.use((req, res, next) => {
  const err = new Error(`Cannot find ${req.originalUrl} on this server`);
  err.statusCode = 404;
  err.isOperational = true;
  next(err);
});

// Global Error Handler
app.use(errorMiddleware);

// Initialize DB and startup server
async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    logger.info(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    logger.info(`API Docs available at http://localhost:${PORT}/api-docs`);
  });
}

// Start API Server
if (require.main === module) {
  startServer();
}

module.exports = app;
