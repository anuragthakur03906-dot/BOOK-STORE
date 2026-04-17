# Backend Project Structure

This document outlines the organization of the backend application.

## 📁 Directory Structure

```
backend/
├── src/
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # MongoDB Mongoose models
│   ├── routes/             # API route definitions
│   ├── utils/              # Utility functions and helpers
│   ├── server.js           # Express app entry point
│   └── seed.js             # Database seeding script
├── .env                    # Environment variables
├── .env.example            # Environment template
├── package.json            # Dependencies and scripts
└── node_modules/           # Installed packages
```

## 📋 Directory Descriptions

### `src/config/`
Configuration modules for external services and settings.

**Files:**
- **database.js** - MongoDB connection configuration
- **jwt.js** - JSON Web Token configuration and utilities
- **googleOAuth.js** - Google OAuth 2.0 configuration
- **multerConfig.js** - File upload configuration

### `src/controllers/`
Request handlers organized by feature/domain.

**Files:**
- **adminController.js** - Admin operations (stats, system info)
- **authController.js** - Authentication (login, register, refresh token)
- **bookController.js** - Book CRUD operations
- **uploadController.js** - File upload handling
- **userController.js** - User profile and management operations

### `src/middleware/`
Express middleware functions for cross-cutting concerns.

**Files:**
- **authMiddleware.js** - JWT verification and authentication
- **captchaMiddleware.js** - reCAPTCHA verification
- **errorHandler.js** - Global error handling middleware
- **permissionMiddleware.js** - Role-based access control (RBAC)
- **validationMiddleware.js** - Input validation middleware

### `src/models/`
Mongoose schema definitions for MongoDB collections.

**Files:**
- **Book.js** - Book document schema
- **User.js** - User document schema
- **Role.js** - Role document schema (admin, manager, user)
- **Token.js** - Reset/verification token schema

### `src/routes/`
API endpoint route definitions.

**Files:**
- **adminRoutes.js** - Admin-only endpoints
- **authRoutes.js** - Authentication endpoints (login, register, logout)
- **bookRoutes.js** - Book CRUD endpoints
- **googleAuthRoutes.js** - Google OAuth endpoints
- **uploadRoutes.js** - File upload endpoints
- **userRoutes.js** - User management endpoints

### `src/utils/`
Utility functions and helper modules.

**Files:**
- **captchaUtils.js** - CAPTCHA generation and validation
- **emailService.js** - Email sending functionality (Nodemailer)
- **helpers.js** - Common helper functions (pagination, filtering, sorting)
- **validators.js** - Input validation schemas (express-validator)

## 🔧 Key Files

### `server.js`
Main Express application file. Includes:
- Middleware setup
- Route registration
- CORS and security headers (Helmet)
- Passport.js configuration
- Database connection
- Error handling

### `seed.js`
Database seeding script for initial data population.
- Create admin user
- Create sample books
- Set up roles

## 📊 API Endpoints Structure

Routes are organized by domain:

```
/api/
├── /auth              # Authentication endpoints
├── /users             # User management
├── /books             # Book operations
├── /admin             # Administrative operations
├── /upload            # File uploads
└── /google            # Google OAuth
```

## 🔐 Authentication & Authorization

- **JWT** - Stateless authentication via JSON Web Tokens
- **RBAC** - Role-based access control (admin, manager, user)
- **Passport.js** - Google OAuth 2.0 integration
- **Bcryptjs** - Password hashing

## 📦 Dependencies

Check `package.json` for full list. Key packages:
- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database and ODM
- **Passport.js** - Authentication middleware
- **JWT** - Token generation/verification
- **Bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Multer** - File upload handling
- **Nodemailer** - Email sending
- **express-validator** - Input validation
- **Dotenv** - Environment variable loading

## 🔗 Middleware Stack Order

1. `dotenv.config()` - Load environment variables
2. Security middleware (Helmet, CORS)
3. Body parsing middleware
4. Cookie and session middleware
5. Passport.js initialization
6. Route handlers
7. Error handler middleware (last)

## 💡 Best Practices

1. **Separation of Concerns** - Controllers handle business logic, routes define endpoints
2. **Validation Layer** - Validate inputs in middleware before controller
3. **Error Handling** - Use try-catch in controllers, centralized error handler
4. **Constants** - Store magic strings and numbers as constants
5. **Async/Await** - Use async/await instead of callback chains
6. **Environment Variables** - Never hardcode sensitive information
7. **Rate Limiting** - Implement rate limiting on sensitive endpoints
8. **Logging** - Log important operations for debugging

## 🚀 Running the Server

```bash
# Development with hot reload
npm run dev

# Production
npm start

# Seed database
npm run seed
```

## 🌍 Environment Variables

Required environment variables (see `.env.example`):
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Token signing secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret
- `GOOGLE_CALLBACK_URL` - OAuth callback URL
- `SESSION_SECRET` - Session encryption secret
- `FRONTEND_URL` - Frontend application URL
- `SMTP_*` - Email service credentials
- `RECAPTCHA_SECRET_KEY` - reCAPTCHA secret

## 📝 API Response Format

Standard response format:

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message",
  "pagination": { /* optional pagination info */ }
}
```

## 🔗 Related Documentation

- [README.md](../README.md) - Project overview
- [API Reference](../README.md#-api-endpoints) - Complete API documentation
