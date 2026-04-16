import User from '../models/User.js';
import Role from '../models/Role.js';

// Main permission check middleware based on user roles
export const hasPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Get user with role
      const user = await User.findById(req.user._id)
        .select('-password');

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      console.log(`� Permission Check - User: ${user.email}, Role: ${user.roleName}, Required: ${permission}`);

      // Define system permissions for each role
      const rolePermissions = {
        admin: {
          // User Management
          manageUsers: true,
          viewUsers: true,
          editUsers: true,
          deleteUsers: true,
          toggleUserStatus: true,

          // Book Management
          manageAllBooks: true,
          createBooks: true,
          editBooks: true,
          deleteBooks: true,
          viewAllBooks: true,
          editAnyBook: true,
          deleteAnyBook: true,

          // Dashboard
          viewDashboard: true,
          viewAdminDashboard: true,
          viewManagerDashboard: true,
          viewUserDashboard: true,

          // Reports
          viewReports: true,
          generateReports: true,

          // Settings
          manageSettings: true,

          // Role Management
          assignRoles: true,
          manageRoles: true
        },
        manager: {
          // User Management
          manageUsers: false,
          viewUsers: true,
          editUsers: false,
          deleteUsers: false,
          toggleUserStatus: false,

          // Book Management
          manageAllBooks: true,
          createBooks: true,
          editBooks: true,
          deleteBooks: true,
          viewAllBooks: true,
          editAnyBook: true,
          deleteAnyBook: true,

          // Dashboard
          viewDashboard: true,
          viewAdminDashboard: false,
          viewManagerDashboard: true,
          viewUserDashboard: false,

          // Reports
          viewReports: true,
          generateReports: false,

          // Settings
          manageSettings: false,

          // Role Management
          assignRoles: false,
          manageRoles: false
        },
        user: {
          // User Management
          manageUsers: false,
          viewUsers: false,
          editUsers: false,
          deleteUsers: false,
          toggleUserStatus: false,

          // Book Management
          manageAllBooks: false,
          createBooks: true,
          editBooks: false,
          deleteBooks: false,
          viewAllBooks: true,
          editAnyBook: false,
          deleteAnyBook: false,

          // Dashboard
          viewDashboard: true,
          viewAdminDashboard: false,
          viewManagerDashboard: false,
          viewUserDashboard: true,

          // Reports
          viewReports: false,
          generateReports: false,

          // Settings
          manageSettings: false,

          // Role Management
          assignRoles: false,
          manageRoles: false
        }
      };

      // Check if permission exists in the system
      if (!rolePermissions[user.roleName] || !(permission in rolePermissions[user.roleName])) {
        console.log(` Permission not defined: ${permission} for role ${user.roleName}`);
        // For undefined permissions, check if user is admin
        if (user.roleName === 'admin') {
          console.log(`Admin granted undefined permission: ${permission}`);
          return next();
        }
        return res.status(403).json({
          success: false,
          error: `Permission '${permission}' is not defined for your role`
        });
      }

      // Check if user's role has the required permission
      if (rolePermissions[user.roleName][permission]) {
        console.log(`Permission GRANTED: ${user.roleName} can ${permission}`);
        return next();
      }

      console.log(`Permission DENIED: ${user.roleName} cannot ${permission}`);
      return res.status(403).json({
        success: false,
        error: `You don't have permission to ${permission} (Role: ${user.roleName})`
      });

    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        error: 'Server error during permission check'
      });
    }
  };
};

// Specific permission check for editing books
export const canEditBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const Book = (await import('../models/Book.js')).default;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    const user = await User.findById(req.user._id);

    // Admins can edit any book
    if (user.roleName === 'admin') {
      return next();
    }

    // Managers can edit any book
    if (user.roleName === 'manager') {
      return next();
    }

    // Regular users can only edit their own books
    if (book.addedBy.toString() === req.user._id.toString()) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'Not authorized to edit this book'
    });

  } catch (error) {
    console.error('Book permission error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Specific permission check for deleting books
export const canDeleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const Book = (await import('../models/Book.js')).default;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    const user = await User.findById(req.user._id);

    // Admins can delete any book
    if (user.roleName === 'admin') {
      return next();
    }

    // Managers can delete any book
    if (user.roleName === 'manager') {
      return next();
    }

    // Regular users can only delete their own books
    if (book.addedBy.toString() === req.user._id.toString()) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'Not authorized to delete this book'
    });

  } catch (error) {
    console.error('Book delete permission error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Middleware to ensure a user owns the book they are trying to modify
export const checkBookOwnership = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const Book = (await import('../models/Book.js')).default;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }

    const user = await User.findById(req.user._id);

    // Admins and Managers can bypass ownership check
    if (user.roleName === 'admin' || user.roleName === 'manager') {
      return next();
    }

    // Regular users can only edit/delete their own books
    if (book.addedBy.toString() === req.user._id.toString()) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'You can only modify your own books'
    });

  } catch (error) {
    console.error('Book ownership check error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// Check if user has one of the provided roles
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.roleName)) {
      return res.status(403).json({
        success: false,
        error: `Required role: ${roles.join(' or ')}. Your role: ${req.user.roleName}`
      });
    }

    next();
  };
};

// Require Admin permissions
export const requireAdmin = () => {
  return (req, res, next) => {
    if (!req.user || req.user.roleName !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      });
    }
    next();
  };
};

// Require Admin or Manager permissions
export const requireAdminOrManager = () => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!['admin', 'manager'].includes(req.user.roleName)) {
      return res.status(403).json({
        success: false,
        error: 'Admin or Manager access required'
      });
    }

    next();
  };
};

// Export all middleware functions
export default {
  hasPermission,
  requireRole,
  requireAdmin,
  requireAdminOrManager,
  canEditBook,
  canDeleteBook,
  checkBookOwnership
};