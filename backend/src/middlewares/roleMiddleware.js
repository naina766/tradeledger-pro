const CustomError = require('../utils/customError');

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new CustomError('User authentication details not found', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new CustomError('Forbidden: Access denied. Insufficient permissions.', 403));
    }

    next();
  };
};

module.exports = roleMiddleware;
