// Authentication Middleware
import User from '../models/User.js';
import Token from '../models/Token.js';
import { verifyAccessToken } from '../config/jwt.js';

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized, no token'
      });
    }

    try {
      // Check if token exists in database
      const tokenDoc = await Token.findOne({ accessToken: token });
      if (!tokenDoc) {
        return res.status(401).json({
          success: false,
          error: 'Token not found in database'
        });
      }

      // Check if token is expired
      if (tokenDoc.expiresAt < new Date()) {
        await Token.deleteOne({ _id: tokenDoc._id });
        return res.status(401).json({
          success: false,
          error: 'Token expired'
        });
      }

      // Verify JWT token
      const decoded = verifyAccessToken(token);

      // Get user
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        await Token.deleteOne({ _id: tokenDoc._id });
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }

      // Check if user is active/blocked
      if (!req.user.isActive) {
        return res.status(403).json({
          success: false,
          error: 'Account is blocked. Please contact admin.'
        });
      }

      next();
    } catch (error) {
      // JWT verification failed
      await Token.deleteOne({ accessToken: token });
      return res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
    }
  } catch (error) {
    console.error('Protect middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};


const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user?.role} is not authorized to access this route`
      });
    }
    next();
  };
};

export { protect, authorize };