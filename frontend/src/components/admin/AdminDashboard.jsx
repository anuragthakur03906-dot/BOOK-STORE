// AdminDashboard.jsx
// Component displaying overall statistics and recent activity for admin users
// Pulls data from the backend and provides controls for refreshing/deleting
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { adminAPI } from '../../services/api.js';
import { 
  FiUsers, FiBook, FiDollarSign, 
  FiUserCheck, FiUserX, FiEdit, FiTrash2,
  FiPlus, FiBarChart2, FiShield, FiTrendingUp,
  FiRefreshCw, FiCalendar, FiActivity, FiDatabase,
  FiArrowUp, FiArrowDown, FiPercent
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // current logged‑in user info (name/role may be used in UI)
  const { user } = useAuth();
  // dashboard statistics state object
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalValue: 0,
    booksAddedToday: 0,
    admins: 0,
    managers: 0,
    regularUsers: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // fetch all required dashboard data from API and populate state
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin dashboard data...');
      
      const response = await adminAPI.getSystemStats();
      console.log(' API Response:', response);
      
      if (response.data.success) {
        const data = response.data.data;
        console.log(' API Data Received:', data);
        
        // update state with values returned from server
        setStats({
          totalUsers: data.users?.total || 0,
          totalBooks: data.books?.total || 0,
          activeUsers: data.users?.active || 0,
          inactiveUsers: data.users?.inactive || 0,
          totalValue: data.books?.totalValue || 0,
          booksAddedToday: data.books?.booksAddedToday || 0,
          admins: data.users?.admins || 0,
          managers: data.users?.managers || 0,
          regularUsers: data.users?.regular || 0
        });
        
        setRecentUsers(data.users?.recent || []);
        setRecentBooks(data.books?.recent || []);
        setLastUpdated(new Date().toLocaleTimeString());
        
        console.log('Dashboard data updated successfully');
        console.log('Total Users:', data.users?.total);
        console.log('Total Books:', data.books?.total);
        
      } else {
        console.error(' API Error:', response.data.error);
        toast.error('Failed to load dashboard data');
      }
    } catch (error) {
      console.error(' Dashboard fetch error:', error);
      toast.error('Connection error. Please check backend server.');
    } finally {
      setLoading(false);
    }
  };

  // deletes a user after asking for confirmation
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Delete user "${userName}"?`)) return;
    
    try {
      const response = await adminAPI.deleteUser(userId);
      if (response.data.success) {
        toast.success('User deleted');
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Delete failed');
    }
  };

  // deletes a book record after confirmation
  const handleDeleteBook = async (bookId, bookTitle) => {
    if (!window.confirm(`Delete book "${bookTitle}"?`)) return;
    
    try {
      const response = await adminAPI.deleteBook(bookId);
      if (response.data.success) {
        toast.success('Book deleted');
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Delete failed');
    }
  };

  // toggles activation status of a user (active <-> inactive)
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await adminAPI.toggleUserStatus(userId, { 
        isActive: !currentStatus 
      });
      
      if (response.data.success) {
        toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Update failed');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading dashboard data from MongoDB...</p>
        <p className="text-sm text-gray-500 mt-2">Fetching real-time statistics</p>
      </div>
    );
  }

  // compute derived percentage values for display
  const activePercentage = stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Live Data Indicator */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                 Admin Dashboard
                </h1>
              </div>
              <p className="text-gray-600">
                Welcome back, <span className="font-semibold">{user?.name}</span>! 
                <span className="ml-3 text-sm text-gray-500">
                  <FiActivity className="inline mr-1" />
                  Updated: {lastUpdated}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchDashboardData}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiRefreshCw className="mr-2" />
                Refresh
              </button>
             
            </div>
          </div>
        </div>

        {/* Stats Grid with Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users card showing counts and icons */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalUsers}
                </p>
                <div className="flex items-center mt-2">
                  <FiUserCheck className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-gray-600">
                    {stats.activeUsers} active • {activePercentage}%
                  </span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FiUsers className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Admins: {stats.admins}</span>
                <span>Managers: {stats.managers}</span>
                <span>Users: {stats.regularUsers}</span>
              </div>
            </div>
          </div>

          {/* Total Books Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalBooks}
                </p>
                <div className="flex items-center mt-2">
                  <FiTrendingUp className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-sm text-gray-600">
                    {stats.booksAddedToday} added today
                  </span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FiBook className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link to="/admin/books" className="text-sm text-blue-600 hover:text-blue-800">
                View all books →
              </Link>
            </div>
          </div>

          {/* Total Value Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${stats.totalValue.toFixed(2)}
                </p>
                <div className="flex items-center mt-2">
                  <FiDollarSign className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-gray-600">
                    Average: ${(stats.totalBooks > 0 ? (stats.totalValue / stats.totalBooks) : 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FiDollarSign className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/users"
              className="group bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-all hover:scale-[1.02] border border-gray-100"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Manage Users</h3>
              <p className="text-sm text-gray-500">View all users and manage roles</p>
            </Link>

            <Link
              to="/admin/books"
              className="group bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-all hover:scale-[1.02] border border-gray-100"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                <FiBook className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Manage Books</h3>
              <p className="text-sm text-gray-500">View and manage all books</p>
            </Link>

            <Link
              to="/books/new"
              className="group bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-all hover:scale-[1.02] border border-gray-100"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-200 transition-colors">
                <FiPlus className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Add Book</h3>
              <p className="text-sm text-gray-500">Add a new book to collection</p>
            </Link>

          </div>
        </div>

        {/* Recent Users & Books */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
              <Link
                to="/admin/users"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                View All <FiArrowUp className="ml-1 rotate-90" />
              </Link>
            </div>
            <div className="p-6">
              {recentUsers.length === 0 ? (
                <div className="text-center py-8">
                  <FiUsers className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent users</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentUsers.map((userItem) => (
                    <div key={userItem._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-blue-600">
                            {userItem.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900">{userItem.name}</p>
                          <p className="text-sm text-gray-500">{userItem.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 text-xs rounded-full ${
                          userItem.roleName === 'admin' ? 'bg-red-100 text-red-800' :
                          userItem.roleName === 'manager' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {userItem.roleName}
                        </span>
                        
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleToggleUserStatus(userItem._id, userItem.isActive)}
                            disabled={userItem._id === user?._id}
                            className={`p-1.5 rounded-full ${
                              userItem.isActive 
                                ? 'text-green-600 hover:text-green-800 hover:bg-green-50' 
                                : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                            } ${userItem._id === user?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={userItem.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {userItem.isActive ? <FiUserCheck /> : <FiUserX />}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteUser(userItem._id, userItem.name)}
                            disabled={userItem._id === user?._id}
                            className={`p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full ${
                              userItem._id === user?._id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title={userItem._id === user?._id ? "Cannot delete yourself" : "Delete"}
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Books */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Books</h3>
              <Link
                to="/admin/books"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                View All <FiArrowUp className="ml-1 rotate-90" />
              </Link>
            </div>
            <div className="p-6">
              {recentBooks.length === 0 ? (
                <div className="text-center py-8">
                  <FiBook className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent books</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBooks.map((book) => (
                    <div key={book._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FiBook className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="ml-4 min-w-0">
                            <Link to={`/books/${book._id}`} className="hover:text-blue-600">
                              <h4 className="font-medium text-gray-900 truncate">{book.title}</h4>
                            </Link>
                            <p className="text-sm text-gray-500 truncate">by {book.author}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 ml-4">
                        <div className="text-right">
                          <p className="font-semibold text-blue-600">${book.price}</p>
                          <p className="text-xs text-gray-500">{book.genre}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Link
                            to={`/books/${book._id}/edit`}
                            className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full"
                            title="Edit"
                          >
                            <FiEdit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteBook(book._id, book.title)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full"
                            title="Delete"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;