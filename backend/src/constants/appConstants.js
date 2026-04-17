/**
 * @file constants/appConstants.js
 * @description Application-wide constants and configuration values
 */

// Pagination
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// Password Requirements
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_REQUIRE_UPPERCASE = true;
export const PASSWORD_REQUIRE_NUMBER = true;
export const PASSWORD_REQUIRE_SPECIAL = false;

// Token Expiry
export const JWT_EXPIRY = '7d';
export const RESET_TOKEN_EXPIRY = 3600000; // 1 hour in milliseconds
export const VERIFY_EMAIL_TOKEN_EXPIRY = 86400000; // 24 hours in milliseconds

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const UPLOAD_DIR = 'uploads/';

// Email
export const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@bookstore.com';
export const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || 'support@bookstore.com';

// API
export const API_VERSION = 'v1';
export const API_BASE_PATH = `/api/${API_VERSION}`;

// Database
export const MONGOOSE_CONNECTION_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Roles
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
};

// Permissions
export const PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_BOOKS: 'manage_books',
  MANAGE_ROLES: 'manage_roles',
  VIEW_ANALYTICS: 'view_analytics',
};

// Cache
export const CACHE_TTL = 3600; // 1 hour in seconds

// Sort Options
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

// Book Genres
export const BOOK_GENRES = [
  'Fiction',
  'Non-Fiction',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Biography',
  'History',
  'Self-Help',
  'Technology',
];

// Status Codes
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
};
