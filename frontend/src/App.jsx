import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';

// Public Pages
import Home from './pages/Home.jsx';
import Books from './pages/Books.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPassword from './components/auth/ForgotPassword.jsx';
import ResetPassword from './components/auth/ResetPassword.jsx';
import GoogleAuthCallback from './components/auth/GoogleAuthCallback.jsx';
import BookDetailsPage from './pages/BookDetailsPage.jsx';
import NotFound from './pages/NotFound.jsx';

// Protected User Pages
import ProfilePage from './pages/ProfilePage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';

// Book Management (User/Manager/Admin)
import AddBookPage from './pages/AddBookPage.jsx';
import EditBookPage from './pages/EditBookPage.jsx';

// Dashboard Pages
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import ManagerDashboard from './components/admin/ManagerDashboard.jsx';
import UserDashboard from './components/admin/UserDashboard.jsx';

// Admin & Manager Management Pages
import UserManagement from './components/admin/UserManagement.jsx';
import UserDetailPage from './pages/UserDetailPage.jsx';
import EditUserPage from './pages/EditUserPage.jsx';
import AddUserPage from './pages/AddUserPage.jsx';
import BookManagement from './components/admin/BookManagement.jsx';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* ==================== PUBLIC ROUTES ==================== */}
              
              {/* Home and Auth */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Google OAuth */}
              <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
              <Route path="/auth/success" element={<GoogleAuthCallback />} />

              {/* Book Browsing (Public) */}
              <Route path="/books" element={<Books />} />
              <Route path="/books/:id" element={<BookDetailsPage />} />

              {/* ==================== PROTECTED USER ROUTES ==================== */}
              
              {/* User Profile & Favorites */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                }
              />

              {/* User Dashboard - Available to all authenticated users (excluding admin/manager) */}
              <Route
                path="/user/dashboard"
                element={
                  <ProtectedRoute roles={['user']}>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />

              {/* ==================== BOOK MANAGEMENT ROUTES ==================== */}
              
              {/* Add/Edit Book - Users, Managers, Admins */}
              <Route
                path="/books/new"
                element={
                  <ProtectedRoute>
                    <AddBookPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/books/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditBookPage />
                  </ProtectedRoute>
                }
              />

              {/* ==================== ADMIN ROUTES ==================== */}
              
              {/* Admin Dashboard */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* User Management - Admin Only */}
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users/new"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AddUserPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users/:id"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <UserDetailPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/users/:id/edit"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <EditUserPage />
                  </ProtectedRoute>
                }
              />

              {/* Book Management - Admin Only */}
              <Route
                path="/admin/books"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <BookManagement />
                  </ProtectedRoute>
                }
              />

              {/* ==================== MANAGER ROUTES ==================== */}
              
              {/* Manager Dashboard */}
              <Route
                path="/manager/dashboard"
                element={
                  <ProtectedRoute roles={['manager']}>
                    <ManagerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Book Management - Manager Access */}
              <Route
                path="/manager/books"
                element={
                  <ProtectedRoute roles={['manager']}>
                    <BookManagement />
                  </ProtectedRoute>
                }
              />

              {/* User View - Manager Access (Read-only) */}
              <Route
                path="/manager/users"
                element={
                  <ProtectedRoute roles={['manager']}>
                    <UserManagement />
                  </ProtectedRoute>
                }
              />

              {/* ==================== LEGACY DASHBOARD ROUTES (Backward Compatibility) ==================== */}
              
              {/* These routes redirect to new role-based URLs */}
              <Route
                path="/admin-dashboard"
                element={<Navigate to="/admin/dashboard" replace />}
              />

              <Route
                path="/manager-dashboard"
                element={<Navigate to="/manager/dashboard" replace />}
              />

              <Route
                path="/user-dashboard"
                element={<Navigate to="/user/dashboard" replace />}
              />
              
              <Route
                path="/dashboard"
                element={<Navigate to="/user/dashboard" replace />}
              />

              {/* Legacy admin/stats route */}
              <Route
                path="/admin/stats"
                element={<Navigate to="/admin/dashboard" replace />}
              />

              {/* ==================== 404 HANDLING ==================== */}
              
              {/* Catch all unknown routes - Must be last */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;