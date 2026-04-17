import express from 'express';
import { 
  getBooks, 
  getBook, 
  createBook, 
  updateBook, 
  deleteBook,
  getGenres,
  getPriceRange,
  getBooksByUser
} from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';
import { hasPermission, canEditBook, canDeleteBook } from '../middleware/permissionMiddleware.js';
import validate from '../middleware/validationMiddleware.js';
import { bookValidator } from '../validations/index.js';

const router = express.Router();

// Public routes
router.get('/', getBooks);
router.get('/genres', getGenres);
router.get('/price-range', getPriceRange);
router.get('/:id', getBook);

// Protected routes - Permission based
router.post('/', 
  protect, 
  hasPermission('createBooks'), 
  validate(bookValidator), 
  createBook
);

router.put('/:id', 
  protect, 
  hasPermission('editBooks'), 
  validate(bookValidator), 
  updateBook
);

router.delete('/:id', 
  protect, 
  hasPermission('deleteBooks'), 
  deleteBook
);

router.get('/user/:userId', 
  protect, 
  getBooksByUser
);

export default router;