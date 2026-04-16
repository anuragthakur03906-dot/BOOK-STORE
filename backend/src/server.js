// server.js - starter file for Express application
// sets up middleware, routes, Google OAuth, and starts HTTP server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/User.js';
import connectDB from './config/database.js';

// ========== LOAD ENV ==========
dotenv.config();

// ========== VERIFY REQUIRED ENV VARS ==========
const REQUIRED_ENV = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'SESSION_SECRET'];
const missing = REQUIRED_ENV.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('ERROR: MISSING ENVIRONMENT VARIABLES:', missing);
  console.error('Please add them to backend/.env file');
  process.exit(1);
}

console.log('\nENVIRONMENT VARIABLES LOADED:');
console.log('================================');
console.log(`PORT: ${process.env.PORT}`);
console.log(`GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING'}`);
console.log(`GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'MISSING'}`);
console.log(`SESSION_SECRET: ${process.env.SESSION_SECRET ? 'SET' : 'MISSING'}`);
console.log('================================\n');

// ========== CONNECT DATABASE ==========
connectDB();

const app = express();

// ========== MIDDLEWARE ==========
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ========== SESSION ==========
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // false for HTTP in development
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

// ========== PASSPORT CONFIGURATION ==========
app.use(passport.initialize());
app.use(passport.session());

// ========== GOOGLE STRATEGY ==========
console.log('Configuring Google OAuth...');

// Initialize Google Authentication Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/api/auth/google/callback',
  passReqToCallback: false
}, async (accessToken, refreshToken, profile, done) => {
  console.log(' Google OAuth callback received');

  try {
    const email = profile.emails[0].value;

    // Find user
    let user = await User.findOne({
      $or: [
        { email: email },
        { googleId: profile.id }
      ]
    });

    if (!user) {
      console.log(` Creating new Google user: ${email}`);

      // Create a user without a local password for Google OAuth users
      user = await User.create({
        name: profile.displayName || email.split('@')[0],
        email: email,
        password: undefined, // Password is not required for OAuth
        googleId: profile.id, // Store Google provider ID
        roleName: 'user',
        isActive: true,
        lastLogin: new Date()
      });
      console.log(` New Google user created: ${user.email}`);
    } else {
      // Update last login
      user.lastLogin = new Date();

      // Add Google ID if missing
      if (!user.googleId) {
        user.googleId = profile.id;
      }

      await user.save();
      console.log(` Google user logged in: ${user.email}`);
    }

    return done(null, user);
  } catch (error) {
    console.error(' Error in Google OAuth:', error);
    return done(error, null);
  }
}));

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

console.log(' Google OAuth configured successfully\n');

// ========== ROUTES ==========
import authRoutes from './routes/authRoutes.js';
import googleAuthRoutes from './routes/googleAuthRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);

// ========== HEALTH CHECK ==========
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    googleOAuth: {
      configured: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
      clientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing'
    }
  });
});

// ========== DEBUG ROUTE ==========
app.get('/api/debug', (req, res) => {
  res.json({
    success: true,
    session: {
      id: req.sessionID,
      passport: req.session.passport
    },
    cookies: req.cookies,
    googleStrategy: passport._strategies.google ? 'Loaded' : 'Not loaded'
  });
});

// ========== 404 HANDLER FOR UNKNOWN API ROUTES ==========
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    timestamp: new Date().toISOString()
  });
});

// ========== ERROR HANDLER ==========
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Debug: http://localhost:${PORT}/api/debug`);
  console.log(`Google OAuth: http://localhost:${PORT}/api/auth/google`);
  console.log(`Frontend: http://localhost:3000`);
});