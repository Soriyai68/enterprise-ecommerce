const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../../../common/middleware/auth');
const { validate } = require('../../../common/middleware/validator');
const {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
  emailValidator,
  resetPasswordValidator,
  changePasswordValidator,
  verifyEmailValidator,
  updateProfileValidator
} = require('../validators/authValidator');

// Public routes
router.post('/register', registerValidator, validate, authController.register);
router.post('/login', loginValidator, validate, authController.login);
router.post('/refresh-token', refreshTokenValidator, validate, authController.refreshToken);
router.get('/verify-email', verifyEmailValidator, validate, authController.verifyEmail);
router.post('/resend-verification', emailValidator, validate, authController.resendVerification);
router.post('/forgot-password', emailValidator, validate, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidator, validate, authController.resetPassword);

// Protected routes (require authentication)
router.use(authenticate);
router.post('/logout', authController.logout);
router.post('/change-password', changePasswordValidator, validate, authController.changePassword);
router.get('/profile', authController.getProfile);
router.put('/profile', updateProfileValidator, validate, authController.updateProfile);

module.exports = router;
