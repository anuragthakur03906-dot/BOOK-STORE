import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import Recaptcha from './Recaptcha.jsx';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import BackButton from '../common/BackButton.jsx';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6).required('Required'),
});

const Login = () => {
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    if (!captchaToken) {
      toast.error('Please verify captcha');
      return;
    }

    setLoading(true);
    try {
      const result = await login({ ...values, captchaToken });

      if (result.success) {
        toast.success(result.message);
        navigate('/');
      } else {
        toast.error(result.message || result.error);
      }
    } catch {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5002';
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base py-6 sm:py-12 px-3 sm:px-4">

      <div className="w-full max-w-md mb-6">
        <BackButton />
      </div>

      <div className="w-full max-w-md sm:max-w-lg md:max-w-md bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800">

        <div className="text-center mb-8">
          <FiLogIn className="mx-auto text-3xl text-brand mb-3" />
          <h2 className="text-xl sm:text-2xl font-bold text-text-main">Login</h2>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border rounded-xl py-3 mb-6"
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

              <AuthInput label="Email" name="email" type="email" icon={<FiMail />} placeholder="Enter email" />
              <AuthInput label="Password" name="password" type="password" icon={<FiLock />} placeholder="Enter password" />

              <div className="text-right text-xs">
                <Link to="/forgot-password" className="text-brand">
                  Forgot password?
                </Link>
              </div>

              <Recaptcha onTokenChange={setCaptchaToken} action="login" />

              <button
                type="submit"
                disabled={loading || !captchaToken}
                className="w-full btn-primary py-3 sm:py-4"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

            </Form>
          )}
        </Formik>

        <p className="text-sm text-center mt-6">
          Don’t have an account?{' '}
          <Link to="/register" className="text-brand font-semibold">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

const AuthInput = ({ label, icon, type = 'text', name, placeholder }) => {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="w-full space-y-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>

      <div className="relative flex items-center">

        {/* ICON */}
        <span className="absolute left-3 text-gray-500 dark:text-gray-400">
          {icon}
        </span>

        {/* INPUT */}
        <Field
          name={name}
          type={isPassword ? (show ? 'text' : 'password') : type}
          placeholder={placeholder}
          className="
            w-full
            h-12
            pl-10
            pr-10
            rounded-xl
            border border-gray-300 dark:border-slate-700
            bg-white dark:bg-slate-900
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none
            focus:ring-2 focus:ring-brand/40
            transition-all
          "
        />

        {/* PASSWORD TOGGLE */}
        {isPassword && (
          <span
            onClick={() => setShow(!show)}
            className="absolute right-3 text-gray-500 dark:text-gray-400 cursor-pointer"
          >
            {show ? <FiEyeOff /> : <FiEye />}
          </span>
        )}
      </div>

      <ErrorMessage
        name={name}
        component="p"
        className="text-red-500 text-xs"
      />
    </div>
  );
};

export default Login;