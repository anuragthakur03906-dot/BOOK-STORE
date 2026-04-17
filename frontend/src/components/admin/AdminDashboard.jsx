import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { adminAPI } from '../../services/api.js';
import { 
  FiUsers, FiBook, FiDollarSign, 
  FiUserCheck, FiUserX, FiEdit, FiTrash2,
  FiPlus, FiTrendingUp,
  FiRefreshCw, FiActivity, FiLayers
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import BackButton from '../common/BackButton.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    activeUsers: 0,
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

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSystemStats();
      if (response.data.success) {
        const data = response.data.data;
        setStats({
          totalUsers: data.users?.total || 0,
          totalBooks: data.books?.total || 0,
          activeUsers: data.users?.active || 0,
          totalValue: data.books?.totalValue || 0,
          booksAddedToday: data.books?.booksAddedToday || 0,
          admins: data.users?.admins || 0,
          managers: data.users?.managers || 0,
          regularUsers: data.users?.regular || 0
        });
        setRecentUsers(data.users?.recent || []);
        setRecentBooks(data.books?.recent || []);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (error) {
      toast.error('System data offline');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !lastUpdated) return <LoadingSpinner fullScreen />;

  const activePercentage = stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-base py-12 transition-colors duration-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="flex flex-col gap-4">
              <BackButton />
              <div>
                <h1 className="text-3xl font-bold text-text-main">Administrator Dashboard</h1>
                <p className="text-text-muted mt-1 font-medium italic">Welcome, {user?.name}. System snapshot as of {lastUpdated}.</p>
              </div>
           </div>
           <button
             onClick={fetchDashboardData}
             className="px-6 py-2.5 bg-brand text-white font-bold rounded-xl shadow-lg shadow-brand/20 hover:opacity-90 transition-all flex items-center gap-2"
           >
             <FiRefreshCw className={loading ? 'animate-spin' : ''} />
             Sync Data
           </button>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           <StatCard icon={<FiUsers />} label="Total Members" value={stats.totalUsers} subText={`${stats.activeUsers} active accounts`} color="brand" />
           <StatCard icon={<FiBook />} label="Global Titles" value={stats.totalBooks} subText={`${stats.booksAddedToday} new records today`} color="green" />
           <StatCard icon={<FiDollarSign />} label="Inventory Value" value={`$${stats.totalValue.toFixed(2)}`} subText={`Avg: $${(stats.totalBooks > 0 ? (stats.totalValue / stats.totalBooks) : 0).toFixed(2)}`} color="yellow" />
           <StatCard icon={<FiActivity />} label="Engagement" value={`${activePercentage}%`} subText="Real-time activity rate" color="purple" />
        </div>

        {/* Global Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <QuickLink to="/admin/users" icon={<FiUsers />} title="Manage Users" desc="Control user accounts and roles" />
            <QuickLink to="/admin/books" icon={<FiLayers />} title="Inventory Control" desc="Catalog and stock logistics" />
            <QuickLink to="/books/new" icon={<FiPlus />} title="Add New Title" desc="Insert fresh book metadata" />
            <QuickLink to="/favorites" icon={<FiActivity />} title="System Activity" desc="Monitor global transactions" />
        </div>

        {/* Detailed Logs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* Section Users */}
           <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
                 <h3 className="font-bold text-text-main text-lg uppercase tracking-tight">Recent Onboardings</h3>
                 <Link to="/admin/users" className="text-xs font-bold text-brand hover:underline">View Directory</Link>
              </div>
              <div className="p-8 space-y-4">
                 {recentUsers.length > 0 ? recentUsers.map(u => (
                   <div key={u._id} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-800/30 rounded-2xl">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-brand/10 text-brand rounded-xl flex items-center justify-center font-bold text-xs">{u.name?.charAt(0)}</div>
                         <div>
                            <div className="text-sm font-bold text-text-main">{u.name}</div>
                            <div className="text-[10px] text-text-muted font-bold uppercase">{u.roleName}</div>
                         </div>
                      </div>
                      <div className="text-sm font-bold text-brand">{new Date(u.createdAt).toLocaleDateString()}</div>
                   </div>
                 )) : <p className="text-center text-text-muted italic py-10">No recent registrants recorded.</p>}
              </div>
           </div>

           {/* Section Books */}
           <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
                 <h3 className="font-bold text-text-main text-lg uppercase tracking-tight">Latest Catalog Entries</h3>
                 <Link to="/admin/books" className="text-xs font-bold text-brand hover:underline">Full Inventory</Link>
              </div>
              <div className="p-8 space-y-4">
                 {recentBooks.length > 0 ? recentBooks.map(b => (
                   <div key={b._id} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-slate-800/30 rounded-2xl">
                      <div className="flex items-center gap-4 min-w-0">
                         <div className="w-10 h-10 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center font-bold text-lg"><FiBook /></div>
                         <div className="truncate">
                            <div className="text-sm font-bold text-text-main truncate">{b.title}</div>
                            <div className="text-[10px] text-text-muted font-medium">by {b.author}</div>
                         </div>
                      </div>
                      <div className="text-sm font-bold text-brand whitespace-nowrap">${b.price?.toFixed(2)}</div>
                   </div>
                 )) : <p className="text-center text-text-muted italic py-10">No recent titles added.</p>}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subText, color }) => (
   <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 -translate-y-1/2 translate-x-1/2 rounded-full opacity-10 ${
        color === 'brand' ? 'bg-brand' : color === 'green' ? 'bg-green-500' : color === 'yellow' ? 'bg-yellow-500' : 'bg-purple-500'
      }`}></div>
      <div className={`inline-flex p-3 rounded-xl mb-6 text-xl ${
        color === 'brand' ? 'bg-brand/10 text-brand' : color === 'green' ? 'bg-green-500/10 text-green-600' : color === 'yellow' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-purple-500/10 text-purple-600'
      }`}>
        {icon}
      </div>
      <div className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">{label}</div>
      <div className="text-3xl font-bold text-text-main mb-2 tracking-tight">{value}</div>
      <div className="text-xs font-medium text-text-muted">{subText}</div>
   </div>
);

const QuickLink = ({ to, icon, title, desc }) => (
   <Link to={to} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:border-brand/40 transition-all group flex flex-col items-center text-center">
      <div className="w-14 h-14 bg-gray-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center text-2xl text-text-muted group-hover:bg-brand/10 group-hover:text-brand transition-colors mb-6 shadow-inner">
         {icon}
      </div>
      <h3 className="font-bold text-text-main mb-2">{title}</h3>
      <p className="text-xs text-text-muted font-medium leading-relaxed">{desc}</p>
   </Link>
);

export default AdminDashboard;