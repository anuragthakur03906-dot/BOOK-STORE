import { body } from 'express-validator';

export const registerValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot be more than 50 characters'),
  
  body('email')
    .isEmail().withMessage('Please include a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number')
];

export const loginValidator = [
  body('email')
    .isEmail().withMessage('Please include a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

export const forgotPasswordValidator = [
  body('email')
    .isEmail().withMessage('Please include a valid email')
    .normalizeEmail()
];

export const resetPasswordValidator = [
  body('token')
    .notEmpty().withMessage('Token is required'),
  
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
];


export const bookValidator = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  
  body('author')
    .notEmpty().withMessage('Author is required'),
  
  body('genre')
    .isIn(['Fiction', 'Non-Fiction', 'Sci-Fi', 'Mystery', 'Biography', 'Self-Help', 'Technology', 'Fantasy', 'Romance'])
    .withMessage('Invalid genre'),
  
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('publishedYear')
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Invalid year')
];
