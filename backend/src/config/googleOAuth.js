// src/config/googleOAuth.js - Google OAuth Configuration
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import crypto from 'crypto';

console.log('Initializing Google OAuth strategy...');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

console.log('Client ID:', GOOGLE_CLIENT_ID ? 'LOADED' : 'MISSING');
console.log('Client Secret:', GOOGLE_CLIENT_SECRET ? 'LOADED' : 'MISSING');

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('ERROR: Google OAuth credentials missing in .env file');
  console.error('Add these to .env:');
  console.error('GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com');
  console.error('GOOGLE_CLIENT_SECRET=your-client-secret');
} else {
  console.log('Initializing Google Strategy...');
  
  try {
    // Remove any existing strategy
    if (passport._strategies && passport._strategies.google) {
      delete passport._strategies.google;
    }
    
    // Create Google Strategy
    const googleStrategy = new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/google/callback',
      passReqToCallback: false
    }, async (accessToken, refreshToken, profile, done) => {
      console.log('Google profile received:', profile.displayName);
      
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
          console.log('New user created:', user.email);
        } else if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
          console.log('Existing user linked:', user.email);
        }
        
        done(null, user);
      } catch (err) {
        console.error('User creation error:', err);
        done(err, null);
      }
    });
    
    // Use the strategy
    passport.use('google', googleStrategy);
    console.log('Google Strategy initialized successfully');
    
  } catch (error) {
    console.error('Google Strategy initialization failed:', error);
  }
}

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
