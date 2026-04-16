// Authentication Routes
import express from 'express';
import {
  register,
  login,
  getMe,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validationMiddleware.js';
import {
  registerValidator,
  loginValidator,
} from '../utils/validators.js';
import { verifyRecaptcha } from '../middleware/captchaMiddleware.js';

const router = express.Router();

router.post('/register', verifyRecaptcha, validate(registerValidator), register);
router.post('/login', verifyRecaptcha, validate(loginValidator), login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/me', protect, getMe);

export default router;