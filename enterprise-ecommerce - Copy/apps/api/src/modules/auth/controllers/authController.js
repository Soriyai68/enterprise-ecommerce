const authService = require('../services/authService');
const { successResponse } = require('../../../common/utils/response');
const asyncHandler = require('../../../common/utils/asyncHandler');

// Register new user
exports.register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  
  successResponse(res, {
    message: 'Registration successful. Please check your email to verify your account.',
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    }
  }, 201);
});

// Login user
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  
  successResponse(res, {
    message: 'Login successful',
    data: {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    }
  });
});

// Refresh access token
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refreshAccessToken(refreshToken);
  
  successResponse(res, {
    message: 'Token refreshed successfully',
    data: result
  });
});

// Logout user
exports.logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.userId);
  
  successResponse(res, {
    message: 'Logged out successfully'
  });
});

// Verify email
exports.verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const result = await authService.verifyEmail(token);
  
  successResponse(res, {
    message: result.message
  });
});

// Resend verification email
exports.resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.resendVerificationEmail(email);
  
  successResponse(res, {
    message: result.message
  });
});

// Forgot password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  
  successResponse(res, {
    message: result.message
  });
});

// Reset password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const result = await authService.resetPassword(token, password);
  
  successResponse(res, {
    message: result.message
  });
});

// Change password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(req.user.userId, currentPassword, newPassword);
  
  successResponse(res, {
    message: result.message
  });
});

// Get current user profile
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.userId);
  
  successResponse(res, {
    message: 'Profile retrieved successfully',
    data: { user }
  });
});

// Update user profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user.userId, req.body);
  
  successResponse(res, {
    message: 'Profile updated successfully',
    data: { user }
  });
});
