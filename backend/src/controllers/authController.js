// Authentication controller handles user registration, login, password reset,
// token refreshing and Google reCAPTCHA verification.
import User from '../models/User.js';
import Token from '../models/Token.js';
import { sendResetPasswordEmail } from '../utils/emailService.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../config/jwt.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import axios from 'axios';

// Helper function to verify Google Recaptcha Token
const verifyGoogleCaptcha = async (captchaToken) => {
  try {
    if (process.env.SKIP_CAPTCHA === 'true') {
      console.log(' Skipping captcha verification (development mode)');
      return { success: true, score: 0.9 };
    }

    if (!captchaToken) {
      console.log(' No captcha token provided');
      return { success: false, error: 'Captcha token missing' };
    }

    console.log('Verifying captcha with Google...');

    const verificationUrl = 'https://www.google.com/recaptcha/api/siteverify';
    const params = new URLSearchParams();
    params.append('secret', process.env.RECAPTCHA_V2_SECRET_KEY);
    params.append('response', captchaToken);

    const response = await axios.post(verificationUrl, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    console.log(' Captcha response:', response.data);
    return response.data;
  } catch (error) {
    console.error(' Captcha verification error:', error);
    return { success: false, error: 'Captcha verification failed' };
  }
};

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, captchaToken, role = 'user' } = req.body;

    console.log(' Register request:', { name, email, role });

    // Validate that the provided role is valid
    if (role && !['admin', 'manager', 'user'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be admin, manager, or user'
      });
    }

    // Verify captcha before proceeding
    const captchaResult = await verifyGoogleCaptcha(captchaToken);
    if (!captchaResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Captcha verification failed. Please try again.',
        captchaError: captchaResult['error-codes']
      });
    }

    // Optional: Check captcha score (for v3)
    if (captchaResult.score && captchaResult.score < 0.5) {
      return res.status(400).json({
        success: false,
        error: 'Suspicious activity detected. Please try again.',
        captchaScore: captchaResult.score
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Hash password explicitly before saving in DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with already hashed password
    const user = await User.create({
      name,
      email,
      password: hashedPassword, //  Already hashed - no middleware needed
      roleName: role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log(` User created: ${user.email} with role: ${role}`);

    // Return success
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roleName: user.roleName,
        isActive: user.isActive
      },
      message: 'Registration successful! Please login.'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Registration failed'
    });
  }
};

// Login an existing user
export const login = async (req, res) => {
  try {
    const { email, password, captchaToken } = req.body;

    console.log('Login request:', { email });

    // Verify captcha before proceeding
    const captchaResult = await verifyGoogleCaptcha(captchaToken);
    if (!captchaResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Captcha verification failed. Please try again.',
        captchaError: captchaResult['error-codes']
      });
    }

    //  Optional: Check captcha score
    if (captchaResult.score && captchaResult.score < 0.5) {
      return res.status(400).json({
        success: false,
        error: 'Suspicious activity detected. Please try again.',
        captchaScore: captchaResult.score
      });
    }

    // Check user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if the user account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Your account is blocked. Please contact admin.'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save tokens
    await Token.create({
      userId: user._id,
      accessToken,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return success
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        roleName: user.roleName,
        isActive: user.isActive
      },
      message: 'Login successful!',
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Reset user password utilizing a reset token
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: 'Token and password are required'
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.updatedAt = new Date();

    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Refresh an expired access token using a valid refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token required'
      });
    }

    // Check if the refresh token exists in the database
    const tokenDoc = await Token.findOne({ refreshToken });
    if (!tokenDoc) {
      return res.status(403).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(decoded.userId);

    // Update access token database record
    await Token.updateOne(
      { refreshToken: refreshToken },
      {
        accessToken: newAccessToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    );

    res.json({
      success: true,
      message: 'Access token refreshed',
      accessToken: newAccessToken
    });
  } catch (error) {
    // Delete invalid token
    await Token.deleteOne({ refreshToken });

    res.status(403).json({
      success: false,
      error: 'Invalid or expired refresh token'
    });
  }
};

// Log out a user by invalidating their refresh token
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Remove token from database
      await Token.deleteOne({ refreshToken });
    }

    // Also delete by user ID if available
    if (req.user?._id) {
      await Token.deleteMany({ userId: req.user._id });
    }

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Authenticate using current token and fetch personal profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Initiate password reset process and send reset email
export const forgotPassword = async (req, res) => {
  try {
    console.log(' Forgot password request received');

    let email = req.body.email;

    // Handle case where email might be an object
    if (email && typeof email === 'object' && email.email) {
      email = email.email;
    }

    const emailString = email?.toString().trim().toLowerCase() || '';

    // Validate email exists
    if (!emailString) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailString)) {
      return res.status(400).json({
        success: false,
        error: 'Please include a valid email'
      });
    }

    // Find user by email string
    const user = await User.findOne({ email: emailString });

    // Security message
    const message = 'If an account exists with this email, you will receive a reset link.';

    if (!user) {
      return res.json({
        success: true,
        message: message
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Update user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpiry;
    user.updatedAt = new Date();
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    // Try to send email
    try {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        await sendResetPasswordEmail(emailString, resetToken, user.name);
      }
    } catch (emailError) {
      console.log(' Email sending failed:', emailError.message);
    }

    // Return response
    const response = {
      success: true,
      message: message,
      ...(process.env.NODE_ENV !== 'production' && {
        resetToken: resetToken,
        resetLink: resetLink
      })
    };

    res.json(response);

  } catch (error) {
    console.error(' Forgot password ERROR:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Export controller methods
export default {
  register,
  login,
  logout,
  refreshToken,
  getMe,
  forgotPassword,
  resetPassword
};