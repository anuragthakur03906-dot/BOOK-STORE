import mongoose from 'mongoose';
import User from '../models/User.js';
import Book from '../models/Book.js';
import Role from '../models/Role.js';

// Get a paginated list of all users
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search, isActive } = req.query;

    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (role) filter.roleName = role;
    const querySearch = (search || '').trim();
    if (querySearch) {
      filter.$or = [
        { name: { $regex: querySearch, $options: 'i' } },
        { email: { $regex: querySearch, $options: 'i' } }
      ];
    }
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(filter);

    // Get counts by status
    const activeUsers = await User.countDocuments({ ...filter, isActive: true });
    const inactiveUsers = await User.countDocuments({ ...filter, isActive: false });

    res.json({
      success: true,
      count: users.length,
      data: users,
      stats: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get all books for admin dashboard
export const getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, genre, author, search, addedBy } = req.query;

    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (genre) filter.genre = genre;
    if (author) filter.author = { $regex: author, $options: 'i' };
    if (addedBy) filter.addedBy = addedBy;
    const querySearch = (search || '').trim();
    if (querySearch) {
      filter.$or = [
        { title: { $regex: querySearch, $options: 'i' } },
        { author: { $regex: querySearch, $options: 'i' } },
        { genre: { $regex: querySearch, $options: 'i' } },
        { description: { $regex: querySearch, $options: 'i' } }
      ];
    }

    const books = await Book.find(filter)
      .populate('addedBy', 'name email roleName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalBooks = await Book.countDocuments(filter);

    res.json({
      success: true,
      count: books.length,
      data: books,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBooks / limit),
        totalBooks
      }
    });
  } catch (error) {
    console.error('Get all books error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get user details by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate object id to avoid CastError on invalid IDs (e.g. 'new')
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid user id'
      });
    }

    const user = await User.findById(userId)
      .select('-password')
      .populate('favoriteBooks');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get user's books
    const userBooks = await Book.find({ addedBy: user._id });

    res.json({
      success: true,
      data: {
        ...user.toObject(),
        books: userBooks
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Update a user's details
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, roleName, isActive } = req.body;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Prevent self-update for critical fields
    if (user._id.toString() === req.user._id.toString()) {
      if (roleName && roleName !== user.roleName) {
        return res.status(400).json({
          success: false,
          error: 'Cannot change your own role'
        });
      }
      if (isActive !== undefined && isActive === false) {
        return res.status(400).json({
          success: false,
          error: 'Cannot deactivate your own account'
        });
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email && email !== user.email) {
      // Check if email already exists
      const emailExists = await User.findOne({ email, _id: { $ne: id } });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          error: 'Email already exists'
        });
      }
      user.email = email;
    }

    // Update role if provided
    if (roleName && roleName !== user.roleName) {
      if (!['admin', 'manager', 'user'].includes(roleName)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid role'
        });
      }
      user.roleName = roleName;

      // Find and assign role reference
      const role = await Role.findOne({ name: roleName });
      if (role) {
        user.role = role._id;
      }
    }

    // Update status
    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    await user.save();

    const updatedUser = await User.findById(id).select('-password');

    res.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Delete a user and their associated books
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete your own account'
      });
    }

    // Check if user is admin (prevent deleting other admins)
    if (user.roleName === 'admin' && req.user.roleName !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admin can delete other admins'
      });
    }

    // Delete user's books
    await Book.deleteMany({ addedBy: id });

    // Delete user
    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'User and their books deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Update a book's details
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const bookData = req.body;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    // Update book
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      bookData,
      { new: true, runValidators: true }
    ).populate('addedBy', 'name email');

    res.json({
      success: true,
      data: updatedBook,
      message: 'Book updated successfully'
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Delete a book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    await Book.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Toggle a user's active status
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Prevent deactivating yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot deactivate your own account'
      });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      data: user,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};
export const createUser = async (req, res) => {
  try {
    const { name, email, roleName = 'user', password, isActive = true } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      roleName: roleName || 'user',
      isActive: isActive !== false,
      createdBy: req.user._id
    });

    // Remove password from response
    const userResponse = await User.findById(user._id).select('-password');

    res.status(201).json({
      success: true,
      data: userResponse,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get system-wide statistics for the admin dashboard
export const getSystemStats = async (req, res) => {
  try {
    // Execute all queries in parallel for efficiency
    const [
      totalUsers,
      totalBooks,
      adminUsers,
      managerUsers,
      regularUsers,
      activeUsers,
      recentUsers,
      booksByGenre,
      recentBooks,
      allUsersForStats,
      allBooksForStats
    ] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
      User.countDocuments({ roleName: 'admin' }),
      User.countDocuments({ roleName: 'manager' }),
      User.countDocuments({ roleName: 'user' }),
      User.countDocuments({ isActive: true }),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email roleName isActive createdAt lastLogin'),
      Book.aggregate([
        { $group: { _id: '$genre', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      Book.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('addedBy', 'name email roleName'),
      User.find().select('name email roleName isActive createdAt'), // For detailed stats
      Book.find().select('price genre') // For value calculation
    ]);

    // Calculate total value from all books
    const totalValue = allBooksForStats.reduce((sum, book) => {
      return sum + (parseFloat(book.price) || 0);
    }, 0);

    // Calculate books added today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const booksAddedToday = allBooksForStats.filter(book => {
      const bookDate = new Date(book.createdAt);
      return bookDate >= today;
    }).length;

    // Prepare response with statistics
    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
          admins: adminUsers,
          managers: managerUsers,
          regular: regularUsers,
          recent: recentUsers.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            roleName: user.roleName,
            isActive: user.isActive,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
          }))
        },
        books: {
          total: totalBooks,
          totalValue: totalValue,
          booksAddedToday: booksAddedToday,
          byGenre: booksByGenre,
          recent: recentBooks.map(book => ({
            _id: book._id,
            title: book.title,
            author: book.author,
            price: book.price,
            genre: book.genre,
            addedBy: book.addedBy
          }))
        },
        system: {
          uptime: process.uptime(),
          timestamp: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching statistics'
    });
  }
};
// Get all roles available in the system
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ name: 1 });

    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('Get all roles error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Get role distribution and status statistics
export const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$roleName',
          count: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          },
          inactive: {
            $sum: { $cond: [{ $eq: ['$isActive', false] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Export all controller functions
export default {
  getAllUsers,
  getAllBooks,
  getUserById,
  updateUser,
  createUser,
  deleteUser,
  updateBook,
  deleteBook,
  toggleUserStatus,
  getSystemStats,
  getAllRoles,
  getUserStats,
  updateUserRole: async (req, res) => {
    // For backward compatibility
    const { id } = req.params;
    const { roleName } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (!['admin', 'manager', 'user'].includes(roleName)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role'
      });
    }

    user.roleName = roleName;
    const role = await Role.findOne({ name: roleName });
    if (role) {
      user.role = role._id;
    }

    await user.save();

    res.json({
      success: true,
      data: user,
      message: `User role updated to ${roleName}`
    });
  }
};