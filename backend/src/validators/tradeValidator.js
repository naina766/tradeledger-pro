const { body, validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map(err => err.msg).join(', ');
    return ApiResponse.error(res, errorMsg, 400, errors.array());
  }
  next();
};

const tradeValidator = [
  body('asset_name')
    .trim()
    .notEmpty().withMessage('Asset Name is required')
    .isLength({ max: 50 }).withMessage('Asset Name cannot exceed 50 characters'),

  body('asset_category')
    .isIn(['CRYPTO', 'STOCK', 'FOREX', 'COMMODITY'])
    .withMessage('Asset Category must be CRYPTO, STOCK, FOREX, or COMMODITY'),

  body('exchange')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Exchange cannot exceed 100 characters'),

  body('trade_type')
    .isIn(['BUY', 'SELL'])
    .withMessage('Trade Type must be BUY or SELL'),

  body('status')
    .optional()
    .isIn(['OPEN', 'CLOSED'])
    .withMessage('Status must be OPEN or CLOSED'),

  body('entry_price')
    .isFloat({ gt: 0 }).withMessage('Entry Price must be a decimal number greater than 0'),

  body('exit_price')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 }).withMessage('Exit Price must be a decimal number greater than or equal to 0'),

  body('quantity')
    .isFloat({ gt: 0 }).withMessage('Quantity must be a number greater than 0'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes cannot exceed 1000 characters'),

  body('trade_date')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('Trade Date must be a valid ISO8601 date'),

  validate
];

module.exports = {
  tradeValidator
};
