const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../../../common/config');
const User = require('../models/User');
const { AppError } = require('../../../common/middleware/errorHandler');
const emailService = require('./emailService');

class AuthService {
  // Generate JWT tokens
  generateAccessToken(userId, email, role) {
    return jwt.sign(
      { userId, email, role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  generateRefreshToken(userId) {
    return jwt.sign(
      { userId, type: 'refresh' },
      config.jwt.secret,
      { expiresIn: '30d' }
    );
  }

  // Register new user
  async register(userData) {
    const { email, password, firstName, lastName, phone } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });

    // Send verification email
    await emailService.sendVerificationEmail(user.email, verificationToken);

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id, user.email, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    // Save refresh token
    await user.update({ refreshToken });

    return {
      user,
      accessToken,
      refreshToken
    };
  }

  // Login user
  async login(email, password) {
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if account is locked
    if (user.isLocked()) {
      throw new AppError('Account is temporarily locked due to multiple failed login attempts. Please try again later.', 423);
    }

    // Check if account is suspended
    if (user.status === 'suspended') {
      throw new AppError('Account has been suspended. Please contact support.', 403);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await user.incrementLoginAttempts();
      throw new AppError('Invalid email or password', 401);
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Generate tokens
    const accessToken = this.generateAccessToken(user.id, user.email, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    // Update user
    await user.update({
      refreshToken,
      lastLogin: new Date()
    });

    return {
      user,
      accessToken,
      refreshToken
    };
  }

  // Refresh access token
  async refreshAccessToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.secret);
      
      if (decoded.type !== 'refresh') {
        throw new AppError('Invalid token type', 401);
      }

      // Find user
      const user = await User.findByPk(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Generate new access token
      const accessToken = this.generateAccessToken(user.id, user.email, user.role);

      return { accessToken };
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  // Logout user
  async logout(userId) {
    const user = await User.findByPk(userId);
    if (user) {
      await user.update({ refreshToken: null });
    }
    return { message: 'Logged out successfully' };
  }

  // Verify email
  async verifyEmail(token) {
    const user = await User.findOne({
      where: {
        emailVerificationToken: token
      }
    });

    if (!user) {
      throw new AppError('Invalid verification token', 400);
    }

    if (user.emailVerificationExpires < new Date()) {
      throw new AppError('Verification token has expired', 400);
    }

    await user.update({
      emailVerified: true,
      status: 'active',
      emailVerificationToken: null,
      emailVerificationExpires: null
    });

    return { message: 'Email verified successfully' };
  }

  // Resend verification email
  async resendVerificationEmail(email) {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.emailVerified) {
      throw new AppError('Email already verified', 400);
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await user.update({
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });

    await emailService.sendVerificationEmail(user.email, verificationToken);

    return { message: 'Verification email sent' };
  }

  // Forgot password
  async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Don't reveal if user exists
      return { message: 'If the email exists, a password reset link has been sent' };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await user.update({
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires
    });

    await emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'If the email exists, a password reset link has been sent' };
  }

  // Reset password
  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      where: {
        passwordResetToken: token
      }
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    if (user.passwordResetExpires < new Date()) {
      throw new AppError('Reset token has expired', 400);
    }

    await user.update({
      password: newPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
      refreshToken: null // Invalidate all sessions
    });

    return { message: 'Password reset successfully' };
  }

  // Change password (for authenticated users)
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    await user.update({
      password: newPassword,
      refreshToken: null // Invalidate all sessions
    });

    return { message: 'Password changed successfully' };
  }

  // Get current user profile
  async getProfile(userId) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  // Update user profile
  async updateProfile(userId, updates) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Don't allow updating sensitive fields
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'avatar', 'address', 'preferences'];
    const filteredUpdates = {};
    
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    await user.update(filteredUpdates);

    return user;
  }
}

module.exports = new AuthService();
