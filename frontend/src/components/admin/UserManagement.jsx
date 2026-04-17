import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { adminAPI } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import {
  FiEdit, FiTrash2, FiEye, FiUserCheck, FiUserX,
  FiChevronLeft, FiChevronRight, FiFilter
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import BackButton from '../common/BackButton.jsx';
import ConfirmModal from '../common/ConfirmModal.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

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
  
  // Confirmation state
  const [confirmState, setConfirmState] = useState({ isOpen: false, type: '', userId: null, data: null });

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
      toast.error('Failed to load user directory');
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, statusFilter, toast]);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await adminAPI.updateUserRole(userId, { roleName: newRole });
      if (response.data.success) {
        toast.success(`Access level changed to ${newRole}`);
        fetchUsers();
      }
    } catch (error) {
      toast.error('Role update permission denied');
    }
  };

  const executeToggleStatus = async () => {
    const { userId, data: currentStatus } = confirmState;
    try {
      const response = await adminAPI.toggleUserStatus(userId, { isActive: !currentStatus });
      if (response.data.success) {
        toast.success(`Member status updated successfully`);
        fetchUsers();
      }
    } catch (error) {
      toast.error('Unable to change status at this time');
    } finally {
      setConfirmState({ isOpen: false, type: '', userId: null, data: null });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading && page === 1) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-base py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 space-y-6">
          <BackButton />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-3xl font-bold text-text-main">User Management</h1>
              <p className="text-text-muted mt-1 font-medium italic">Directory of {stats.total} accounts participating in the platform.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                 <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                 <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-white dark:bg-slate-900 text-text-main pl-9 pr-4 py-2.5 rounded-xl text-sm font-bold border border-gray-100 dark:border-slate-800 outline-none w-full"
                >
                  <option value="">All Access Roles</option>
                  <option value="admin">Administrators</option>
                  <option value="manager">Content Managers</option>
                  <option value="user">Site Users</option>
                </select>
              </div>
              {user?.roleName === 'admin' && (
                <button
                  onClick={() => navigate('/admin/users/new')}
                  className="btn-primary px-6 py-2.5 shadow-brand/10 whitespace-nowrap"
                >
                  New Member
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <SummaryCard label="Total Population" value={stats.total} color="brand" />
           <SummaryCard label="Active Participants" value={stats.active} color="green" />
           <SummaryCard label="Restricted Accounts" value={stats.inactive} color="red" />
        </div>

        {/* Directory Table */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-800/20 border-b border-gray-50 dark:border-slate-800">
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Full Identity</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Access Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-text-muted uppercase tracking-widest">Registration</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-text-muted uppercase tracking-widest">Options</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/30 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-brand/10 text-brand font-bold rounded-xl flex items-center justify-center text-sm shadow-inner">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-text-main leading-none mb-1">{u.name}</div>
                          <div className="text-xs text-text-muted font-medium">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm">
                      {user?.roleName === 'admin' && u._id !== user._id ? (
                        <select
                          value={u.roleName}
                          onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                          className="bg-transparent font-bold text-brand outline-none cursor-pointer hover:bg-brand/5 px-2 py-1 rounded-lg"
                        >
                          <option value="admin">Administrator</option>
                          <option value="manager">Manager</option>
                          <option value="user">Standard User</option>
                        </select>
                      ) : (
                        <span className="font-bold text-text-main px-2 capitalize">{u.roleName}</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => setConfirmState({ isOpen: true, type: 'toggleStatus', userId: u._id, data: u.isActive })}
                        disabled={u._id === user._id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          u.isActive ? 'bg-green-50 text-green-700 dark:bg-green-950/30' : 'bg-red-50 text-red-700 dark:bg-red-950/30'
                        } disabled:opacity-30`}
                      >
                         {u.isActive ? <FiUserCheck /> : <FiUserX />}
                         {u.isActive ? 'Access Active' : 'Access Restricted'}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-xs text-text-muted font-medium">{formatDate(u.createdAt)}</td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1">
                        <button 
                          onClick={() => navigate(`/admin/users/${u._id}`)}
                          className="p-2 text-text-muted hover:text-brand hover:bg-brand/5 rounded-lg transition-colors"
                          title="View"
                        >
                          <FiEye />
                        </button>
                        {user?.roleName === 'admin' && (
                          <>
                            <button 
                              onClick={() => navigate(`/admin/users/${u._id}/edit`)}
                              className="p-2 text-text-muted hover:text-brand hover:bg-brand/5 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit />
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
          
          {/* Pagination Footer */}
          <div className="px-8 py-6 bg-gray-50/30 dark:bg-slate-800/10 border-t border-gray-50 dark:border-slate-800 flex justify-between items-center">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Page {page} / {totalPages}</span>
            <div className="flex gap-3">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl disabled:opacity-30 shadow-sm hover:border-brand/30 transition-all font-bold"
              >
                <FiChevronLeft />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl disabled:opacity-30 shadow-sm hover:border-brand/30 transition-all font-bold"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, type: '', userId: null, data: null })}
        onConfirm={executeToggleStatus}
        title="Change Access Status"
        message={`Are you sure you want to ${confirmState.data ? 'deactivate' : 'activate'} this user account? Their ability to log in will be ${confirmState.data ? 'suspended' : 'restored'}.`}
        confirmText="Confirm Status Change"
        cancelText="Cancel"
      />
    </div>
  );
};

const SummaryCard = ({ label, value, color }) => (
   <div className={`bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm border-l-4 ${
     color === 'brand' ? 'border-brand' : color === 'green' ? 'border-green-500' : 'border-red-500'
   }`}>
      <div className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">{label}</div>
      <div className="text-3xl font-bold text-text-main">{value}</div>
   </div>
);

export default UserManagement;