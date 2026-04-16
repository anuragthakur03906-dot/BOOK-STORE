import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { adminAPI } from '../services/api.js';
import { 
  FiUser, FiMail, FiCalendar, FiShield, 
  FiBook, FiDollarSign, FiActivity, FiEdit,
  FiArrowLeft, FiTrash2, FiCheck, FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userBooks, setUserBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      
      //  Get user details
      const userRes = await adminAPI.getUserById(id);
      
      if (userRes.data.success) {
        setUserData(userRes.data.data);
        
        //  Get user's books
        const booksRes = await adminAPI.getAllBooks({ addedBy: id, limit: 10 });
        if (booksRes.data.success) {
          setUserBooks(booksRes.data.data || []);
        }
      } else {
        toast.error('User not found');
        navigate('/admin/users');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user details');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm(`Are you sure you want to delete user "${userData.name}"? This will also delete all their books.`)) {
      return;
    }

    try {
      const response = await adminAPI.deleteUser(id);
      if (response.data.success) {
        toast.success('User deleted successfully');
        navigate('/admin/users');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleToggleStatus = async () => {
    const action = userData.isActive ? 'deactivate' : 'activate';
    
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      const response = await adminAPI.toggleUserStatus(id, { 
        isActive: !userData.isActive 
      });
      
      if (response.data.success) {
        toast.success(`User ${action}d successfully`);
        fetchUserDetails();
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update user status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-main mb-4">User Not Found</h2>
          <Link to="/admin/users" className="text-brand hover:text-blue-800">
            ← Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/users"
                className="p-2 text-text-muted hover:text-text-main hover:bg-gray-100 rounded-lg"
              >
                <FiArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-text-main">
                  User Details
                </h1>
                <p className="text-text-muted mt-1">
                  View and manage user information
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Link
                to={`/admin/users/${id}/edit`}
                className="inline-flex items-center px-4 py-2 bg-brand text-white rounded-lg hover:bg-blue-700"
              >
                <FiEdit className="mr-2" />
                Edit User
              </Link>
              
              {user?.roleName === 'admin' && userData._id !== user?._id && (
                <button
                  onClick={handleDeleteUser}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <FiTrash2 className="mr-2" />
                  Delete User
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - User Info */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="p-6">
                {/* User Avatar */}
                <div className="text-center mb-6">
                  <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-bold text-brand">
                      {userData.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-text-main">{userData.name}</h2>
                  <p className="text-text-muted">{userData.email}</p>
                </div>

                {/* User Stats */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-base rounded-lg">
                    <div className="flex items-center">
                      <FiShield className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-text-muted">Role</p>
                        <p className="font-medium">{userData.roleName}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      userData.roleName === 'admin' ? 'bg-red-100 text-red-800' :
                      userData.roleName === 'manager' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {userData.roleName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-base rounded-lg">
                    <div className="flex items-center">
                      <FiActivity className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-text-muted">Status</p>
                        <p className="font-medium">
                          {userData.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleToggleStatus}
                      disabled={userData._id === user?._id}
                      className={`px-3 py-1 text-sm rounded-full flex items-center ${
                        userData.isActive
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      } ${userData._id === user?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {userData.isActive ? (
                        <>
                          <FiCheck className="mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <FiX className="mr-1" />
                          Inactive
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 bg-base rounded-lg">
                    <div className="flex items-center mb-2">
                      <FiCalendar className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-text-muted">Joined</p>
                        <p className="font-medium">
                          {formatDate(userData.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    {userData.lastLogin && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-text-muted">Last Login</p>
                        <p className="font-medium">
                          {formatDate(userData.lastLogin)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200 dark:border-gray-800">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-brand'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('books')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'books'
                      ? 'border-blue-500 text-brand'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Books ({userBooks.length})
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'activity'
                      ? 'border-blue-500 text-brand'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Activity
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="card">
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-text-main mb-4">User Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-base rounded-lg">
                          <p className="text-sm text-text-muted">Email</p>
                          <p className="font-medium">{userData.email}</p>
                        </div>
                        <div className="p-4 bg-base rounded-lg">
                          <p className="text-sm text-text-muted">Role</p>
                          <p className="font-medium">{userData.roleName}</p>
                        </div>
                        <div className="p-4 bg-base rounded-lg">
                          <p className="text-sm text-text-muted">Status</p>
                          <p className={`font-medium ${
                            userData.isActive ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {userData.isActive ? 'Active' : 'Inactive'}
                          </p>
                        </div>
                        <div className="p-4 bg-base rounded-lg">
                          <p className="text-sm text-text-muted">User ID</p>
                          <p className="font-medium text-sm truncate">{userData._id}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-text-main mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                          to={`/admin/users/${id}/edit`}
                          className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 text-center"
                        >
                          <FiEdit className="h-6 w-6 text-brand mx-auto mb-2" />
                          <span className="font-medium text-blue-800">Edit Profile</span>
                        </Link>
                        
                        <button
                          onClick={handleToggleStatus}
                          disabled={userData._id === user?._id}
                          className={`p-4 rounded-lg text-center ${
                            userData.isActive
                              ? 'bg-red-50 border border-red-200 hover:bg-red-100'
                              : 'bg-green-50 border border-green-200 hover:bg-green-100'
                          } ${userData._id === user?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {userData.isActive ? (
                            <>
                              <FiX className="h-6 w-6 text-red-600 mx-auto mb-2" />
                              <span className="font-medium text-red-800">Deactivate User</span>
                            </>
                          ) : (
                            <>
                              <FiCheck className="h-6 w-6 text-green-600 mx-auto mb-2" />
                              <span className="font-medium text-green-800">Activate User</span>
                            </>
                          )}
                        </button>
                        
                        {user?.roleName === 'admin' && userData._id !== user?._id && (
                          <button
                            onClick={handleDeleteUser}
                            className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 text-center"
                          >
                            <FiTrash2 className="h-6 w-6 text-red-600 mx-auto mb-2" />
                            <span className="font-medium text-red-800">Delete User</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'books' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-text-main">Books Added by User</h3>
                      <span className="text-sm text-text-muted">
                        Total: {userBooks.length} books
                      </span>
                    </div>
                    
                    {userBooks.length === 0 ? (
                      <div className="text-center py-12">
                        <FiBook className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-text-muted">No books added by this user</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userBooks.map((book) => (
                          <div key={book._id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-base">
                            <div className="flex-1">
                              <h4 className="font-medium text-text-main">{book.title}</h4>
                              <p className="text-sm text-text-muted">by {book.author}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm text-brand font-medium">
                                  ${book.price}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {book.genre}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Added: {new Date(book.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Link
                              to={`/books/${book._id}`}
                              className="ml-4 text-brand hover:text-blue-800"
                            >
                              View →
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div>
                    <h3 className="text-lg font-semibold text-text-main mb-6">User Activity</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-base rounded-lg">
                        <p className="font-medium">Account Created</p>
                        <p className="text-sm text-text-muted">
                          {formatDate(userData.createdAt)}
                        </p>
                      </div>
                      
                      {userData.lastLogin && (
                        <div className="p-4 bg-base rounded-lg">
                          <p className="font-medium">Last Login</p>
                          <p className="text-sm text-text-muted">
                            {formatDate(userData.lastLogin)}
                          </p>
                        </div>
                      )}
                      
                      <div className="p-4 bg-base rounded-lg">
                        <p className="font-medium">Books Added</p>
                        <p className="text-2xl font-bold text-brand">
                          {userBooks.length}
                        </p>
                        <p className="text-sm text-text-muted">
                          Total value: ${userBooks.reduce((sum, book) => sum + (parseFloat(book.price) || 0), 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
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

export default UserDetailPage;