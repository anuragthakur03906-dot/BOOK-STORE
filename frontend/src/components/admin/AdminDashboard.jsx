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
                <h1 className="text-3xl md:text-4xl font-bold text-text-main leading-tight">Administrator Dashboard</h1>
                <p className="text-text-muted mt-2 font-medium">Welcome, {user?.name}. Last Updated: {new Date().toLocaleTimeString()}</p>
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

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           <StatCard icon={<FiUsers />} label="Total Users" value={stats.totalUsers} subText={`${stats.activeUsers} active accounts`} color="brand" />
           <StatCard icon={<FiBook />} label="Total Books" value={stats.totalBooks} subText={`${stats.booksAddedToday} added today`} color="green" />
           <StatCard icon={<FiDollarSign />} label="Inventory Value" value={`$${stats.totalValue.toFixed(2)}`} subText={`Avg: $${(stats.totalBooks > 0 ? (stats.totalValue / stats.totalBooks) : 0).toFixed(2)}`} color="yellow" />
           <StatCard icon={<FiActivity />} label="Active Rate" value={`${activePercentage}%`} subText="Percentage of active users" color="purple" />
        </div>

        {/* Global Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
             <QuickLink to="/admin/users" icon={<FiUsers />} title="Manage Users" desc="Control user accounts and roles" />
             <QuickLink to="/admin/books" icon={<FiLayers />} title="Inventory" desc="Manage the book catalog" />
             <QuickLink to="/books/new" icon={<FiPlus />} title="Add Book" desc="Add a new book to the catalog" />
             <QuickLink to="/favorites" icon={<FiActivity />} title="Activity" desc="Monitor system transactions" />
        </div>

        {/* Detailed Logs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* Section Users */}
           <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="font-bold text-text-main text-lg tracking-tight">RECENT USERS</h3>
                  <Link to="/admin/users" className="text-sm font-bold text-brand hover:underline underline-offset-2">View All</Link>
              </div>
              <div className="p-8 space-y-4">
                 {recentUsers.length > 0 ? recentUsers.map(u => (
                   <div key={u._id} className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-slate-800/30 rounded-xl hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-brand/10 text-brand rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">{u.name?.charAt(0)}</div>
                         <div>
                            <div className="text-sm font-bold text-text-main">{u.name}</div>
                            <div className="text-xs text-text-muted font-bold uppercase tracking-wide">{u.roleName}</div>
                         </div>
                      </div>
                      <div className="text-sm font-bold text-text-muted">{new Date(u.createdAt).toLocaleDateString()}</div>
                   </div>
                 )) : <p className="text-center text-text-muted italic py-10">No recent registrants recorded.</p>}
              </div>
           </div>

           {/* Section Books */}
           <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
                 <h3 className="font-bold text-text-main text-lg tracking-tight">LATEST CATALOG ENTRIES</h3>
                 <Link to="/admin/books" className="text-sm font-bold text-brand hover:underline underline-offset-2">Full Inventory</Link>
              </div>
              <div className="p-8 space-y-4">
                 {recentBooks.length > 0 ? recentBooks.map(b => (
                   <div key={b._id} className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-slate-800/30 rounded-xl hover:bg-gray-100/50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                         <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm"><FiBook /></div>
                         <div className="truncate">
                            <div className="text-sm font-bold text-text-main truncate">{b.title}</div>
                            <div className="text-xs text-text-muted font-medium">by {b.author}</div>
                         </div>
                      </div>
                      <div className="text-sm font-bold text-brand whitespace-nowrap ml-2">${b.price?.toFixed(2)}</div>
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
   <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 rounded-[2rem] shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className={`absolute top-0 right-0 w-24 h-24 -translate-y-1/2 translate-x-1/2 rounded-full opacity-10 ${
        color === 'brand' ? 'bg-brand' : color === 'green' ? 'bg-green-500' : color === 'yellow' ? 'bg-yellow-500' : 'bg-purple-500'
      }`}></div>
      <div className={`inline-flex p-3 rounded-xl mb-6 text-lg ${
        color === 'brand' ? 'bg-brand/10 text-brand' : color === 'green' ? 'bg-green-500/10 text-green-600' : color === 'yellow' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-purple-500/10 text-purple-600'
      }`}>
        {icon}
      </div>
      <div className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2">{label}</div>
      <div className="text-4xl font-bold text-text-main mb-3 tracking-tight">{value}</div>
      <div className="text-sm font-medium text-text-muted leading-relaxed">{subText}</div>
   </div>
);

const QuickLink = ({ to, icon, title, desc }) => (
   <Link to={to} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-brand/50 transition-all duratoin-300 group flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-gray-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center text-3xl text-text-muted group-hover:bg-brand/10 group-hover:text-brand transition-colors mb-6 shadow-inner">
         {icon}
      </div>
      <h3 className="font-bold text-text-main mb-2 text-lg group-hover:text-brand transition-colors">{title}</h3>
      <p className="text-sm text-text-muted font-medium leading-relaxed">{desc}</p>
   </Link>
);

export default AdminDashboard;