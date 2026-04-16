import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { adminAPI } from '../services/api.js';
import { FiUser, FiMail, FiShield, FiSave, FiX, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleName: 'user',
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUserById(id);
      
      if (response.data.success) {
        const userData = response.data.data;
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          roleName: userData.roleName || 'user',
          isActive: userData.isActive !== false
        });
      } else {
        toast.error('User not found');
        navigate('/admin/users');
      }
    } catch (error) {
      toast.error('Failed to load user data');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSaving(true);
    
    try {
      const response = await adminAPI.updateUser(id, formData);
      
      if (response.data.success) {
        toast.success('User updated successfully');
        navigate(`/admin/users/${id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update user');
    } finally {
      setSaving(false);
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link
              to={`/admin/users/${id}`}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
            >
              <FiArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
              <p className="text-gray-600 mt-1">Update user information</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiUser className="inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiMail className="inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiShield className="inline mr-2" />
                  User Role
                </label>
                <select
                  name="roleName"
                  value={formData.roleName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={id === user?._id} // Can't change own role
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
                {id === user?._id && (
                  <p className="mt-1 text-sm text-gray-500">
                    You cannot change your own role
                  </p>
                )}
              </div>

              {/* Status Field */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  disabled={id === user?._id} // Can't deactivate yourself
                  className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active Account
                </label>
                {id === user?._id && (
                  <span className="ml-2 text-sm text-gray-500">
                    (Cannot deactivate your own account)
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link
                  to={`/admin/users/${id}`}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <FiX className="inline mr-2" />
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSave className="inline mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Danger Zone */}
        {user?.roleName === 'admin' && id !== user?._id && (
          <div className="card mt-8 border border-red-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">Danger Zone</h3>
              <p className="text-sm text-gray-600 mb-4">
                Deleting a user will permanently remove their account and all associated data.
                This action cannot be undone.
              </p>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this user?')) {
                    adminAPI.deleteUser(id)
                      .then(() => {
                        toast.success('User deleted successfully');
                        navigate('/admin/users');
                      })
                      .catch(error => {
                        toast.error('Failed to delete user');
                      });
                  }
                }}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete User
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditUserPage;