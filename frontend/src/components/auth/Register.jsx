import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiMail, FiLock, FiUser, FiUserPlus, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Recaptcha from './Recaptcha.jsx';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import BackButton from '../common/BackButton.jsx';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(3, 'Name must be at least 3 characters').required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
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
      const result = await register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: 'user',
        captchaToken,
      });

      if (result.success) {
        toast.success(result.message);
        navigate('/login');
      } else {
        toast.error(result.message || result.error);
      }
    } catch {
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base py-6 sm:py-12 px-3 sm:px-4">
      <div className="w-full max-w-md mb-6">
        <BackButton />
      </div>

      <div className="w-full max-w-md sm:max-w-lg md:max-w-md bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 text-brand rounded-2xl mb-4">
            <FiUserPlus className="h-8 w-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-main">Create Your Account</h2>
        </div>

        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-5">

              <AuthInput label="Full Name" name="name" icon={<FiUser />} placeholder="Enter full name" />
              <AuthInput label="Email" name="email" type="email" icon={<FiMail />} placeholder="Enter email" />
              <AuthInput label="Password" name="password" type="password" icon={<FiLock />} placeholder="Enter password" />
              <AuthInput label="Confirm Password" name="confirmPassword" type="password" icon={<FiLock />} placeholder="Confirm password" />

              <Recaptcha onTokenChange={setCaptchaToken} action="register" />

              <button
                type="submit"
                disabled={loading || !captchaToken}
                className="w-full btn-primary py-3 sm:py-4 text-sm sm:text-base"
              >
                {loading ? 'Processing...' : 'Register'}
              </button>

            </Form>
          )}
        </Formik>

        <p className="text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand font-semibold">
            Login
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

export default Register;