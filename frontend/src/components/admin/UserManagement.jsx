import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { adminAPI } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import {
  FiEdit, FiTrash2, FiEye,
  FiChevronLeft, FiChevronRight,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, statusFilter]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter !== '' && { isActive: statusFilter === 'true' })
      };
      
      const response = await adminAPI.getAllUsers(params);
      if (response.data.success) {
        setUsers(response.data.data || []);
        setStats(response.data.stats || { total: 0, active: 0, inactive: 0 });
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, statusFilter, toast]);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await adminAPI.updateUserRole(userId, { roleName: newRole });
      if (response.data.success) {
        toast.success(`Role updated to ${newRole}`);
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const response = await adminAPI.toggleUserStatus(userId, { isActive: !currentStatus });
      if (response.data.success) {
        toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-base py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-text-main tracking-tight uppercase italic">User Directory</h1>
            <p className="text-text-muted mt-2">Managing {stats.total} accounts across the platform.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-gray-100 dark:bg-gray-800 text-text-main px-4 py-2 rounded-xl text-sm font-bold outline-none border-none"
            >
              <option value="">All Roles</option>
              <option value="admin">Admins</option>
              <option value="manager">Managers</option>
              <option value="user">Users</option>
            </select>
            {user?.roleName === 'admin' && (
              <button
                onClick={() => navigate('/admin/users/new')}
                className="bg-brand text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-brand/20"
              >
                Add User
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-base/50 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl">
            <div className="text-xs font-black text-text-muted uppercase tracking-widest mb-1">Total Population</div>
            <div className="text-4xl font-black text-text-main">{stats.total}</div>
          </div>
          <div className="bg-base/50 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl">
            <div className="text-xs font-black text-green-600 uppercase tracking-widest mb-1">Active Now</div>
            <div className="text-4xl font-black text-text-main">{stats.active}</div>
          </div>
          <div className="bg-base/50 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl">
            <div className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Deactivated</div>
            <div className="text-4xl font-black text-text-main">{stats.inactive}</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-base shadow-2xl shadow-black/5 dark:shadow-none border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Identity</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Access Role</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Registration</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-text-muted uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {users.map((u) => (
                  <tr key={u._id} className="group hover:bg-base/50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-brand/10 text-brand font-black rounded-full flex items-center justify-center text-xs">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-text-main">{u.name}</div>
                          <div className="text-xs text-text-muted tracking-tight">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {user?.roleName === 'admin' && u._id !== user._id ? (
                        <select
                          value={u.roleName}
                          onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                          className="bg-transparent text-xs font-bold uppercase tracking-widest text-brand outline-none cursor-pointer"
                        >
                          <option value="admin text-black">Admin</option>
                          <option value="manager">Manager</option>
                          <option value="user">User</option>
                        </select>
                      ) : (
                        <span className="text-xs font-bold uppercase tracking-widest text-text-main">{u.roleName}</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <button
                        onClick={() => handleToggleStatus(u._id, u.isActive)}
                        disabled={u._id === user._id}
                        className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-md ${
                          u.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-red-100 text-red-700 dark:bg-red-900/30'
                        } disabled:opacity-30`}
                      >
                        {u.isActive ? 'Active' : 'Banned'}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-xs text-text-muted">{formatDate(u.createdAt)}</td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/admin/users/${u._id}`)}
                          className="p-2 text-text-muted hover:text-brand transition-colors"
                        >
                          <FiEye />
                        </button>
                        {user?.roleName === 'admin' && (
                          <>
                            <button 
                              onClick={() => navigate(`/admin/users/${u._id}/edit`)}
                              className="p-2 text-text-muted hover:text-brand transition-colors"
                            >
                              <FiEdit />
                            </button>
                            <button 
                              className="p-2 text-text-muted hover:text-red-500 transition-colors disabled:opacity-0"
                              disabled={u._id === user._id}
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-8 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-30"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg disabled:opacity-30"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;