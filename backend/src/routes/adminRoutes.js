import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  hasPermission,
  requireRole,
  requireAdmin,
  requireAdminOrManager
} from '../middleware/permissionMiddleware.js';
import adminController from '../controllers/adminController.js';

const router = express.Router();

// PROTECT ALL ADMIN ROUTES
router.use(protect);

// ================================
// DASHBOARD ROUTE
// ================================
router.get('/dashboard',
  requireAdminOrManager(), 
  adminController.getSystemStats
);

// ================================
// USER MANAGEMENT ROUTES
// ================================
router.get('/users',
  requireAdminOrManager(),
  adminController.getAllUsers
);

router.post('/users/new',
  requireAdmin(),
  adminController.createUser
);

// Avoid conflict with /users/new (create user form path)
router.get('/users/new',
  requireAdmin(),
  (req, res) => res.status(403).json({ 
    success: false, 
    error: 'Use POST /admin/users/new to create a user' 
  })
);

router.get('/users/:id',
  requireAdminOrManager(),
  adminController.getUserById
);

router.put('/users/:id',
  requireAdmin(),
  adminController.updateUser
);

router.put('/users/:id/role',
  requireAdmin(),
  adminController.updateUserRole
);

router.put('/users/:id/status',
  requireAdmin(),
  adminController.toggleUserStatus
);

router.delete('/users/:id',
  requireAdmin(),
  adminController.deleteUser
);

// ================================
// BOOK MANAGEMENT ROUTES
// ================================
router.get('/books',
  requireAdminOrManager(),
  adminController.getAllBooks
);

router.put('/books/:id',
  requireAdminOrManager(),
  adminController.updateBook
);

router.delete('/books/:id',
  requireAdminOrManager(),
  adminController.deleteBook
);

// ================================
// SYSTEM STATISTICS
// ================================
router.get('/stats',
  requireAdminOrManager(),
  adminController.getSystemStats
);

// ================================
// USER STATISTICS
// ================================
router.get('/user-stats',
  requireAdmin(),
  adminController.getUserStats
);

// ================================
// ROLE MANAGEMENT
// ================================
router.get('/roles',
  requireAdmin(),
  adminController.getAllRoles
);

export default router;