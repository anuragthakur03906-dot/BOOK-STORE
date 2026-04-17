import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { adminAPI } from '../services/api.js';
import { 
  FiBookOpen, FiSearch, FiFilter, FiShield, 
  FiArrowRight, FiUsers, FiTrendingUp, FiGlobe,
  FiLayout, FiLock, FiStar
} from 'react-icons/fi';
import { SiMongodb, SiExpress, SiReact, SiNodedotjs, SiTailwindcss, SiVite } from 'react-icons/si';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState({ books: 0, users: 0, active: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLiveStats();
  }, []);

  const fetchLiveStats = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getSystemStats();
      if (res.data.success) {
        setStats({
          books: res.data.data.books?.total || 120,
          users: res.data.data.users?.total || 45,
          active: res.data.data.users?.active || 12
        });
      }
    } catch (err) {
      // Silent failure - use placeholder stats
    } finally {
      setLoading(false);
    }
  };

  const getDashboardPath = () => {
    if (!user?.roleName) return '/user/dashboard';
    if (user.roleName === 'admin') return '/admin/dashboard';
    if (user.roleName === 'manager') return '/manager/dashboard';
    return '/user/dashboard';
  };

  return (
    <div className="bg-base min-h-screen font-sans selection:bg-brand/30 selection:text-brand transition-colors duration-300">
      
      {/* Hero Section - Gradient Overlay for Depth */}
      <section className="relative pt-24 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none z-0">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand/5 blur-[120px] rounded-full"></div>
           <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-brand/5 blur-[100px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-widest mb-8 animate-fadeIn">
             <span className="relative flex h-2 w-2">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
             </span>
             {stats.books}+ Books Catalogued
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-text-main mb-8 leading-[1.1] tracking-tight max-w-5xl mx-auto">
            The Intelligent <span className="text-brand">Librarian</span><br className="hidden md:block" /> For Your Digital Collection
          </h1>
          
          <p className="text-lg md:text-xl text-text-muted mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
            Elevate your reading experience with a premium, green-themed management platform. 
            Seamlessly organize, filter, and share your literary world with institutional-grade controls.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            {isAuthenticated ? (
              <>
                <Link
                  to="/books"
                  className="bg-brand text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                >
                  Explore Library <FiArrowRight className="text-xl" />
                </Link>
                <Link
                  to={getDashboardPath()}
                  className="bg-white dark:bg-slate-900 border-2 border-brand/20 text-text-main px-10 py-4 rounded-2xl font-bold text-lg hover:border-brand/40 hover:-translate-y-1 transition-all"
                >
                  My Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-brand text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand/20 hover:shadow-brand/40 hover:-translate-y-1 transition-all"
                >
                  Create Identity
                </Link>
                <Link
                  to="/login"
                  className="bg-white dark:bg-slate-900 border-2 border-brand/20 text-text-main px-10 py-4 rounded-2xl font-bold text-lg hover:border-brand/40 hover:-translate-y-1 transition-all"
                >
                  Secure Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Real-time Insights (Dynamic Section) */}
      <section className="py-12 border-y border-gray-100 dark:border-slate-800 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <LiveMetric label="Stored Titles" value={stats.books} icon={<FiBookOpen className="text-green-500" />} />
              <MetricSeparator />
              <LiveMetric label="Global Members" value={stats.users} icon={<FiUsers className="text-blue-500" />} />
              <MetricSeparator />
              <LiveMetric label="Engagement" value={`${((stats.active/(stats.users||1))*100).toFixed(0)}%`} icon={<FiTrendingUp className="text-red-500" />} />
              <MetricSeparator />
              <LiveMetric label="Security Layer" value="V2.4" icon={<FiLock className="text-purple-500" />} />
           </div>
        </div>
      </section>

      {/* Features Grid - Colorful & Premium */}
      <section className="py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
             <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold text-text-main mb-6 leading-tight">Advanced Controls For Premium Collectors</h2>
                <p className="text-text-muted font-medium italic">Our platform offers enterprise-grade functionality wrapped in a clean, Emerald-green aesthetic.</p>
             </div>
             <Link to="/books" className="text-brand font-bold flex items-center gap-2 group hover:underline underline-offset-8">
                View Full Capabilities <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<FiSearch />} 
              iconColor="bg-blue-500" 
              title="Global Indexing" 
              desc="Proprietary search algorithm allowing instant metadata retrieval across entire library clusters." 
            />
            <FeatureCard 
              icon={<FiFilter />} 
              iconColor="bg-green-500" 
              title="Smart Sorting" 
              desc="Granular filtering by valuation, user ratings, and genre tags with real-time response." 
            />
            <FeatureCard 
              icon={<FiShield />} 
              iconColor="bg-purple-500" 
              title="Role Authorization" 
              desc="Comprehensive permission structures for administrators, managers, and general users." 
            />
            <FeatureCard 
              icon={<FiStar />} 
              iconColor="bg-yellow-500" 
              title="Verified Ratings" 
              desc="Community-driven quality metrics to help you identify the most valuable records." 
            />
            <FeatureCard 
              icon={<FiGlobe />} 
              iconColor="bg-red-500" 
              title="Cloud Sync" 
              desc="Global availability ensuring your library is accessible from any device, anywhere." 
            />
            <FeatureCard 
              icon={<FiLayout />} 
              iconColor="bg-pink-500" 
              title="Responsive UI" 
              desc="A fluid architecture that adapts perfectly from mobile consoles to widescreen monitors." 
            />
          </div>
        </div>
      </section>

      {/* Tech Stack - Colorful & Dynamic */}
      <section className="py-24 border-t border-gray-100 dark:border-slate-800 bg-gray-50/20 dark:bg-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-[0.3em] mb-16">The Ecosystem</h2>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20">
            <VibrantTech icon={<SiMongodb />} color="#13aa52" label="MongoDB" />
            <VibrantTech icon={<SiExpress />} color="#444444" label="Express" />
            <VibrantTech icon={<SiReact />} color="#61dafb" label="React" />
            <VibrantTech icon={<SiNodedotjs />} color="#339933" label="Node.js" />
            <VibrantTech icon={<SiTailwindcss />} color="#38bdf8" label="Tailwind" />
            <VibrantTech icon={<SiVite />} color="#646cff" label="Vite" />
          </div>
        </div>
      </section>

      {/* Final Conversion Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-brand rounded-[3rem] p-12 md:p-24 text-center text-white shadow-3xl shadow-brand/40">
            {/* Visual Flairs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">Start Your Digital Archive</h2>
                <p className="text-white/80 text-lg md:text-xl mb-12 font-medium leading-relaxed">
                    Deploy your personal library to the cloud. Join thousands of readers 
                    standardizing their collections with our green-powered infrastructure.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Link to="/register" className="px-12 py-5 bg-white text-brand rounded-2xl font-bold text-lg hover:shadow-2xl shadow-brand-dark/20 transition-all hover:-translate-y-1 border-2 border-transparent">
                      Create Private Vault
                   </Link>
                   <Link to="/books" className="px-12 py-5 bg-brand-dark/30 backdrop-blur-md text-white border-2 border-white/20 rounded-2xl font-bold text-lg hover:bg-brand-dark/50 transition-all hover:-translate-y-1">
                      Browse Public Access
                   </Link>
                </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const LiveMetric = ({ label, value, icon }) => (
  <div className="flex flex-col items-center text-center">
     <div className="text-xl mb-2 opacity-80">{icon}</div>
     <div className="text-2xl font-bold text-text-main tracking-tight">{value}</div>
     <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">{label}</div>
  </div>
);

const MetricSeparator = () => (
   <div className="hidden lg:block w-px h-12 bg-gray-100 dark:bg-slate-800 self-center opacity-50"></div>
);

const FeatureCard = ({ icon, iconColor, title, desc }) => (
  <div className="p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 transition-all hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/5 group">
    <div className={`w-14 h-14 ${iconColor} text-white rounded-[1.25rem] flex items-center justify-center text-2xl mb-8 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-text-main mb-4 tracking-tight">{title}</h3>
    <p className="text-text-muted leading-relaxed font-medium text-sm">{desc}</p>
  </div>
);

const VibrantTech = ({ icon, color, label }) => (
  <div className="flex flex-col items-center gap-4 transition-all duration-300 transform hover:scale-110 group cursor-default">
    <div className="text-5xl drop-shadow-sm transition-all grayscale-0 opacity-100" style={{ color: color }}>
        {icon}
    </div>
    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{label}</span>
  </div>
);

export default Home;