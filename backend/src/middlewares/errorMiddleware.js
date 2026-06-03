const logger = require('../utils/logger');
const ApiResponse = require('../utils/apiResponse');

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log detailed error stack using winston
  logger.error(`Error URL: ${req.originalUrl} | Method: ${req.method} | Status: ${err.statusCode} | Msg: ${err.message}`, err);

  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err
    });
  }

  // Production error handling
  if (err.isOperational) {
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  // Generic DB or unknown library errors
  return ApiResponse.error(res, 'Something went wrong on our end. Please try again later.', 500);
};

module.exports = errorMiddleware;
