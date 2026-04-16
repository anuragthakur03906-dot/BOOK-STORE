import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
        <div className="min-h-screen bg-base text-text-main flex flex-col transition-colors duration-200">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
              <Route path="/auth/success" element={<GoogleAuthCallback />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:id" element={<BookDetailsPage />} />

              {/* PROTECTED USER ROUTES */}
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
              <Route path="/user/dashboard" element={<ProtectedRoute roles={['user']}><UserDashboard /></ProtectedRoute>} />

              {/* BOOK MANAGEMENT ROUTES */}
              <Route path="/books/new" element={<ProtectedRoute><AddBookPage /></ProtectedRoute>} />
              <Route path="/books/:id/edit" element={<ProtectedRoute><EditBookPage /></ProtectedRoute>} />

              {/* ADMIN ROUTES */}
              <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><UserManagement /></ProtectedRoute>} />
              <Route path="/admin/users/new" element={<ProtectedRoute roles={['admin']}><AddUserPage /></ProtectedRoute>} />
              <Route path="/admin/users/:id" element={<ProtectedRoute roles={['admin']}><UserDetailPage /></ProtectedRoute>} />
              <Route path="/admin/users/:id/edit" element={<ProtectedRoute roles={['admin']}><EditUserPage /></ProtectedRoute>} />
              <Route path="/admin/books" element={<ProtectedRoute roles={['admin']}><BookManagement /></ProtectedRoute>} />

              {/* MANAGER ROUTES */}
              <Route path="/manager/dashboard" element={<ProtectedRoute roles={['manager']}><ManagerDashboard /></ProtectedRoute>} />
              <Route path="/manager/books" element={<ProtectedRoute roles={['manager']}><BookManagement /></ProtectedRoute>} />
              <Route path="/manager/users" element={<ProtectedRoute roles={['manager']}><UserManagement /></ProtectedRoute>} />

              {/* REDIRECTS */}
              <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/manager-dashboard" element={<Navigate to="/manager/dashboard" replace />} />
              <Route path="/user-dashboard" element={<Navigate to="/user/dashboard" replace />} />
              <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />
              <Route path="/admin/stats" element={<Navigate to="/admin/dashboard" replace />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;