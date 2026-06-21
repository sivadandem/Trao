const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe,
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  forgotPassword,
  resetPasswordValidation,
  resetPassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

// @route POST /api/auth/register
router.post('/register', authLimiter, registerValidation, validate, register);

// @route POST /api/auth/login
router.post('/login', authLimiter, loginValidation, validate, login);

// @route POST /api/auth/forgot-password
router.post('/forgot-password', authLimiter, forgotPasswordValidation, validate, forgotPassword);

// @route POST /api/auth/reset-password
router.post('/reset-password', authLimiter, resetPasswordValidation, validate, resetPassword);

// @route GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router;
