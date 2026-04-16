import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-brand mb-2">404</h1>
          <h2 className="text-3xl font-bold text-text-main mb-4">Page Not Found</h2>
          <p className="text-text-muted text-lg">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Image/Icon */}
        <div className="mb-8">
          <div className="text-6xl">📖</div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-brand text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
          >
            <FiHome className="mr-2" />
            Go to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors w-full"
          >
            <FiArrowLeft className="mr-2" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-text-muted mb-4">Quick Links:</p>
          <div className="space-y-2 text-sm">
            <Link to="/" className="text-brand hover:text-blue-800">Home</Link>
            <br />
            <Link to="/books" className="text-brand hover:text-blue-800">Browse Books</Link>
            <br />
            <Link to="/login" className="text-brand hover:text-blue-800">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
