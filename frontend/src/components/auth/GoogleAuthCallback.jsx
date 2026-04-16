import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { authAPI } from '../../services/api.js';
import toast from 'react-hot-toast';

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const getDefaultDashboard = (userRole) => {
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'manager') return '/manager/dashboard';
    return '/user/dashboard';
  };

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const userId = searchParams.get('userId');
        const email = searchParams.get('email');
        const error = searchParams.get('error');

        console.log(' Google Callback Params:', {
          accessToken: accessToken ? `${accessToken.substring(0, 20)}...` : 'Missing',
          refreshToken: refreshToken ? `${refreshToken.substring(0, 20)}...` : 'Missing',
          userId,
          email,
          error
        });

        if (error) {
          toast.error(`Google login failed: ${error}`);
          navigate('/login');
          return;
        }

        if (!accessToken || !refreshToken) {
          toast.error('No authentication tokens received');
          navigate('/login');
          return;
        }

        //  Save tokens to localStorage
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        //  Create user object
        const userData = {
          _id: userId,
          email: email,
          name: email?.split('@')[0] || 'Google User'
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('Tokens saved to localStorage');
        console.log('User data:', userData);

        // Update auth context - redirect to role-based dashboard
        // Note: Role info will be available in AuthContext after token is validated
        toast.success('Google login successful!');
        
        // Redirect to user dashboard by default, will update if different role
        const dashboardPath = user?.roleName ? getDefaultDashboard(user.roleName) : '/user/dashboard';
        navigate(dashboardPath, { replace: true });

      } catch (error) {
        console.error('Google callback error:', error);
        toast.error('Failed to complete Google login');
        navigate('/login', { replace: true });
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
        <h2 className="mt-6 text-2xl font-bold text-gray-900">Completing Google Login</h2>
        <p className="mt-2 text-gray-600">Please wait while we authenticate you...</p>
        <p className="mt-1 text-sm text-gray-500">This will only take a moment</p>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;