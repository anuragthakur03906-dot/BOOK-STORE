import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardPath = () => {
    if (!user?.roleName) return '/user/dashboard';
    if (user.roleName === 'admin') return '/admin/dashboard';
    if (user.roleName === 'manager') return '/manager/dashboard';
    return '/user/dashboard';
  };

  return (
    <div className="bg-base transition-colors duration-200">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-7xl font-extrabold text-text-main mb-8 tracking-tight">
              Welcome to <span className="text-brand">BookStore</span>
            </h1>
            <p className="text-xl text-text-muted mb-10 max-w-3xl mx-auto leading-relaxed">
              Discover, explore, and manage your book collection with our powerful platform. 
              Featuring high-performance search, advanced filtering, and a modern UI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-white bg-brand hover:opacity-90 transition-all shadow-lg shadow-brand/20"
                  >
                    Go to Dashboard
                  </Link>
                  <Link
                    to="/books"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-brand text-base font-bold rounded-xl text-brand bg-transparent hover:bg-brand/5 transition-all"
                  >
                    Browse Collection
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-white bg-brand hover:opacity-90 transition-all shadow-lg shadow-brand/20"
                  >
                    Get Started Now
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-brand text-base font-bold rounded-xl text-brand bg-transparent hover:bg-brand/5 transition-all"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-base/50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-text-main mb-4">Powerful Features</h2>
            <div className="h-1.5 w-20 bg-brand mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="group">
              <h3 className="text-xl font-bold text-text-main mb-3 group-hover:text-brand transition-colors">Authentication</h3>
              <p className="text-text-muted leading-relaxed">Secure login and registration with role-based access control for Admins, Managers, and Users.</p>
            </div>
            
            <div className="group">
              <h3 className="text-xl font-bold text-text-main mb-3 group-hover:text-brand transition-colors">Smart Search</h3>
              <p className="text-text-muted leading-relaxed">Instantly find books by title, author, or description using our high-performance search engine.</p>
            </div>
            
            <div className="group">
              <h3 className="text-xl font-bold text-text-main mb-3 group-hover:text-brand transition-colors">Advanced Filters</h3>
              <p className="text-text-muted leading-relaxed">Filter your collection by genre, price range, and ratings to find exactly what you're looking for.</p>
            </div>
            
            <div className="group">
              <h3 className="text-xl font-bold text-text-main mb-3 group-hover:text-brand transition-colors">Management</h3>
              <p className="text-text-muted leading-relaxed">Full CRUD operations for books and users, including pagination and data export capabilities.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="py-24 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-text-main mb-12">Powered by Modern Technology</h2>
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <span className="text-2xl font-black text-text-main tracking-tighter">MONGODB</span>
            <span className="text-2xl font-black text-text-main tracking-tighter">EXPRESS</span>
            <span className="text-2xl font-black text-text-main tracking-tighter">REACT</span>
            <span className="text-2xl font-black text-text-main tracking-tighter">NODEJS</span>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-brand mb-10 mx-4 sm:mx-8 rounded-3xl overflow-hidden shadow-2xl shadow-brand/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Grow Your Library?</h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto font-medium">
            Join our community today and start organizing your reading journey like never before.
          </p>
          {isAuthenticated ? (
            <Link
              to="/books"
              className="inline-flex items-center justify-center px-10 py-4 bg-base text-brand font-bold rounded-xl hover:bg-base transition-all shadow-xl"
            >
              Explore Books
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-10 py-4 bg-base text-brand font-bold rounded-xl hover:bg-base transition-all shadow-xl"
            >
              Create Account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;