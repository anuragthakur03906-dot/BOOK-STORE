import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { userAPI } from '../../services/api.js';
import { 
  FiBook, FiDollarSign, FiStar, FiUser, FiPlus, 
  FiTrendingUp, FiHeart, FiCalendar
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    favorites: [],
    stats: {
      totalBooks: 0,
      totalPrice: 0,
      avgRating: 0,
      favoriteGenre: ''
    },
    myBooks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

 const fetchDashboardData = async () => {
  try {
    const response = await userAPI.getDashboardData();
    
    if (response.data.success) {
      const apiData = response.data.data || {};
      
      //  Ensure proper number formatting
      const stats = apiData.stats || {};
      
      setDashboardData({
        profile: apiData.profile || null,
        favorites: apiData.favorites || [],
        stats: {
          totalBooks: Number(stats.totalBooks) || 0,
          totalPrice: Number(stats.totalPrice) || 0,
          avgRating: Number(stats.avgRating) || 0,
          favoriteGenre: stats.favoriteGenre || 'N/A'
        },
        myBooks: (apiData.myBooks || []).map(book => ({
          ...book,
          price: Number(book.price) || 0,
          rating: Number(book.rating) || 0
        }))
      });
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error);
    toast.error('Failed to load dashboard data');
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return parseFloat(value || 0).toFixed(2);
  };

  const formatRating = (value) => {
    return parseFloat(value || 0).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-base py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-main">
            User Dashboard
          </h1>
          <p className="text-text-muted mt-2">
            Welcome back, {dashboardData.profile?.name || user?.name || 'User'}!
            Here's your reading journey.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiBook className="h-8 w-8 text-brand" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Your Books</p>
                <p className="text-2xl font-semibold text-text-main">
                  {dashboardData.stats.totalBooks || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiDollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Total Value</p>
                <p className="text-2xl font-semibold text-text-main">
                  ${formatCurrency(dashboardData.stats.totalPrice)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiStar className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Avg Rating</p>
                <p className="text-2xl font-semibold text-text-main">
                  {formatRating(dashboardData.stats.avgRating)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiTrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-muted">Favorite Genre</p>
                <p className="text-2xl font-semibold text-text-main">
                  {dashboardData.stats.favoriteGenre || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-text-main">Your Books</h2>
                  <Link
                    to="/books/new"
                    className="inline-flex items-center px-4 py-2 bg-brand text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiPlus className="mr-2 h-4 w-4" />
                    Add Book
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                {dashboardData.myBooks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-text-muted">You haven't added any books yet.</p>
                    <Link
                      to="/books/new"
                      className="inline-block mt-4 px-6 py-2 bg-brand text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Your First Book
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.myBooks.slice(0, 5).map((book) => (
                      <div key={book._id} className="flex items-center justify-between p-4 hover:bg-base rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold text-text-main">{book.title || 'Unknown Book'}</h3>
                          <p className="text-sm text-text-muted mt-1">by {book.author || 'Unknown Author'}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-brand font-semibold">
                            ${formatCurrency(book.price)}
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <FiStar className="h-3 w-3 text-yellow-500" />
                            <span className="text-sm text-text-muted">
                              {formatRating(book.rating)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {dashboardData.myBooks.length > 5 && (
                  <div className="mt-6 text-center">
                    <Link
                      to="/books"
                      className="text-brand hover:text-blue-800 font-medium"
                    >
                      View all books →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-text-main">Your Profile</h2>
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUser className="h-8 w-8 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-main">
                      {dashboardData.profile?.name || user?.name || 'User'}
                    </h3>
                    <p className="text-text-muted">
                      {dashboardData.profile?.email || user?.email || 'No email'}
                    </p>
                    <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {dashboardData.profile?.role || user?.role || 'user'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-text-muted">Member Since</p>
                    <p className="font-medium">
                      {dashboardData.profile?.createdAt 
                        ? new Date(dashboardData.profile.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <Link
                      to="/profile"
                      className="inline-block w-full text-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Favorites Card */}
            <div className="card">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-text-main">Favorites</h2>
                  <FiHeart className="h-5 w-5 text-red-500" />
                </div>
              </div>
              
              <div className="p-6">
                {dashboardData.favorites.length === 0 ? (
                  <p className="text-text-muted text-center py-4">No favorite books yet</p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.favorites.slice(0, 3).map((book) => (
                      <div key={book._id} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-100 rounded flex items-center justify-center">
                          <FiBook className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-text-main truncate">
                            {book.title || 'Unknown Book'}
                          </p>
                          <p className="text-xs text-gray-500">
                            by {book.author || 'Unknown Author'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {dashboardData.favorites.length > 3 && (
                  <div className="mt-4 text-center">
                    <Link
                      to="/favorites"
                      className="text-brand hover:text-blue-800 text-sm font-medium"
                    >
                      View all favorites →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;