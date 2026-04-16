import User from '../models/User.js';
import Book from '../models/Book.js';


/**
 * Get the current user's profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Update the user's profile information
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Find user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email && email !== user.email) {
      // Check if email already exists
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists'
        });
      }
      user.email = email;
    }

    // Update password if provided
    if (password && password.trim() !== '') {
      user.password = password; // pre-save hook will hash it
    }

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(user._id).select('-password');

    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Retrieve a list of the user's favorite books
 */
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'favoriteBooks',
        populate: {
          path: 'addedBy',
          select: 'name email'
        }
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.favoriteBooks || []
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Add a book to the user's favorites list
 */
export const addToFavorites = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    // Get user with favorites
    const user = await User.findById(req.user._id);

    // Check if already in favorites
    const isAlreadyFavorite = user.favoriteBooks.some(
      favBook => favBook.toString() === bookId
    );

    if (isAlreadyFavorite) {
      return res.status(400).json({
        success: false,
        error: 'Book is already in favorites'
      });
    }

    // Add to favorites
    user.favoriteBooks.push(bookId);
    await user.save();

    res.json({
      success: true,
      message: 'Book added to favorites',
      data: book
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Remove a book from the user's favorites list
 */
export const removeFromFavorites = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Get user
    const user = await User.findById(req.user._id);

    // Remove from favorites
    user.favoriteBooks = user.favoriteBooks.filter(
      favBook => favBook.toString() !== bookId
    );

    await user.save();

    res.json({
      success: true,
      message: 'Book removed from favorites',
      data: {}
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Get statistics for the current user
 */
export const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's books
    const userBooks = await Book.find({ addedBy: userId });

    // Calculate statistics - Ensure numbers are numbers
    const totalBooks = userBooks.length;
    const totalPrice = userBooks.reduce((sum, book) => sum + (parseFloat(book.price) || 0), 0);
    const avgRating = totalBooks > 0
      ? (userBooks.reduce((sum, book) => sum + (parseFloat(book.rating) || 0), 0) / totalBooks)
      : 0;

    // Find favorite genre
    const genreCount = {};
    userBooks.forEach(book => {
      if (book.genre) {
        genreCount[book.genre] = (genreCount[book.genre] || 0) + 1;
      }
    });

    let favoriteGenre = 'None';
    let maxCount = 0;

    for (const [genre, count] of Object.entries(genreCount)) {
      if (count > maxCount) {
        maxCount = count;
        favoriteGenre = genre;
      }
    }

    // Get user
    const user = await User.findById(userId);
    const favoriteBooksCount = user.favoriteBooks ? user.favoriteBooks.length : 0;

    res.json({
      success: true,
      data: {
        totalBooks,  // Number
        totalPrice: totalPrice,  // Send as number, not string
        avgRating: avgRating,    // Send as number, not string
        favoriteGenre,
        favoriteBooksCount,
        booksAddedThisMonth: userBooks.filter(book => {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return book.createdAt > monthAgo;
        }).length,
        totalValue: totalPrice  // Send as number
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

/**
 * Get comprehensive dashboard data for the user
 * Combines profile, favorites, stats, and recently added books
 */
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all data in parallel
    const [profile, favorites, stats, myBooks] = await Promise.all([
      User.findById(userId).select('-password'),
      User.findById(userId)
        .populate({
          path: 'favoriteBooks',
          populate: {
            path: 'addedBy',
            select: 'name email'
          }
        })
        .then(user => user.favoriteBooks || []),
      (async () => {
        const userBooks = await Book.find({ addedBy: userId });
        const totalBooks = userBooks.length;
        const totalPrice = userBooks.reduce((sum, book) => sum + (parseFloat(book.price) || 0), 0);
        const avgRating = totalBooks > 0
          ? (userBooks.reduce((sum, book) => sum + (parseFloat(book.rating) || 0), 0) / totalBooks)
          : 0;

        const genreCount = {};
        userBooks.forEach(book => {
          if (book.genre) {
            genreCount[book.genre] = (genreCount[book.genre] || 0) + 1;
          }
        });

        let favoriteGenre = 'None';
        let maxCount = 0;
        for (const [genre, count] of Object.entries(genreCount)) {
          if (count > maxCount) {
            maxCount = count;
            favoriteGenre = genre;
          }
        }

        const user = await User.findById(userId);

        return {
          totalBooks,
          totalPrice: totalPrice,  // Send as number
          avgRating: avgRating,    // Send as number
          favoriteGenre,
          totalFavoriteBooks: user.favoriteBooks ? user.favoriteBooks.length : 0
        };
      })(),
      Book.find({ addedBy: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('addedBy', 'name email')
    ]);

    res.json({
      success: true,
      data: {
        profile: {
          _id: profile._id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          createdAt: profile.createdAt,
          favoriteBooks: profile.favoriteBooks || []
        },
        favorites,
        stats,
        myBooks
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Export all functions
export default {
  getProfile,
  updateProfile,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getStats,
  getDashboardData
};
