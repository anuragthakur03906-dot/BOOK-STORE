/**
 * @file Book.js
 * @description Book model schema for catalog management.
 * Stores book details including metadata, pricing, rating, and cover image reference.
 */

import mongoose from 'mongoose';

/**
 * Book Schema
 * - Stores book catalog information (title, author, genre, price, rating)
 * - References cover image stored in GridFS via coverImage field
 * - Includes inventory status (inStock) and publication tracking
 * - Indexed fields: title, author, genre for fast searching and filtering
 * - Timestamps: createdAt and updatedAt for activity tracking
 */
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    index: true,
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
    index: true
  },
  genre: {
    type: String,
    required: true,
    enum: ['Fiction', 'Non-Fiction', 'Sci-Fi', 'Mystery', 'Biography', 'Self-Help', 'Technology', 'Fantasy', 'Romance'],
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  publishedYear: {
    type: Number,
    required: true,
    min: [1000, 'Invalid year'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  coverImage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

export default Book;