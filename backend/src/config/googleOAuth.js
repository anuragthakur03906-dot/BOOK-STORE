/**
 * @file googleOAuth.js
 * @description Google OAuth 2.0 strategy configuration using Passport
 * Handles user authentication via Google accounts
 */

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import crypto from 'crypto';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'https://book-store-l8lq.onrender.com/api/auth/google/callback';

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error('Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) are required in .env file');
}

// Create Google Strategy
const googleStrategy = new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK_URL,
  passReqToCallback: false
}, async (accessToken, refreshToken, profile, done) => {
      
      try {
        const email = profile.emails[0].value;
        
        // Find or create user
        let user = await User.findOne({ 
          $or: [{ email }, { googleId: profile.id }]
        });
        
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: email,
            password: crypto.randomBytes(32).toString('hex'),
            googleId: profile.id,
            role: 'user'
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    });
    
    // Register the strategy
    passport.use('google', googleStrategy);

// Serialize/Deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
