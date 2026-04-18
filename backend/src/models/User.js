/**
 * @file User.js
 * @description User model schema for authentication and user management.
 * Stores user profile, authentication credentials, favorites, and activity tracking.
 */

import mongoose from 'mongoose';

/**
 * User Schema
 * - Stores user account information
 * - Supports both traditional email/password and Google OAuth authentication
 * - Tracks user role, activity, and favorite books
 * - Includes password reset token management
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  roleName: {
    type: String,
    enum: ['admin', 'manager', 'user'],
    default: 'user'
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  googleId: {
    type: String,
    sparse: true
  },
  favoriteBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  loginCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Note: Password hashing is handled manually in the controller
// to avoid pre-save hook complications during OAuth.

const User = mongoose.model('User', userSchema);

export default User;