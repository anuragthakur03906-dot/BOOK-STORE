// src/config/jwt.js - FIXED
import jwt from 'jsonwebtoken';

// Generate Access Token (7 days)
export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '7d' } //  Changed from 15m to 7d
  );
};

// Generate Refresh Token (30 days)
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' } //  Longer for refresh
  );
};

// Verify Access Token
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

// Verify Refresh Token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

// Generate Reset Token (1 hour)
export const generateResetToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_RESET_SECRET,
    { expiresIn: '1h' }
  );
};

// Verify Reset Token
export const verifyResetToken = (token) => {
  return jwt.verify(token, process.env.JWT_RESET_SECRET);
};