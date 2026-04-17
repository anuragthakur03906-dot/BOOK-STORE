# Project Structure & Organization Guide

## 🎯 Overview

This BookStore application follows industry-standard folder structure patterns to ensure:
- ✅ Clear separation of concerns
- ✅ Scalability and maintainability
- ✅ Easy navigation and onboarding
- ✅ Professional code organization

## 📂 Root Structure

```
BOOK-STORE/
├── frontend/              # React + Vite frontend application
├── backend/               # Node.js + Express backend API
├── README.md              # Project overview and setup guide
└── .gitignore             # Git ignore patterns
```

## 🎨 Frontend Architecture (`frontend/`)

### Key Characteristics:
- **Build Tool**: Vite (fast development and optimized builds)
- **Styling**: Tailwind CSS (utility-first CSS)
- **State Management**: React Context API
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Forms**: Formik + Yup validation

### Recommended Pattern:
```
src/
├── components/           # Feature-based component organization
│   ├── feature/
│   │   ├── Component1.jsx
│   │   └── Component2.jsx
│   └── common/           # Reusable components
├── context/              # Global state via Context API
├── hooks/                # Custom React hooks
├── pages/                # Route components
├── services/             # API layer (Axios instances)
├── utils/                # Helper functions
└── styles/               # CSS organization
```

**See**: `frontend/STRUCTURE.md` for detailed documentation

## 🚀 Backend Architecture (`backend/`)

### Key Characteristics:
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Passport.js (Google OAuth)
- **Security**: Helmet, CORS, bcryptjs, express-validator
- **File Upload**: Multer
- **Email**: Nodemailer

### Recommended Pattern:
```
src/
├── config/               # Service configurations
├── models/               # Database schemas
├── controllers/          # Business logic handlers
├── routes/               # Endpoint definitions
├── middleware/           # Request processing functions
└── utils/                # Helper functions
```

**See**: `backend/STRUCTURE.md` for detailed documentation

## 🔄 Communication Pattern

```
Frontend                    Backend
  UI (React Components)
     ↓ (HTTP Request)
  Services (Axios)    →    Routes (Express)
                          ↓
                       Controllers (Business Logic)
                          ↓
                       Models (MongoDB)
                          ↓
                       Middleware (Validation, Auth)
     ↑ (JSON Response)
  Context/Hooks       ←    Response Handler
     ↓
  State Update
     ↓
  Component Re-render
```

## 🗂️ File Organization Principles

### 1. **Feature-Based Structure** (Frontend Components)
Group related components together:
```
components/
├── auth/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── ProtectedRoute.jsx
├── books/
│   ├── BookCard.jsx
│   ├── BookList.jsx
│   └── BookForm.jsx
```

### 2. **Domain-Based Structure** (Backend)
Organize by business domain:
```
src/
├── models/
│   └── User.js
├── controllers/
│   └── userController.js
├── routes/
│   └── userRoutes.js
└── middleware/
    └── authMiddleware.js
```

### 3. **Reusable Utilities**
```
Frontend utils/:
- constants.js (app-wide constants)
- helpers.js (utility functions)

Backend utils/:
- helpers.js (pagination, filtering)
- validators.js (input validation)
- emailService.js (email operations)
```

## 📦 Dependency Management

### Frontend (`package.json`)
- **React 18**: UI library
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **React Router v7**: Routing
- **Axios**: HTTP client
- **Formik & Yup**: Form management
- **React Icons**: Icon library
- **React Hot Toast**: Notifications

### Backend (`package.json`)
- **Express.js**: Web framework
- **MongoDB & Mongoose**: Database
- **Passport.js**: Authentication
- **JWT**: Token-based auth
- **Bcryptjs**: Password hashing
- **Helmet**: Security headers
- **Multer**: File uploads
- **Nodemailer**: Email sending

## 🔒 Environment Variables

### Frontend (`.env`)
```
VITE_API_BASE_URL=http://localhost:5000
```

### Backend (`.env`)
```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:3000
# ... more variables
```

## 🎯 Naming Conventions

### Components
- **React Components**: PascalCase (LoginForm.jsx, BookCard.jsx)
- **Utilities**: camelCase (helpers.js, validators.js)
- **Constants**: UPPER_SNAKE_CASE (API_ENDPOINTS, DEFAULT_LIMIT)

### Files & Folders
- **Folders**: lowercase-kebab-case (components/, utils/, config/)
- **Files**: Match component/export name (Button.jsx, constants.js)

### Functions & Variables
- **Functions**: camelCase (fetchBooks, handleSubmit)
- **Constants**: UPPER_SNAKE_CASE (MAX_FILE_SIZE, API_URL)
- **Booleans**: isSomething, hasSomething, shouldRender

## 🧹 Clean Code Principles

1. **DRY (Don't Repeat Yourself)**
   - Extract common logic to utilities
   - Create custom hooks for reusable component logic

2. **SOLID Principles**
   - Single Responsibility: Components do one thing
   - Open/Closed: Open for extension, closed for modification
   - Dependency Inversion: Depend on abstractions, not concrete implementations

3. **Keep It Simple (KISS)**
   - Clear, readable code over clever code
   - Add comments for complex logic
   - Meaningful variable names

4. **Component Composition**
   - Break large components into smaller pieces
   - Use composition over inheritance
   - Lift state only when necessary

## 📚 Related Documentation

- **Frontend**: See `frontend/STRUCTURE.md`
- **Backend**: See `backend/STRUCTURE.md`
- **Project Overview**: See `README.md`
- **Styles Guide**: See `frontend/src/styles/README.md`

## 🚀 Getting Started

### Setup
```bash
# Clone repository
git clone <repo-url>

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Development
```bash
# Terminal 1: Frontend
cd frontend
npm run dev

# Terminal 2: Backend
cd backend
npm run dev
```

### Production
```bash
# Build frontend
cd frontend && npm run build

# Start backend
cd backend && npm start
```

## ✅ Best Practices Checklist

- ✅ Use feature-based component organization
- ✅ Keep components focused and reusable
- ✅ Extract business logic to custom hooks or services
- ✅ Use consistent naming conventions throughout
- ✅ Organize styles using Tailwind utility classes
- ✅ Validate inputs on both client and server
- ✅ Handle errors gracefully with user feedback
- ✅ Use environment variables for configuration
- ✅ Create meaningful commit messages
- ✅ Document complex logic with comments
- ✅ Keep functions small and testable
- ✅ Use TypeScript for better type safety (future improvement)

## 🔗 Quick Links

- Frontend Structure: `frontend/STRUCTURE.md`
- Backend Structure: `backend/STRUCTURE.md`
- Styles Guide: `frontend/src/styles/README.md`
- Main README: `README.md`
