/**
 * @file server.js
 * @description Entry point for the Express application. Sets up middleware, 
 * authentication, role-based access control routes, and database connectivity.
 * @author Anurag Thakur
 */

import dotenv from 'dotenv';

// Load environment variables FIRST - before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './src/models/User.js';
import connectDB from './src/config/database.js';

/**
 * Verify required environment variables
 */
const REQUIRED_ENV = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'SESSION_SECRET', 'GOOGLE_CALLBACK_URL'];
const missing = REQUIRED_ENV.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('CRITICAL ERROR: Missing required environment variables:', missing);
  process.exit(1);
}

// Connect to MongoDB
connectDB();

const app = express();

/**
 * CORS Configuration
 * Allow frontend requests from multiple origins with credentials support
 */
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5174',
  'http://localhost:5174',   // Primary frontend port
  'http://localhost:3000',   // Fallback development
  'http://localhost:5173'    // Vite dev server alternative
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (same-origin requests, mobile apps, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Origin not allowed'));
    }
  },
  credentials: true,           // Allow cookies and credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

/**
 * Security Headers Configuration with Helmet
 * Includes CSP (Content Security Policy) to allow Google reCAPTCHA
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",                    // Required for inline scripts
        'https://www.google.com',             // Google reCAPTCHA
        'https://www.gstatic.com'             // Google static resources
      ],
      frameSrc: [
        "'self'",
        'https://www.google.com',             // Google reCAPTCHA iframe
        'https://recaptcha.google.com'        // Alternative reCAPTCHA domain
      ],
      connectSrc: [
        "'self'",
        'https://www.google.com',             // Allow API calls to Google
        'https://www.gstatic.com'
      ],
      imgSrc: ["'self'", 'data:', 'https:', 'http:'], // Allow images from all sources for development
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com',
        'https://www.google.com'
      ],
      fontSrc: [
        "'self'",
        'https://fonts.gstatic.com'
      ]
    }
  },
  crossOriginEmbedderPolicy: false  // Allow external resources
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Session Management Configuration
 */
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Security best practice
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

/**
 * Passport.js Authentication Initialization
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * Google OAuth 2.0 Strategy Configuration
 */
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: false
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    // Search for existing user by email or provider ID
    let user = await User.findOne({
      $or: [
        { email: email },
        { googleId: profile.id }
      ]
    });

    if (!user) {
      // Create new user record for Google authorized accounts
      user = await User.create({
        name: profile.displayName || email.split('@')[0],
        email: email,
        password: undefined, 
        googleId: profile.id,
        roleName: 'user',
        isActive: true,
        lastLogin: new Date()
      });
    } else {
      // Update session metadata
      user.lastLogin = new Date();
      if (!user.googleId) user.googleId = profile.id;
      await user.save();
    }

    return done(null, user);
  } catch (error) {
    console.error('Google OAuth Internal Error:', error);
    return done(error, null);
  }
}));

/**
 * User Serialization for Session Persistence
 */
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

/**
 * API Route Registrations
 */
import authRoutes from './src/routes/authRoutes.js';
import googleAuthRoutes from './src/routes/googleAuthRoutes.js';
import bookRoutes from './src/routes/bookRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);

/**
 * Global Health Check Endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'Operational',
    timestamp: new Date().toISOString()
  });
});

/**
 * Fallback handler for unmatched API routes
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist.`
  });
});

/**
 * Centralized Error Handling Middleware
 */
app.use((err, req, res, next) => {
  console.error('Internal System Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred on the server.'
  });
});

/**
 * Application Startup
 */
const PORT = process.env.PORT || 5001;
app.listen(PORT,  "0.0.0.0", () => {
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Server] Running on port: ${PORT}`);
  console.log(`[Server] Health check available at: http://localhost:${PORT}/health`);
});