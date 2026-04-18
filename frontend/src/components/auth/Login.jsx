import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import Recaptcha from './Recaptcha.jsx';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import BackButton from '../common/BackButton.jsx';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002';
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  const handleSubmit = async (values) => {
    if (!captchaToken) {
      toast.error('Please verify your security check');
      return;
    }
    setLoading(true);
    try {
      const result = await login({ ...values, captchaToken });
      if (result.success) {
        toast.success('Welcome back!');
        navigate('/', { replace: true });
      } else {
        toast.error(result.error || 'Authentication denied');
      }
    } catch (err) {
      toast.error('Authentication failure. Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base px-4 transition-colors duration-200">
      <div className="w-full max-w-md mb-8">
        <BackButton />
      </div>

      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 text-brand rounded-2xl mb-4">
            <FiLogIn className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-text-main">Welcome Back</h2>
          <p className="text-sm text-text-muted mt-2 font-medium">Please sign in to your library account.</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex justify-center items-center gap-3 border-2 border-gray-100 dark:border-slate-800 rounded-xl py-3.5 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-bold text-sm text-text-main mb-8"
        >
          <FcGoogle className="text-xl" /> Sign in with Google
        </button>

        <div className="relative mb-8">
           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100 dark:border-slate-800"></div></div>
           <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-4 text-text-muted font-black tracking-widest">Or Continue With Email</span></div>
        </div>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-6">
              <AuthInput label="Email Address" name="email" type="email" icon={<FiMail />} placeholder="you@example.com" />
              
              <div className="space-y-1">
                <AuthInput label="Password" name="password" type="password" icon={<FiLock />} placeholder="••••••••" />
                <div className="flex justify-end p-1">
                  <Link to="/forgot-password" title="Recover account" className="text-xs font-bold text-brand hover:underline underline-offset-4">Reset Password?</Link>
                </div>
              </div>

              <div className="py-2">
                <Recaptcha onTokenChange={setCaptchaToken} action="login" />
              </div>

              <button
                type="submit"
                disabled={loading || !captchaToken}
                className="w-full btn-primary py-4 rounded-xl shadow-lg shadow-brand/20 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign Into Account'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-slate-800 text-center">
          <p className="text-sm text-text-muted font-medium">
            New here?{' '}
            <Link to="/register" className="text-brand hover:underline underline-offset-4 decoration-2">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const AuthInput = ({ label, icon, ...props }) => {
  const inputId = `input-${props.name}-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors">
          {icon}
        </div>
        <Field
          id={inputId}
          {...props}
          className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-brand/20 focus:bg-white dark:focus:bg-slate-800 rounded-xl outline-none text-text-main font-medium transition-all placeholder:text-text-muted/30"
        />
      </div>
      <ErrorMessage name={props.name} component="p" className="text-xs font-bold text-red-500 mt-1 ml-1" />
    </div>
  );
};

export default Login;
