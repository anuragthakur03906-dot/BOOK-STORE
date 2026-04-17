# BookStore - MERN Stack Application

A modern, feature-rich **MERN Stack** (MongoDB, Express, React, Node.js) application for managing a digital book library. Built with production-ready code, professional UI, and enterprise-level security.

## Overview

BookStore is a complete book management system that allows users to browse, search, and manage books with an intuitive interface. The application features role-based access control, secure authentication, and a beautiful responsive design optimized for all screen sizes.

## Key Features

### Authentication & Security
- **JWT Authentication** - Secure token-based authentication with expiration
- **Google OAuth 2.0** - Login with Google accounts for seamless authentication
- **Google reCAPTCHA v2** - Protection against automated attacks and bot submissions
- **Bcrypt Password Hashing** - Industry-standard password encryption with salt
- **Secure Session Management** - HTTP-only cookies and CSRF protection

### User Management & RBAC
- **Role-Based Access Control** - Three distinct user roles with specific permissions:
  - **Admin** - Full system control, user management, all permissions
  - **Manager** - Book management, user viewing and basic statistics
  - **User** - Browse books, manage favorites, personal library management
- **User Dashboards** - Customized interfaces based on user roles
- **Account Management** - Profile updates, password reset, account settings

### Book Management
- **Full CRUD Operations** - Create, read, update, delete books
- **Advanced Search** - Search by title, author, or genre in real-time
- **Filtering & Sorting** - Filter by genre, price range, rating, or sort by various criteria
- **Pagination** - Efficient page-based data loading (6 books per page)
- **Book Details** - Comprehensive book information with ratings and reviews

### User Experience
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop screens
- **Dark/Light Mode** - Theme switching with system preference detection
- **Modern UI** - Clean professional design built with Tailwind CSS
- **Favorites System** - Save, manage, and organize favorite books
- **Fast Performance** - Debounced search, lazy loading, optimized queries

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and Context API
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **React Router v7** - Client-side routing and navigation
- **Axios** - HTTP client for seamless API integration
- **Formik & Yup** - Form management and validation
- **React Icons** - Rich icon library (Feather icons)
- **React Hot Toast** - Clean toast notifications

### Backend  
- **Node.js 18+** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB 9.0** - NoSQL database with Mongoose ODM
- **Passport.js** - Authentication middleware
- **JWT (jsonwebtoken)** - Token generation and verification
- **Bcryptjs** - Password hashing and verification
- **Nodemailer** - Email service for password reset flow
- **Helmet** - Security headers middleware
- **CORS** - Cross-origin resource sharing configuration

---

## Project Structure

```
BOOK-STORE/
├── frontend/                 # React + Vite frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── auth/       # Authentication components (Login, Register, OAuth)
│   │   │   ├── books/      # Book-related components (list, filters, pagination)
│   │   │   ├── admin/      # Admin and Manager dashboards
│   │   │   ├── common/     # Shared UI components (buttons, modals, etc)
│   │   │   └── layout/     # Application layout (Navbar, Footer, Sidebar)
│   │   ├── pages/          # Full page view components
│   │   ├── context/        # React Context (Auth, Theme state)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API client and configuration
│   │   └── utils/          # Helper functions and constants
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   └── tailwind.config.js  # Tailwind CSS configuration
│
├── backend/                  # Node.js + Express backend application
│   ├── src/
│   │   ├── models/         # Mongoose schemas (User, Book, Role, Token)
│   │   ├── controllers/    # Route handlers and business logic
│   │   ├── routes/         # API endpoint definitions
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── config/         # Database, JWT, OAuth configuration
│   │   ├── utils/          # Helper functions (email, validators)
│   │   ├── server.js       # Express app setup and middleware
│   │   └── seed.js         # Database seeding script with demo data
│   ├── .env.example        # Environment variables template
│   └── package.json        # Backend dependencies
│
└── README.md               # This file
```

## Key Features Explained

### Pagination System
- **Default**: 6 books displayed per page
- **Dynamic Loading**: Books load based on page number
- **Responsive Controls**: Pagination buttons work on all screen sizes
- **Smart Navigation**: Previous/Next buttons disable when at start/end

### Search & Filtering
- **Real-time Search** with 300ms debouncing to optimize performance
- **Genre Filter** for category-based browsing
- **Price Range** filtering for budget-conscious users
- **Rating Filter** to find highly-rated books
- **Sort Options**: Title, Price, Rating, or Date Added

### Role-Based Access Control (RBAC)
- Middleware validates user roles on protected routes
- Different dashboard interfaces for each role
- Feature visibility based on user permissions
- Granular permission control for each action

### Security Features
- Passwords hashed with Bcrypt (10 salt rounds)
- JWT tokens expire after 7 days for security
- Google reCAPTCHA prevents automated attacks
- CORS configured for allowed frontend origins only
- Helmet provides HTTP security headers
- Environment variables protect sensitive data

---
---


## Performance Optimizations

- Image lazy loading for faster page loads
- Code splitting with React.lazy for smaller bundles
- Optimized re-renders using useCallback and useMemo
- MongoDB indexing on frequently queried fields
- Debounced search queries to reduce API calls
- Efficient pagination to handle large datasets

## Support & Issues

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the author via email
- Check existing issues for solutions

---

## Project Status

This project is actively maintained and production-ready. Regular updates and improvements are made based on best practices and user feedback.
