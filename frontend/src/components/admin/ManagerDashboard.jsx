import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { adminAPI, bookAPI } from '../../services/api.js';
import { 
  FiBook, FiUsers, FiDollarSign, FiTrendingUp,
  FiEdit, FiTrash2, FiEye, FiPlus, FiUser,
  FiRefreshCw, FiFilter, FiShield, FiInfo
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import BackButton from '../common/BackButton.jsx';
import ConfirmModal from '../common/ConfirmModal.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalValue: 0,
    booksAddedToday: 0,
    activeUsers: 0
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [modal, setModal] = useState({ isOpen: false, bookId: null, title: '' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, booksRes] = await Promise.all([
        adminAPI.getSystemStats(),
        adminAPI.getAllUsers({ page: 1, limit: 5 }),
        adminAPI.getAllBooks({ page: 1, limit: 5 })
      ]);
      
      if (statsRes.data.success) {
        const d = statsRes.data.data;
        setStats({
          totalBooks: d.books.total || 0,
          totalValue: d.books.totalValue || 0,
          booksAddedToday: d.books.booksAddedToday || 0,
          activeUsers: d.users.active || 0
        });
      }
      if (usersRes.data.success) setRecentUsers(usersRes.data.data || []);
      if (booksRes.data.success) setRecentBooks(booksRes.data.data || []);
      
    } catch (error) {
      toast.error('Sync failed. Checking connectivity.');
    } finally {
      setLoading(false);
    }
  };

  const executeDeleteBook = async () => {
    try {
      const response = await adminAPI.deleteBook(modal.bookId);
      if (response.data.success) {
        toast.success(`'${modal.title}' removed from catalogue`);
        fetchDashboardData();
      }
    } catch (error) {
      toast.error('Access verification failed');
    } finally {
      setModal({ isOpen: false, bookId: null, title: '' });
    }
  };

  if (loading && stats.totalBooks === 0) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-base py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="flex flex-col gap-6">
              <BackButton />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-text-main leading-tight">Management Dashboard</h1>
                <p className="text-text-muted mt-2 font-medium">Content and logistics oversight for Manager {user?.name}.</p>
              </div>
           </div>
           <button
             onClick={fetchDashboardData}
             className="hidden sm:flex px-6 py-2.5 bg-brand text-white font-bold rounded-xl shadow-lg shadow-brand/20 hover:bg-brand/90 transition-all items-center gap-2"
           >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
        </div>

        {/* Intelligence Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <InfoCard icon={<FiBook />} label="Catalog Size" value={stats.totalBooks} color="brand" />
            <InfoCard icon={<FiDollarSign />} label="Inventory Worth" value={`$${stats.totalValue.toFixed(2)}`} color="green" />
            <InfoCard icon={<FiTrendingUp />} label="Today's Intake" value={stats.booksAddedToday} color="purple" />
            <InfoCard icon={<FiUsers />} label="Active Members" value={stats.activeUsers} color="yellow" />
        </div>

        {/* Global Quick Utility */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <UtilityLink to="/books/new" icon={<FiPlus />} title="Add Book" color="green" />
            <UtilityLink to="/admin/books" icon={<FiBook />} title="Manage Inventory" color="brand" />
            <UtilityLink to="/admin/users" icon={<FiUsers />} title="View Users" color="purple" />
        </div>

        {/* Primary Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Section: Catalogue Records */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
                 <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-text-main text-lg tracking-tight">RECENT BOOKS</h3>
                    <Link to="/admin/books" className="text-sm font-bold text-brand hover:underline underline-offset-2">Full Inventory</Link>
                 </div>
                 <div className="p-8">
                    <div className="overflow-x-auto">
                       <table className="w-full">
                          <thead>
                             <tr className="border-b border-gray-50 dark:border-slate-800 text-[11px] font-bold text-text-muted uppercase tracking-widest text-left">
                                <th className="px-4 py-4">Title</th>
                                <th className="px-4 py-4">Price</th>
                                <th className="px-4 py-4 text-right">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                             {recentBooks.map(b => (
                               <tr key={b._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/10 transition-colors">
                                  <td className="px-4 py-5 flex items-center gap-3">
                                     <div className="w-10 h-10 bg-gray-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-sm text-text-muted font-bold"><FiBook /></div>
                                     <div className="truncate max-w-[150px] md:max-w-xs">
                                        <div className="text-sm font-bold text-text-main truncate">{b.title}</div>
                                        <div className="text-xs text-text-muted font-medium">{b.author}</div>
                                     </div>
                                  </td>
                                  <td className="px-4 py-5 text-sm font-bold text-brand">${b.price?.toFixed(2)}</td>
                                  <td className="px-4 py-5 text-right">
                                     <div className="flex justify-end gap-2">
                                        <button onClick={() => navigate(`/books/${b._id}`)} className="p-2 text-text-muted hover:text-brand transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"><FiEye className="text-lg" /></button>
                                        <button onClick={() => navigate(`/books/${b._id}/edit`)} className="p-2 text-text-muted hover:text-brand transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"><FiEdit className="text-lg" /></button>
                                        <button onClick={() => setModal({ isOpen: true, bookId: b._id, title: b.title })} className="p-2 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"><FiTrash2 className="text-lg" /></button>
                                     </div>
                                  </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
              </div>
           </div>

           {/* Section: Member Insights */}
           <div className="space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
                 <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-text-main text-sm uppercase tracking-wider">Active Members</h3>
                    <FiShield className="text-brand opacity-50 text-lg" />
                 </div>
                 <div className="p-8 space-y-5">
                    {recentUsers.map(u => (
                      <div key={u._id} className="flex items-center gap-4 py-3 border-b border-gray-50 dark:border-slate-800/50 last:border-0">
                         <div className="w-12 h-12 bg-brand/10 text-brand rounded-lg flex items-center justify-center font-bold text-sm shadow-sm"><FiUser /></div>
                         <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-text-main truncate">{u.name}</div>
                            <div className="flex gap-3 mt-2">
                               <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${u.isActive ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'}`}>
                                  {u.isActive ? 'Active' : 'Suspended'}
                               </span>
                               <span className="text-xs font-bold text-text-muted uppercase italic">{u.roleName}</span>
                            </div>
                         </div>
                      </div>
                    ))}
                    <Link to="/admin/users" className="block text-center pt-4 text-sm font-bold text-brand hover:underline underline-offset-2">Enter Member Directory</Link>
                 </div>
              </div>

              {/* Management Clearance Info */}
              <div className="p-8 bg-blue-50/30 dark:bg-blue-950/20 rounded-[2rem] border border-blue-50 dark:border-blue-900/30">
                 <div className="flex items-start gap-4 text-blue-800 dark:text-blue-300">
                    <FiInfo className="mt-1 flex-shrink-0" />
                    <div>
                       <h4 className="font-bold text-sm mb-2 uppercase tracking-tight">Manager Access Note</h4>
                       <p className="text-xs font-medium leading-relaxed opacity-80">As a Content Manager, you have full permissions to manage book records but cannot modify user accounts. Contact an Administrator for user management changes.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, bookId: null, title: '' })}
        onConfirm={executeDeleteBook}
        title="Delete Book"
        message={`Are you certain about deleting '${modal.title}' from the system? Content Managers must ensure all logistics are cleared before purging records.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

const InfoCard = ({ icon, label, value, color }) => (
  <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-lg shadow-inner ${
       color === 'brand' ? 'bg-brand/10 text-brand' : color === 'green' ? 'bg-green-500/10 text-green-600' : color === 'yellow' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-purple-500/10 text-purple-600'
    }`}>
       {icon}
    </div>
    <div className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2">{label}</div>
    <div className="text-4xl font-bold text-text-main tracking-tight">{value}</div>
  </div>
);

const UtilityLink = ({ to, icon, title, color }) => (
  <Link to={to} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-brand/50 transition-all flex items-center gap-4 group">
     <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-colors transition-transform group-hover:scale-110 ${
       color === 'brand' ? 'bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white' : 
       color === 'green' ? 'bg-green-500/10 text-green-600 group-hover:bg-green-500 group-hover:text-white' : 
       'bg-purple-500/10 text-purple-600 group-hover:bg-purple-500 group-hover:text-white'
     }`}>
        {icon}
     </div>
     <div className="font-bold text-text-main text-lg group-hover:text-brand transition-colors">{title}</div>
  </Link>
);

export default ManagerDashboard;