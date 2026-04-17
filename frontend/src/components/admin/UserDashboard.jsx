import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { userAPI } from '../../services/api.js';
import { 
  FiBook, FiDollarSign, FiStar, FiUser, FiPlus, 
  FiTrendingUp, FiHeart, FiClock, FiLayers
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import BackButton from '../common/BackButton.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const UserDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    profile: null,
    favorites: [],
    stats: { totalBooks: 0, totalPrice: 0, avgRating: 0, favoriteGenre: 'Reading' },
    myBooks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getDashboardData();
      if (res.data.success) {
        const d = res.data.data;
        setData({
          profile: d.profile || null,
          favorites: d.favorites || [],
          stats: {
            totalBooks: Number(d.stats?.totalBooks) || 0,
            totalPrice: Number(d.stats?.totalPrice) || 0,
            avgRating: Number(d.stats?.avgRating) || 0,
            favoriteGenre: d.stats?.favoriteGenre || 'Reading'
          },
          myBooks: d.myBooks || []
        });
      }
    } catch (err) {
      toast.error('Dashboard synchronization failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data.profile) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-base py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col gap-6">
           <BackButton />
           <div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-main leading-tight">Member Dashboard</h1>
              <p className="text-text-muted mt-2 font-medium">Welcome, {data.profile?.name || user?.name}. Explore your library stats and records.</p>
           </div>
        </div>

        {/* Dynamic Analytics Deck */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           <StatMetric icon={<FiBook />} label="Catalogued Books" value={data.stats.totalBooks} color="brand" />
           <StatMetric icon={<FiDollarSign />} label="Investment Value" value={`$${data.stats.totalPrice.toFixed(2)}`} color="green" />
           <StatMetric icon={<FiStar />} label="Average Rating" value={data.stats.avgRating.toFixed(1)} color="yellow" />
           <StatMetric icon={<FiTrendingUp />} label="Top Genre" value={data.stats.favoriteGenre} color="purple" />
        </div>

        {/* Action Center Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Section: Your Publications */}
           <div className="lg:col-span-2 space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
                 <div className="px-8 py-6 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="font-bold text-text-main text-lg tracking-tight">YOUR CONTRIBUTIONS</h2>
                    <Link to="/books/new" className="px-5 py-2.5 bg-brand text-white font-bold text-sm rounded-xl hover:bg-brand/90 transition-colors flex items-center gap-2 shadow-md shadow-brand/20"><FiPlus className="text-lg" /> Add Entry</Link>
                 </div>
                 <div className="p-8 space-y-4">
                    {data.myBooks.length > 0 ? data.myBooks.slice(0, 5).map(b => (
                      <div key={b._id} className="flex items-center justify-between p-5 bg-gray-50/50 dark:bg-slate-800/20 rounded-xl hover:bg-gray-100/50 dark:hover:bg-slate-800/40 transition-colors">
                         <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 bg-brand/10 text-brand rounded-lg flex items-center justify-center font-bold text-sm shadow-sm"><FiLayers /></div>
                            <div className="truncate">
                               <div className="text-sm font-bold text-text-main truncate">{b.title}</div>
                               <div className="text-xs text-text-muted font-bold uppercase tracking-wide">{b.genre}</div>
                            </div>
                         </div>
                         <div className="text-right ml-2">
                            <div className="text-sm font-bold text-brand">${b.price?.toFixed(2)}</div>
                            <div className="text-xs font-bold text-yellow-500">⭐ {b.rating?.toFixed(1)}</div>
                         </div>
                      </div>
                    )) : (
                      <div className="text-center py-20 flex flex-col items-center gap-6">
                         <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-full text-text-muted"><FiLayers className="h-12 w-12 opacity-20" /></div>
                         <p className="text-text-muted font-medium">You haven't added any books to our system yet.</p>
                         <Link to="/books/new" className="text-brand font-bold hover:underline underline-offset-4 transition-colors">Record your first book</Link>
                      </div>
                    )}
                 </div>
                 {data.myBooks.length > 5 && (
                   <div className="px-8 py-4 bg-gray-50/50 dark:bg-slate-800/10 border-t border-gray-50 dark:border-slate-800 text-center">
                      <Link to="/books" className="text-sm font-bold text-brand hover:underline underline-offset-2">Browse Full Inventory Dashboard</Link>
                   </div>
                 )}
              </div>
           </div>

           {/* Sidebar: Profile & Community */}
           <div className="space-y-8">
              {/* Account QuickView */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm p-8">
                 <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-brand/10 text-brand rounded-2xl flex items-center justify-center text-4xl font-bold mb-6 shadow-lg shadow-brand/10">
                       {user?.name?.charAt(0)}
                    </div>
                    <h3 className="text-2xl font-bold text-text-main">{data.profile?.name || user?.name}</h3>
                    <p className="text-sm text-text-muted font-medium mb-8">{data.profile?.email}</p>
                    <Link to="/profile" className="w-full py-3 bg-gray-100 dark:bg-slate-800 text-text-main font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 text-sm"><FiUser /> Edit Account</Link>
                 </div>
              </div>

              {/* Favorites Snapshot */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden">
                 <div className="px-8 py-5 border-b border-gray-50 dark:border-slate-800 flex justify-between items-center bg-red-50/5 dark:bg-red-950/10">
                    <h4 className="font-bold text-text-main text-sm uppercase tracking-wide">Saved Reading</h4>
                    <FiHeart className="text-red-500 text-lg" />
                 </div>
                 <div className="p-8 space-y-4">
                    {data.favorites.length > 0 ? data.favorites.slice(0, 3).map(b => (
                       <div key={b._id} className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-slate-800/50 last:border-0">
                          <div className="w-10 h-10 bg-red-100 dark:bg-red-950/40 text-red-500 rounded-lg flex items-center justify-center text-sm shadow-sm"><FiBook /></div>
                          <div className="min-w-0 flex-1">
                             <div className="text-sm font-bold text-text-main truncate">{b.title}</div>
                             <div className="text-xs text-text-muted font-medium truncate">{b.author}</div>
                          </div>
                       </div>
                    )) : <p className="text-center text-sm text-text-muted italic py-6">No favorites saved.</p>}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatMetric = ({ icon, label, value, color }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-lg shadow-inner ${
       color === 'brand' ? 'bg-brand/10 text-brand' : color === 'green' ? 'bg-green-500/10 text-green-600' : color === 'yellow' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-purple-500/10 text-purple-600'
    }`}>
       {icon}
    </div>
    <div className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2">{label}</div>
    <div className="text-4xl font-bold text-text-main tracking-tight">{value}</div>
  </div>
);

export default UserDashboard;