import express from 'express';
import { 
  getProfile, 
  updateProfile,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getStats,
  getDashboardData
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all routes
router.use(protect);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', updateProfile);

// @route   GET /api/users/dashboard
// @desc    Get dashboard data
// @access  Private
router.get('/dashboard', getDashboardData);

// @route   GET /api/users/favorites
// @desc    Get user's favorite books
// @access  Private
router.get('/favorites', getFavorites);

// @route   POST /api/users/favorites/:bookId
// @desc    Add book to favorites
// @access  Private
router.post('/favorites/:bookId', addToFavorites);

// @route   DELETE /api/users/favorites/:bookId
// @desc    Remove book from favorites
// @access  Private
router.delete('/favorites/:bookId', removeFromFavorites);

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', getStats);

export default router;
