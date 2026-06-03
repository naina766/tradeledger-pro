const express = require('express');
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authLimiter } = require('../middlewares/rateLimitMiddleware');
const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator
} = require('../validators/authValidator');

const router = express.Router();

router.post('/register', authLimiter, registerValidator, AuthController.register);
router.post('/login', authLimiter, loginValidator, AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);

// Protected routes
router.get('/profile', authMiddleware, AuthController.getProfile);
router.put('/profile', authMiddleware, updateProfileValidator, AuthController.updateProfile);
router.put('/profile/password', authMiddleware, changePasswordValidator, AuthController.changePassword);

module.exports = router;
