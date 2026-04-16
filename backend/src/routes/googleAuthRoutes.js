// routes/googleAuthRoutes.js
import express from 'express';
import passport from 'passport';
import { generateAccessToken, generateRefreshToken } from '../config/jwt.js';
import Token from '../models/Token.js';

const router = express.Router();

// Status check
router.get('/google/status', (req, res) => {
  res.json({
    success: true,
    configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    message: 'Google OAuth is ready'
  });
});

// Initiate Google OAuth
router.get('/google', (req, res, next) => {
  console.log(' Initiating Google OAuth...');
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/login?error=google_auth_failed',
    session: false
  }),
  async (req, res) => {
    try {
      const user = req.user;

      if (!user) {
        throw new Error('User not found after Google authentication');
      }


      if (!user.googleId) {
        user.googleId = req.user.googleId; // Add googleId from profile if not present
        await user.save();
      }
      // Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Save refresh token to DB
      await Token.create({
        userId: user._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      // Redirect to frontend with tokens
      const redirectUrl = `http://localhost:3000/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}&userId=${user._id}&email=${user.email}`;

      console.log(` Google login successful for: ${user.email}`);
      res.redirect(redirectUrl);

    } catch (error) {
      console.error(' Google callback error:', error);
      res.redirect('http://localhost:3000/login?error=oauth_failed');
    }
  }
);

export default router;