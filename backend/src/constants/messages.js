/**
 * @file constants/messages.js
 * @description Standard application messages and response strings
 */

export const MESSAGES = {
  // Success Messages
  SUCCESS_LOGIN: 'Login successful',
  SUCCESS_REGISTER: 'Account created successfully',
  SUCCESS_LOGOUT: 'Logged out successfully',
  SUCCESS_PASSWORD_RESET: 'Password reset email sent',
  SUCCESS_PASSWORD_UPDATED: 'Password updated successfully',
  SUCCESS_PROFILE_UPDATED: 'Profile updated successfully',
  SUCCESS_DATA_FETCHED: 'Data fetched successfully',
  
  // Book Messages
  BOOK_CREATED: 'Book added successfully',
  BOOK_UPDATED: 'Book updated successfully',
  BOOK_DELETED: 'Book deleted successfully',
  BOOK_NOT_FOUND: 'Book not found',
  
  // User Messages
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  USER_NOT_FOUND: 'User not found',
  
  // Auth Messages
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_ALREADY_EXISTS: 'Email already registered',
  ACCOUNT_DISABLED: 'Account is disabled',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid or expired token',
  
  // Validation Messages
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  INVALID_EMAIL: 'Please provide a valid email',
  WEAK_PASSWORD: 'Password is too weak',
  
  // Permission Messages
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'Access denied',
  
  // System Messages
  SERVER_ERROR: 'Server error occurred',
  DATABASE_ERROR: 'Database error occurred',
  FILE_UPLOAD_ERROR: 'File upload failed',
  CAPTCHA_FAILED: 'Captcha verification failed',
};

export const ERROR_MESSAGES = {
  VALIDATION_FAILED: 'Validation failed',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  RESOURCE_NOT_FOUND: 'Resource not found',
  INVALID_REQUEST: 'Invalid request',
  INTERNAL_SERVER_ERROR: 'Internal server error',
};

export const SUCCESS_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
};

export const ERROR_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};
