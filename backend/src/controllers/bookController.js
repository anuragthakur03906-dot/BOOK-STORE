import Book from '../models/Book.js';
import User from '../models/User.js';
import { getPagination, buildFilter, buildSort } from '../utils/helpers.js';

export const getBooks = async (req, res) => {
  try {
    const { page, limit, sortBy, sortOrder, ...query } = req.query;
    const { skip, limit: limitNum } = getPagination(page, limit);
    
    const filter = buildFilter(query);
    const sort = buildSort(sortBy, sortOrder);
    
    const books = await Book.find(filter)
      .populate('addedBy', 'name email roleName')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);
    
    const totalBooks = await Book.countDocuments(filter);
    const totalPages = Math.ceil(totalBooks / limitNum);
    
    res.json({
      success: true,
      count: books.length,
      data: books,
      pagination: {
        currentPage: parseInt(page) || 1,
        totalPages,
        totalBooks,
        hasNextPage: (parseInt(page) || 1) < totalPages,
        hasPrevPage: (parseInt(page) || 1) > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('addedBy', 'name email roleName');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const createBook = async (req, res) => {
  try {
    req.body.addedBy = req.user._id;
    const book = await Book.create(req.body);
    
    // Populate addedBy information
    const populatedBook = await Book.findById(book._id)
      .populate('addedBy', 'name email roleName');
    
    res.status(201).json({
      success: true,
      data: populatedBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    // Get current user
    const currentUser = await User.findById(req.user._id);
    
    // Check permissions based on role
    if (currentUser.roleName === 'admin') {
      // Admin can edit any book
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      }).populate('addedBy', 'name email roleName');
      
      return res.json({
        success: true,
        data: updatedBook
      });
    }
    
    if (currentUser.roleName === 'manager') {
      // Manager can edit any book
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      }).populate('addedBy', 'name email roleName');
      
      return res.json({
        success: true,
        data: updatedBook
      });
    }
    
    // Regular user can only edit their own books
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to edit this book'
      });
    }
    
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('addedBy', 'name email roleName');
    
    res.json({
      success: true,
      data: updatedBook
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({
        success: false,
        error: 'Book not found'
      });
    }
    
    // Get current user
    const currentUser = await User.findById(req.user._id);
    
    // Check permissions based on role
    if (currentUser.roleName === 'admin') {
      // Admin can delete any book
      await book.deleteOne();
      return res.json({
        success: true,
        data: {}
      });
    }
    
    if (currentUser.roleName === 'manager') {
      // Manager can delete any book
      await book.deleteOne();
      return res.json({
        success: true,
        data: {}
      });
    }
    
    // Regular user can only delete their own books
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this book'
      });
    }
    
    await book.deleteOne();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getGenres = async (req, res) => {
  try {
    const genres = await Book.distinct('genre');
    res.json({
      success: true,
      data: genres
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getPriceRange = async (req, res) => {
  try {
    const result = await Book.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]);
    
    res.json({
      success: true,
      data: result[0] || { minPrice: 0, maxPrice: 0, avgPrice: 0 }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getBooksByUser = async (req, res) => {
  try {
    const books = await Book.find({ addedBy: req.params.userId })
      .populate('addedBy', 'name email roleName');
    
    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};