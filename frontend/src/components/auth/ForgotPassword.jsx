import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api.js'; 
import { useAuth } from '../../context/AuthContext.jsx';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!email || !email.includes('@')) {
    toast.error('Please enter a valid email');
    return;
  }
  
  setLoading(true);
  try {
    console.log('� Submitting email:', email);
    
    // 📝 detailed logging inside try/catch
    await forgotPassword(email);
    setSubmitted(true);
    toast.success('Reset email sent! Check your inbox.');
    
  } catch (error) {
    console.error('� HandleSubmit error:', error);
    
    // Display the real error message
    toast.error(error.message || 'Failed to send reset email');
    
    // Check localStorage for debug info
    console.log('localStorage token:', localStorage.getItem('token'));
    console.log('localStorage user:', localStorage.getItem('user'));
    
  } finally {
    setLoading(false);
  }
};  return (
    <div className="min-h-screen flex items-center justify-center bg-base py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FiMail className="h-8 w-8 text-brand" />
          </div>
          <h2 className="text-3xl font-extrabold text-text-main">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <div className="bg-base py-8 px-4 shadow rounded-lg sm:px-10">
          {submitted ? (
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FiMail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-text-main mb-2">
                Check Your Email
              </h3>
              <p className="text-text-muted mb-6">
                We've sent a password reset link to <strong>{email}</strong>. 
                Please check your inbox and follow the instructions.
              </p>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="w-full inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-blue-700"
                >
                  <FiArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
                <p className="text-sm text-gray-500">
                  Didn't receive the email?{' '}
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-brand hover:text-blue-500 font-medium"
                  >
                    Try again
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-sm text-brand hover:text-blue-500"
                >
                  <FiArrowLeft className="mr-1 h-4 w-4" />
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-brand hover:text-blue-500">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;