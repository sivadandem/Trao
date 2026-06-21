const { body } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendSuccess, sendError } = require('../utils/response');
const crypto = require('crypto');

// Validation rules
const registerValidation = [
  body('email')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  body('name')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, 'An account with this email already exists');
    }

    // Create user (password hashed in pre-save hook)
    const user = await User.create({ email, password, name });

    const token = generateToken(user._id);

    return sendSuccess(res, 201, 'Account created successfully', {
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid email or password');
    }

    const token = generateToken(user._id);

    return sendSuccess(res, 200, 'Login successful', {
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user
 * @access  Protected
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, 200, 'User retrieved successfully', {
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Token is required'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
];

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Generate password reset token and send (log) link
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Return success response to prevent email enumeration
      return sendSuccess(res, 200, 'If that email exists, a password reset link has been generated.');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    console.log(`========================================`);
    console.log(`PASSWORD RESET URL for ${email}:`);
    console.log(resetUrl);
    console.log(`========================================`);

    return sendSuccess(res, 200, 'Password reset link generated and logged successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return sendError(res, 400, 'Invalid or expired password reset token');
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return sendSuccess(res, 200, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  forgotPassword,
  resetPasswordValidation,
  resetPassword,
};
