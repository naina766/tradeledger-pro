const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/apiResponse');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    return ApiResponse.error(res, 'Too many login or registration requests, please try again after 15 minutes', 429);
  }
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 300, // Limit each IP to 300 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    return ApiResponse.error(res, 'Too many API requests, please slow down', 429);
  }
});

module.exports = {
  authLimiter,
  apiLimiter
};
