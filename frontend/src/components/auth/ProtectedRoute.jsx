import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

/**
 * ProtectedRoute - Route component for authentication and role-based access control
 * 
 * Usage:
 * <ProtectedRoute>
 *   <UserPage />
 * </ProtectedRoute>
 * 
 * With role restriction:
 * <ProtectedRoute roles={['admin', 'manager']}>
 *   <AdminPage />
 * </ProtectedRoute>
 * 
 * Props:
 * - children: Component to render if access is allowed
 * - roles: Array of allowed roles (optional, defaults to empty array = all authenticated users)
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if roles are specified
  if (roles.length > 0) {
    const hasRequiredRole = roles.includes(user?.roleName);
    
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen bg-base flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-text-main mb-4">Access Denied</h2>
            <p className="text-text-muted mb-4">
              You need <span className="font-semibold">{roles.join(' or ')}</span> role to access this page.
            </p>
            <p className="text-sm text-gray-500">
              Your current role: <span className="font-semibold capitalize">{user?.roleName || 'unknown'}</span>
            </p>
            <a 
              href="/" 
              className="inline-block mt-6 px-6 py-2 bg-brand text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Home
            </a>
          </div>
        </div>
      );
    }
  }

  // Render protected component if all checks pass
  return children;
};

export default ProtectedRoute;
