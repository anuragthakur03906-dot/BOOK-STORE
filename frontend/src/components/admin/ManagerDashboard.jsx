import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { adminAPI, bookAPI } from '../../services/api.js';
import { 
  FiBook, FiUsers, FiDollarSign, FiTrendingUp,
  FiEdit, FiTrash2, FiEye, FiPlus, FiUser,
  FiRefreshCw, FiFilter // using FiRefreshCw icon
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalValue: 0,
    booksAddedToday: 0,
    activeUsers: 0
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

 const fetchDashboardData = async () => {
  try {
    setLoading(true);
    
    //  Get ACTUAL system stats
    const statsRes = await adminAPI.getSystemStats();
    
    //  Get ACTUAL users
    const usersRes = await adminAPI.getAllUsers({ page: 1, limit: 5 });
    
    //  Get ACTUAL books
    const booksRes = await adminAPI.getAllBooks({ page: 1, limit: 10 });
    
    if (statsRes.data.success) {
      const data = statsRes.data.data;
      setStats({
        totalBooks: data.books.total || 0,
        totalValue: data.books.totalValue || 0,
        booksAddedToday: data.books.booksAddedToday || 0,
        activeUsers: data.users.active || 0
      });
    }

    if (usersRes.data.success) {
      setRecentUsers(usersRes.data.data || []);
    }

    if (booksRes.data.success) {
      setRecentBooks(booksRes.data.data || []);
    }
  } catch (error) {
    toast.error('Failed to load dashboard data');
  } finally {
    setLoading(false);
  }
};
  const handleDeleteBook = async (bookId, bookTitle) => {
    if (!window.confirm(`Are you sure you want to delete book "${bookTitle}"?`)) {
      return;
    }

    try {
      const response = await adminAPI.deleteBook(bookId);
      if (response.data.success) {
        toast.success('Book deleted successfully');
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete book');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Manager Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {user?.name}! Manage books and view reports.
              </p>
            </div>
            <button
              onClick={fetchDashboardData}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiRefreshCw className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                <FiBook className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalBooks}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                <FiDollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${stats.totalValue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-100 p-3 rounded-lg">
                <FiTrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Added Today</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.booksAddedToday}
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-lg">
                <FiUsers className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.activeUsers}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/books/new"
              className="card p-4 text-center hover:shadow-md transition-shadow"
            >
              <FiPlus className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <span className="font-medium">Add New Book</span>
            </Link>

            <Link
              to="/admin/books"
              className="card p-4 text-center hover:shadow-md transition-shadow"
            >
              <FiBook className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <span className="font-medium">Manage Books</span>
            </Link>

            <Link
              to="/admin/users"
              className="card p-4 text-center hover:shadow-md transition-shadow"
            >
              <FiUsers className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <span className="font-medium">View Users</span>
            </Link>
          </div>
        </div>

        {/* Recent Users (Read-Only for Manager) */}
        <div className="mb-8 card">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Users (View Only)</h3>
              <Link
                to="/admin/users"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View All →
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {recentUsers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No users found</p>
            ) : (
              <div className="space-y-4">
                {recentUsers.map((userItem) => (
                  <div key={userItem._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FiUser className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{userItem.name}</p>
                        <p className="text-sm text-gray-500">{userItem.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        userItem.roleName === 'admin' ? 'bg-red-100 text-red-800' :
                        userItem.roleName === 'manager' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {userItem.roleName}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        userItem.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {userItem.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 text-sm text-gray-500">
              <FiFilter className="inline-block mr-1" />
              Managers can only view users. Editing requires admin privileges.
            </div>
          </div>
        </div>

        {/* Recent Books with Actions */}
        <div className="card">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Books</h3>
              <div className="flex space-x-3">
                <Link
                  to="/admin/books"
                  className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Manage All
                </Link>
                <Link
                  to="/books/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <FiPlus className="mr-2" />
                  Add Book
                </Link>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {recentBooks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No books found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Added By</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentBooks.map((book) => (
                      <tr key={book._id}>
                        <td className="px-4 py-3 font-medium">{book.title}</td>
                        <td className="px-4 py-3">{book.author}</td>
                        <td className="px-4 py-3 font-semibold">${book.price}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <FiUser className="h-4 w-4 text-gray-600" />
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium">{book.addedBy?.name || 'Unknown'}</div>
                              <div className="text-xs text-gray-500">{book.addedBy?.roleName || 'User'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <Link
                              to={`/books/${book._id}`}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="View"
                            >
                              <FiEye className="h-5 w-5" />
                            </Link>
                            <Link
                              to={`/books/${book._id}/edit`}
                              className="p-1 text-green-600 hover:text-green-800"
                              title="Edit"
                            >
                              <FiEdit className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteBook(book._id, book.title)}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-6 text-center">
              <Link
                to="/admin/books"
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiBook className="mr-2" />
                View All Books
              </Link>
            </div>
          </div>
        </div>

        {/* Manager Permissions Info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Manager Permissions:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li> Can view all users (read-only)</li>
            <li> Can manage all books (create, edit, delete)</li>
            <li> Cannot edit user information</li>
            <li> Cannot change user roles</li>
            <li> Cannot activate/deactivate users</li>
            <li> Cannot delete users</li>
            <li> Can view system reports</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;