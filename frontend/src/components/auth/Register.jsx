import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiMail, FiLock, FiUser, FiUserPlus, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Recaptcha from './Recaptcha.jsx';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

//  UPDATED VALIDATION SCHEMA WITH ROLE
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),

  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'Must contain one uppercase letter')
    .matches(/[a-z]/, 'Must contain one lowercase letter')
    .matches(/\d/, 'Must contain one number')
    .required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),

  //  ADD ROLE VALIDATION
  role: Yup.string()
    .oneOf(['user', 'manager', 'admin'], 'Invalid role selected')
    .default('user')
});

const Register = () => {
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    if (!captchaToken) {
      toast.error('Please complete captcha');
      return;
    }

    setLoading(true);

    try {
      //  SEND ROLE TO BACKEND
      const result = await register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,  //  Add role here
        captchaToken
      });

      if (result.success) {
        toast.success('Registration successful!');
        navigate('/login');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">

        <div className="text-center mb-6">
          <FiUserPlus className="mx-auto h-10 w-10 text-blue-600" />
          <h2 className="text-2xl font-bold mt-2">Create Account</h2>
        </div>

        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'user'  //  Default role
          }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange }) => (
            <Form className="space-y-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    name="name"
                    type="text"
                    className="input-field pl-10 w-full"
                    placeholder="Enter your full name"
                  />
                </div>
                <ErrorMessage name="name" component="p" className="text-xs text-red-500 mt-1" />
              </div>

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
                    placeholder="••••••••"
                  />
                </div>
                <ErrorMessage name="password" component="p" className="text-xs text-red-500 mt-1" />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 text-gray-400" />
                  <Field
                    name="confirmPassword"
                    type="password"
                    className="input-field pl-10 w-full"
                    placeholder="••••••••"
                  />
                </div>
                <ErrorMessage name="confirmPassword" component="p" className="text-xs text-red-500 mt-1" />
              </div>

              {/* Captcha */}
              <Recaptcha onTokenChange={setCaptchaToken} action="register" />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !captchaToken}
                className="w-full bg-blue-600 text-white py-3 rounded-xl disabled:opacity-50 hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Google Signup Option (Optional) */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">Or sign up with</p>
                <button
                  type="button"
                  onClick={() => window.location.href = '/api/auth/google'}
                  className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>

            </Form>
          )}
        </Formik>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign In
            </Link>
          </p>
          <p className="text-xs text-center text-gray-500 mt-2">
            Need help? <Link to="/contact" className="text-blue-500">Contact support</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;