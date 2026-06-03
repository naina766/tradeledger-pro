const jwt = require('jsonwebtoken');
const CustomError = require('../utils/customError');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new CustomError('Authentication token missing or invalid', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // Contains userId and role
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new CustomError('Token expired', 401));
    }
    return next(new CustomError('Token invalid', 401));
  }
};

module.exports = authMiddleware;
