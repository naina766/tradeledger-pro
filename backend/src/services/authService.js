const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/userRepository');
const TokenRepository = require('../repositories/tokenRepository');
const CustomError = require('../utils/customError');

class AuthService {
  static generateAccessToken(user) {
    return jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );
  }

  static generateRefreshToken(user) {
    return jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
  }

  static async register({ name, email, password }) {
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomError('User with this email already exists', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = await UserRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    const user = await UserRepository.findById(userId);
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Save refresh token to db
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await TokenRepository.create(refreshToken, user.id, expiresAt);

    return { user, accessToken, refreshToken };
  }

  static async login({ email, password }) {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new CustomError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError('Invalid email or password', 401);
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await TokenRepository.create(refreshToken, user.id, expiresAt);

    // Filter sensitive info
    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    };

    return { user: userProfile, accessToken, refreshToken };
  }

  static async refresh(token) {
    if (!token) {
      throw new CustomError('Refresh token is required', 400);
    }

    const storedToken = await TokenRepository.findByToken(token);
    if (!storedToken) {
      throw new CustomError('Invalid or expired refresh token', 403);
    }

    if (new Date(storedToken.expires_at) < new Date()) {
      await TokenRepository.deleteByToken(token);
      throw new CustomError('Refresh token expired', 403);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await UserRepository.findById(decoded.userId);
      if (!user) {
        throw new CustomError('User not found', 404);
      }

      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      // Rotate token: delete old, create new
      await TokenRepository.deleteByToken(token);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await TokenRepository.create(newRefreshToken, user.id, expiresAt);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (err) {
      throw new CustomError('Invalid refresh token signature', 403);
    }
  }

  static async logout(token) {
    if (!token) {
      throw new CustomError('Token required for logout', 400);
    }
    const deleted = await TokenRepository.deleteByToken(token);
    if (!deleted) {
      throw new CustomError('Token not found', 404);
    }
    return true;
  }

  static async getProfile(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    return user;
  }
}

module.exports = AuthService;
