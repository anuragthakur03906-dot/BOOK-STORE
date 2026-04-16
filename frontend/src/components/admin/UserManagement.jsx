import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { adminAPI } from '../../services/api.js';
import {
  FiUsers, FiUserCheck, FiUserX, FiEdit, FiTrash2,
  FiFilter, FiRefreshCw, FiEye,
  FiChevronLeft, FiChevronRight, FiShield, FiMail
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Debounce timer for filters
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPage(1); // Reset to page 1 when filters change
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [roleFilter, statusFilter]);

  // Fetch on page change
  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching users...', { page, roleFilter, statusFilter });
      
      const params = {
        page,
        limit: 10,
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter !== '' && { isActive: statusFilter === 'true' })
      };

      console.log('API Params:', params);
      
      const response = await adminAPI.getAllUsers(params);
      console.log(' API Response:', response.data);

      if (response.data.success) {
        setUsers(response.data.data || []);
        setStats(response.data.stats || { total: 0, active: 0, inactive: 0 });
        
        // Handle both possible pagination structures
        const pagination = response.data.pagination;
        if (pagination) {
          setTotalPages(pagination.totalPages || pagination.totalPages || 1);
        } else {
          setTotalPages(1);
        }
        
        console.log(' Users loaded:', response.data.data?.length);
        console.log('Stats:', response.data.stats);
        console.log('Pagination:', pagination);
      } else {
        toast.error(response.data.error || 'Failed to load users');
      }
    } catch (error) {
      console.error(' Error fetching users:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.error || 'Failed to load users. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, statusFilter]);

  const handleToggleStatus = async (userId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      const response = await adminAPI.toggleUserStatus(userId, {
        isActive: !currentStatus
      });

      if (response.data.success) {
        toast.success(`User ${action}d successfully`);
        fetchUsers();
      }
    } catch (error) {
      console.error(' Toggle status error:', error);
      toast.error(error.response?.data?.error || `Failed to ${action} user`);
    }
  };

  const handleDeleteClick = (userId, userName) => {
    setSelectedUser({ id: userId, name: userName });
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      const response = await adminAPI.deleteUser(selectedUser.id);
      if (response.data.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      }
    } catch (error) {
      console.error(' Delete error:', error);
      toast.error(error.response?.data?.error || 'Failed to delete user');
    } finally {
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await adminAPI.updateUserRole(userId, { roleName: newRole });
      if (response.data.success) {
        toast.success(`User role updated to ${newRole}`);
        fetchUsers();
      }
    } catch (error) {
      console.error(' Update role error:', error);
      toast.error(error.response?.data?.error || 'Failed to update user role');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleEditUser = (userId) => {
    navigate(`/admin/users/${userId}/edit`);
  };

  const canManageUser = (targetUser) => {
    // Check if current user can manage target user
    if (!user) return false;
    
    // Admins can manage everyone except themselves for delete
    if (user.roleName === 'admin') {
      return true;
    }
    
    // Managers can only view
    if (user.roleName === 'manager') {
      return false;
    }
    
    return false;
  };

  const canDeleteUser = (targetUser) => {
    // Can't delete yourself
    if (targetUser._id === user?._id) return false;
    
    // Only admins can delete users
    if (user?.roleName !== 'admin') return false;
    
    return true;
  };

  const canEditRole = (targetUser) => {
    // Can't edit your own role
    if (targetUser._id === user?._id) return false;
    
    // Only admins can edit roles
    if (user?.roleName !== 'admin') return false;
    
    return true;
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all users in the system. {user?.roleName === 'admin' ? 'You have full admin privileges.' : 'You have view-only access.'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchUsers}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiRefreshCw className="mr-2" />
                Refresh
              </button>
              {user?.roleName === 'admin' && (
                <button
                  onClick={() => navigate('/admin/users/new')}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiUsers className="mr-2" />
                  Add User
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.total || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                <FiUserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.active || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 p-3 rounded-lg">
                <FiUserX className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Inactive Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.inactive || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Role
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setRoleFilter('');
                    setStatusFilter('');
                    setPage(1);
                  }}
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <FiUsers className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="mt-2">Try adjusting your filters or add a new user.</p>
                        {user?.roleName === 'admin' && (
                          <button
                            onClick={() => navigate('/admin/users/new')}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add New User
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((userItem) => (
                    <tr key={userItem._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-blue-600">
                              {userItem.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {userItem.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <FiMail className="h-3 w-3 mr-1" />
                              {userItem.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiShield className={`h-4 w-4 mr-2 ${
                            userItem.roleName === 'admin' ? 'text-red-500' :
                            userItem.roleName === 'manager' ? 'text-yellow-500' :
                            'text-blue-500'
                          }`} />
                          
                          {canEditRole(userItem) ? (
                            <select
                              value={userItem.roleName || 'user'}
                              onChange={(e) => handleUpdateRole(userItem._id, e.target.value)}
                              className={`text-sm font-medium px-2 py-1 rounded cursor-pointer transition-colors ${
                                userItem.roleName === 'admin' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                                userItem.roleName === 'manager' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                                'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              }`}
                            >
                              <option value="admin">Admin</option>
                              <option value="manager">Manager</option>
                              <option value="user">User</option>
                            </select>
                          ) : (
                            <span className={`text-sm font-medium px-2 py-1 rounded ${
                              userItem.roleName === 'admin' ? 'bg-red-100 text-red-800' :
                              userItem.roleName === 'manager' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {userItem.roleName || 'User'}
                            </span>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleToggleStatus(userItem._id, userItem.isActive)}
                            disabled={userItem._id === user?._id}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              userItem.isActive
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            } ${userItem._id === user?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={userItem._id === user?._id ? "Cannot change your own status" : ""}
                          >
                            {userItem.isActive ? (
                              <>
                                <FiUserCheck className="mr-1 h-3 w-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <FiUserX className="mr-1 h-3 w-3" />
                                Inactive
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(userItem.createdAt)}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userItem.lastLogin ? formatDate(userItem.lastLogin) : 'Never'}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewUser(userItem._id)}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <FiEye className="mr-2 h-4 w-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {users.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(page * 10, stats.total)}</span> of{' '}
                  <span className="font-medium">{stats.total}</span> users
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={`p-2 rounded-lg transition-colors ${
                      page === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <FiChevronLeft className="h-4 w-4" />
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3 py-1 rounded-lg transition-colors ${
                            page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && <span className="px-2">...</span>}
                  </div>
                  
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={`p-2 rounded-lg transition-colors ${
                      page === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Permissions Info */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
            Permissions Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <p className="font-medium mb-2">Admin Permissions:</p>
              <ul className="space-y-1">
                <li>• Can view all users</li>
                <li>• Can edit user information</li>
                <li>• Can change user roles</li>
                <li>• Can activate/deactivate users</li>
                <li>• Can delete users (except themselves)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Manager Permissions:</p>
              <ul className="space-y-1">
                <li>• Can view all users</li>
                <li>• Read-only access</li>
                <li>• Cannot edit user information</li>
                <li>• Cannot change roles or status</li>
                <li>• Cannot delete users</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <FiAlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete user <span className="font-semibold">"{selectedUser.name}"</span>?
              </p>
              <p className="text-sm text-red-600 mt-2">
                 This will permanently delete the user account and all associated data.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;