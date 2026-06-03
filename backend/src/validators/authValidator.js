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

const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Full Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  validate
];

const loginValidator = [
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  validate
];

const updateProfileValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  
  body('email')
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  validate
];

const changePasswordValidator = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    .matches(/\d/).withMessage('New password must contain at least one number')
    .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter'),

  body('confirmNewPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('New passwords do not match');
      }
      return true;
    }),
  validate
];

module.exports = {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator
};
