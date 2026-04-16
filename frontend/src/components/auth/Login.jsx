import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import Recaptcha from './Recaptcha.jsx';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getDefaultDashboard = (userRole) => {
    if (userRole === 'admin') return '/admin/dashboard';
    if (userRole === 'manager') return '/manager/dashboard';
    return '/user/dashboard';
  };

  const from = location.state?.from?.pathname || getDefaultDashboard(user?.roleName);

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${backendUrl}/auth/google`;
  };

  const handleSubmit = async (values) => {
    if (!captchaToken) {
      toast.error('Please complete captcha verification');
      return;
    }

    setLoading(true);

    try {
      const result = await login({
        ...values,
        captchaToken
      });

      if (result.success) {
        toast.success('Login successful!');
        // Redirect to role-based dashboard after getting user data
        const userRole = result.user?.roleName || 'user';
        const dashboardPath = getDefaultDashboard(userRole);
        navigate(dashboardPath || from, { replace: true });
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (err) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-md w-full bg-base p-8 rounded-2xl shadow-xl">

        <div className="text-center mb-6">
          <FiLogIn className="mx-auto h-10 w-10 text-brand" />
          <h2 className="text-2xl font-bold mt-2">Welcome Back</h2>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex justify-center items-center gap-2 border rounded-xl py-3 mb-6"
        >
          <FcGoogle /> Continue with Google
        </button>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    name="email"
                    type="email"
                    className="input-field pl-10 w-full"
                    placeholder="you@example.com"
                  />
                </div>
                <ErrorMessage name="email" component="p" className="text-xs text-red-500 mt-1" />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    name="password"
                    type="password"
                    className="input-field pl-10 w-full"
                    placeholder="********"
                  />
                </div>
                <ErrorMessage name="password" component="p" className="text-xs text-red-500 mt-1" />
                <Link to="/forgot-password" className="text-xs text-brand hover:text-blue-700 font-medium mt-2 inline-block">
                  Forgot Password?
                </Link>
              </div>

              {/* Captcha */}
              <div className="mt-4">
                <Recaptcha onTokenChange={setCaptchaToken} action="login" />
              </div>

              <button
                type="submit"
                disabled={loading || !captchaToken}
                className="w-full bg-brand text-white py-3 rounded-xl disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

            </Form>
          )}
        </Formik>

        <p className="text-sm text-center mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-brand">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
