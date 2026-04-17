# Frontend Project Structure

This document outlines the organization of the frontend application.

## 📁 Directory Structure

```
frontend/
├── public/                  # Static assets (favicons, etc.)
├── src/
│   ├── assets/             # Images, icons, static files
│   ├── components/         # React components
│   │   ├── admin/          # Admin-related components
│   │   ├── auth/           # Authentication components
│   │   ├── books/          # Book-related components
│   │   ├── common/         # Reusable common components
│   │   ├── layout/         # Layout components (Navbar, Sidebar, Footer)
│   │   └── users/          # User-related components
│   ├── context/            # React Context (Global State)
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components / Route containers
│   ├── services/           # API services and external integrations
│   ├── styles/             # Global stylesheets
│   ├── utils/              # Utility functions and helpers
│   ├── App.jsx             # Main App component
│   └── main.jsx            # React DOM entry point
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── package.json            # Dependencies and scripts
└── .env                    # Environment variables
```

## 📋 Directory Descriptions

### `public/`
Static assets that are copied as-is to the build output.
- Favicons, manifests
- Static images not imported in code

### `src/assets/`
Project images, icons, and other media files imported in code.
- Organized by type (images/, icons/) as needed

### `src/components/`
Reusable React components organized by feature.

**Subdirectories:**
- **admin/**: Components for admin dashboard and management (AdminDashboard, ManagerDashboard, UserDashboard, BookManagement, UserManagement)
- **auth/**: Authentication flows (Login, Register, ForgotPassword, ResetPassword, GoogleAuthCallback, Recaptcha, ProtectedRoute)
- **books/**: Book-related components (BookCard, BookList, BookForm, FilterPanel, SearchBar, Pagination)
- **common/**: Reusable components (LoadingSpinner, ConfirmModal, ErrorMessage, BackButton)
- **layout/**: Page layout components (Navbar, Sidebar, Footer)
- **users/**: User-related components (Profile)

### `src/context/`
Global state management using React Context API.
- `AuthContext.jsx` - Authentication state and user info
- `ThemeContext.jsx` - Dark/Light theme state
- `ToastContext.jsx` - Toast notifications state

### `src/hooks/`
Custom React hooks for reusable logic.
- `useAuth.js` - Access authentication context
- `useBooks.js` - Book-related data fetching logic

### `src/pages/`
Full-page components representing routes.
- `Home.jsx` - Home page
- `LoginPage.jsx` - Login page
- `RegisterPage.jsx` - Registration page
- `Books.jsx` - Books listing page
- `BookDetailsPage.jsx` - Single book details
- `AddBookPage.jsx` / `EditBookPage.jsx` - Book management pages
- `AddUserPage.jsx` / `EditUserPage.jsx` - User management pages
- `ProfilePage.jsx` - User profile page
- `FavoritesPage.jsx` - Favorites listing page
- `AdminDashboard.jsx` - Admin dashboard page (redirects to DynamicDashboard)
- `DynamicDashboard.jsx` - Routes to admin/manager/user dashboards
- `UserDetailPage.jsx` - User details page
- `NotFound.jsx` - 404 page

### `src/services/`
API clients and external service integrations.
- `api.js` - Axios instance and API endpoints (userAPI, bookAPI, adminAPI, uploadAPI)

### `src/styles/`
Global stylesheets and CSS organization.
- `index.css` - Main stylesheet with Tailwind and global styles
- `variables.css` - CSS custom properties and theme variables
- `animations.css` - Reusable animations and effects
- `scrollbar.css` - Custom scrollbar styling

### `src/utils/`
Utility functions and helper modules.
- `constants.js` - Application constants and configurations
- `helpers.js` - General-purpose utility functions

## 🔄 Component Organization Pattern

Each feature-based component directory follows this pattern:

```
components/feature/
├── FeatureComponent.jsx    # Main component
├── FeatureDetail.jsx       # Related components
└── index.js (optional)     # Barrel export for cleaner imports
```

## 🚀 Key Files

- **App.jsx**: Main application component with routing
- **main.jsx**: React entry point, mounts App to root element
- **index.html**: HTML template with root div

## 🔐 Environment Variables

See `.env` file for required environment variables:
- `VITE_API_BASE_URL` - Backend API URL
- Other service keys (Google OAuth, reCAPTCHA, etc.)

## 📦 Dependencies

Check `package.json` for full dependency list. Key packages:
- **React 18** - UI framework
- **Vite** - Build tool
- **React Router v7** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Formik & Yup** - Form management
- **React Icons** - Icon library
- **React Hot Toast** - Notifications
- **Passport.js** - Authentication (Google OAuth)

## 💡 Best Practices

1. **Keep components focused** - One responsibility per component
2. **Use custom hooks** - Extract reusable logic into hooks
3. **Constant imports** - Import constants from `utils/constants.js`
4. **Service layer** - All API calls through `services/api.js`
5. **Context for global state** - Use Context for auth, theme, notifications
6. **Tailwind first** - Prefer utility-first CSS approach
7. **Responsive design** - Use Tailwind responsive prefixes (sm:, md:, lg:)

## 🔗 Related Documentation

- [Styles Guide](./src/styles/README.md) - CSS organization and variables
- [README.md](../README.md) - Project overview
