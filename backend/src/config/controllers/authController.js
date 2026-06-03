const AuthService = require('../services/authService');
const UserRepository = require('../repositories/userRepository');
const ApiResponse = require('../utils/apiResponse');
const bcrypt = require('bcryptjs');

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const data = await AuthService.register({ name, email, password });
      return ApiResponse.success(res, 'User registered successfully', data, 201);
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await AuthService.login({ email, password });
      return ApiResponse.success(res, 'Logged in successfully', data, 200);
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const data = await AuthService.refresh(refreshToken);
      return ApiResponse.success(res, 'Token refreshed successfully', data, 200);
    } catch (err) {
      next(err);
    }
  }

  static async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      await AuthService.logout(refreshToken);
      return ApiResponse.success(res, 'Logged out successfully', {}, 200);
    } catch (err) {
      next(err);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = await AuthService.getProfile(req.user.userId);
      return ApiResponse.success(res, 'Profile retrieved successfully', { user }, 200);
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { name, email } = req.body;
      const userId = req.user.userId;

      // Check if email already taken
      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return ApiResponse.error(res, 'Email is already in use by another account', 400);
      }

      await UserRepository.update(userId, { name, email });
      const updatedUser = await UserRepository.findById(userId);

      return ApiResponse.success(res, 'Profile updated successfully', { user: updatedUser }, 200);
    } catch (err) {
      next(err);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.userId;

      const user = await UserRepository.findById(userId);
      // Fetch full user record including password from database to verify
      const { pool } = require('../config/db');
      const [rows] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
      const hashedPassword = rows[0]?.password;

      const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
      if (!isMatch) {
        return ApiResponse.error(res, 'Current password is incorrect', 400);
      }

      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(newPassword, salt);

      // Name and email stay same
      const userDetails = await UserRepository.findById(userId);
      await UserRepository.update(userId, {
        name: userDetails.name,
        email: userDetails.email,
        password: newHashedPassword
      });

      return ApiResponse.success(res, 'Password changed successfully', {}, 200);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
