import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiMail, FiLock, FiUser, FiUserPlus, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Recaptcha from './Recaptcha.jsx';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import BackButton from '../common/BackButton.jsx';

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Full name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
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
      toast.error('Please complete security verification');
      return;
    }
    setLoading(true);
    try {
      const result = await register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: 'user',
        captchaToken
      });

      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/login');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base py-12 px-4 shadow-inner transition-colors duration-200">
      <div className="w-full max-w-md mb-8">
        <BackButton />
      </div>

      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand/10 text-brand rounded-2xl mb-4">
            <FiUserPlus className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-text-main">Create Your Account</h2>
          <p className="text-sm text-text-muted mt-2 font-medium">Join our reading community today.</p>
        </div>

        <Formik
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={RegisterSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-6">
              <AuthInput label="Full Name" name="name" icon={<FiUser />} placeholder="John Doe" />
              <AuthInput label="Email Address" type="email" name="email" icon={<FiMail />} placeholder="john@example.com" />
              <AuthInput label="Password" type="password" name="password" icon={<FiLock />} placeholder="••••••••" />
              <AuthInput label="Verify Password" type="password" name="confirmPassword" icon={<FiLock />} placeholder="••••••••" />

              <div className="py-2">
                <Recaptcha onTokenChange={setCaptchaToken} action="register" />
              </div>

              <button
                type="submit"
                disabled={loading || !captchaToken}
                className="w-full btn-primary py-4 rounded-xl shadow-lg shadow-brand/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Processing...' : 'Register Account'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-slate-800 text-center">
          <p className="text-sm text-text-muted font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-brand hover:underline underline-offset-4 decoration-2">
              Sign In
            </Link>
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

export default Register;