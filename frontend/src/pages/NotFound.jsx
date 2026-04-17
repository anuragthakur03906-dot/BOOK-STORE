import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiBook } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">

        <div className="mb-8">
          <h1 className="text-9xl font-bold text-brand mb-2">404</h1>
          <h2 className="text-3xl font-bold text-text-main mb-4">Page Not Found</h2>
          <p className="text-text-muted text-lg">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
            <FiBook className="h-10 w-10" />
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-brand text-white rounded-xl hover:opacity-90 transition-all font-bold w-full"
          >
            <FiHome className="mr-2" />
            Go to Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-200 dark:border-slate-700 text-text-main rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-bold w-full"
          >
            <FiArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-slate-800">
          <p className="text-sm text-text-muted mb-4 font-medium">Quick Links</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link to="/" className="text-brand hover:underline underline-offset-4 font-bold">Home</Link>
            <Link to="/books" className="text-brand hover:underline underline-offset-4 font-bold">Browse Books</Link>
            <Link to="/login" className="text-brand hover:underline underline-offset-4 font-bold">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

