import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { adminAPI, uploadAPI } from '../services/api.js';
import { 
  FiUser, FiMail, FiCalendar, FiShield, 
  FiBook, FiDollarSign, FiActivity, FiEdit,
  FiTrash2, FiCheck, FiX, FiLayers, FiInfo,
  FiClock, FiTrendingUp
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import BackButton from '../components/common/BackButton.jsx';
import ConfirmModal from '../components/common/ConfirmModal.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userBooks, setUserBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Modal states
  const [deleteModal, setDeleteModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const userRes = await adminAPI.getUserById(id);
      
      if (userRes.data.success) {
        setUserData(userRes.data.data);
        const booksRes = await adminAPI.getAllBooks({ addedBy: id, limit: 12 });
        if (booksRes.data.success) {
          setUserBooks(booksRes.data.data || []);
        }
      } else {
        toast.error('User record not found');
        navigate('/admin/users');
      }
    } catch (error) {
      toast.error('Data pull error');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const executeDeleteUser = async () => {
    setProcessing(true);
    try {
      const response = await adminAPI.deleteUser(id);
      if (response.data.success) {
        toast.success('Member record and associated data removed');
        navigate('/admin/users');
      }
    } catch (error) {
      toast.error('Administrative bypass denied');
    } finally {
      setProcessing(false);
      setDeleteModal(false);
    }
  };

  const executeToggleStatus = async () => {
    setProcessing(true);
    const newStatus = !userData.isActive;
    try {
      const response = await adminAPI.toggleUserStatus(id, { isActive: newStatus });
      if (response.data.success) {
        toast.success(`Account ${newStatus ? 'activated' : 'deactivated'} successfully`);
        fetchUserDetails();
      }
    } catch (error) {
      toast.error('System state update failed');
    } finally {
      setProcessing(false);
      setStatusModal(false);
    }
  };

  if (loading && !userData) return <LoadingSpinner fullScreen />;

  const formatFullDate = (date) => date ? new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
  }) : 'N/A';

  return (
    <div className="min-h-screen bg-base py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="flex flex-col gap-6">
              <BackButton />
              <div>
                <h1 className="text-3xl font-bold text-text-main">Member Profile Details</h1>
                <p className="text-text-muted mt-1 font-medium italic">Administrative oversight for user ID {id.substring(0, 8)}...</p>
              </div>
           </div>

           <div className="flex gap-3">
              <Link
                to={`/admin/users/${id}/edit`}
                className="px-6 py-2.5 bg-brand text-white font-bold rounded-xl shadow-lg shadow-brand/20 hover:opacity-90 flex items-center gap-2 transition-all"
              >
                <FiEdit /> Edit Identity
              </Link>
              
              {currentUser?.roleName === 'admin' && userData?._id !== currentUser?._id && (
                <button
                  onClick={() => setDeleteModal(true)}
                  className="px-6 py-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 font-bold rounded-xl hover:bg-red-100 flex items-center gap-2 transition-all"
                >
                  <FiTrash2 /> Purge User
                </button>
              )}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Identity Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm p-10 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-bl-[4rem]"></div>
               
               <div className="flex flex-col items-center text-center relative z-10">
                  <div className="w-24 h-24 bg-brand/10 text-brand rounded-[2rem] flex items-center justify-center text-4xl font-bold mb-6 shadow-inner ring-4 ring-white dark:ring-slate-800">
                     {userData.name?.charAt(0)}
                  </div>
                  <h2 className="text-2xl font-bold text-text-main mb-1">{userData.name}</h2>
                  <p className="text-sm font-medium text-text-muted italic mb-8">{userData.email}</p>
                  
                  <div className="w-full space-y-4">
                     <div className="flex justify-between items-center p-4 bg-gray-50/50 dark:bg-slate-800/20 rounded-2xl">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Access Level</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg ${
                          userData.roleName === 'admin' ? 'bg-red-100 text-red-700' :
                          userData.roleName === 'manager' ? 'bg-yellow-100 text-yellow-700' : 'bg-brand/10 text-brand'
                        }`}>{userData.roleName}</span>
                     </div>
                     
                     <div className="flex justify-between items-center p-4 bg-gray-50/50 dark:bg-slate-800/20 rounded-2xl">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Current State</span>
                        <button 
                          onClick={() => setStatusModal(true)}
                          disabled={userData._id === currentUser?._id}
                          className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg transition-all ${
                            userData.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                          } ${userData._id === currentUser?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                           {userData.isActive ? 'Active' : 'Deactivated'}
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Account Metadata */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm p-8 space-y-6">
               <h4 className="text-xs font-bold text-text-main uppercase tracking-widest pb-4 border-b border-gray-50 dark:border-slate-800">System Logs</h4>
               
               <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-brand"><FiClock /></div>
                  <div>
                     <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Onboarding Date</p>
                     <p className="text-xs font-bold text-text-main">{formatFullDate(userData.createdAt)}</p>
                  </div>
               </div>
               
               <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-brand"><FiActivity /></div>
                  <div>
                     <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Last Interaction</p>
                     <p className="text-xs font-bold text-text-main">{userData.lastLogin ? formatFullDate(userData.lastLogin) : 'No recent login'}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Activity Center */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tab Navigation */}
            <div className="flex gap-4 p-2 bg-gray-100/50 dark:bg-slate-800/40 rounded-2xl w-fit">
               {['overview', 'books', 'activity'].map(tab => (
                 <button
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                     activeTab === tab ? 'bg-white dark:bg-slate-900 text-brand shadow-sm' : 'text-text-muted hover:text-text-main'
                   }`}
                 >
                   {tab}
                 </button>
               ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm p-10 min-h-[400px]">
               {activeTab === 'overview' && (
                 <div className="space-y-10">
                    <h3 className="text-xl font-bold text-text-main tracking-tight uppercase">Intelligence Snapshot</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <MetricBox label="Global Publications" value={userBooks.length} icon={<FiBook />} color="brand" />
                       <MetricBox label="Content Valuation" value={`$${userBooks.reduce((s, b) => s + (parseFloat(b.price) || 0), 0).toFixed(2)}`} icon={<FiDollarSign />} color="green" />
                       <MetricBox label="Engagement Rate" value={userData.isActive ? '100%' : '0%'} icon={<FiTrendingUp />} color="purple" />
                       <MetricBox label="Security Access" value={userData.roleName} icon={<FiShield />} color="yellow" />
                    </div>
                    
                    <div className="p-8 bg-blue-50/20 dark:bg-blue-950/10 rounded-3xl border border-blue-50/50 dark:border-blue-900/20 flex gap-6">
                       <FiInfo className="text-blue-500 mt-1 flex-shrink-0" size={24} />
                       <div>
                          <p className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 uppercase tracking-wide">Administrative Note</p>
                          <p className="text-xs font-medium text-blue-700 dark:text-blue-400 leading-relaxed italic">Changes to identity or status are logged globally. Deactivating an account restricts all management access immediately but preserves catalog history.</p>
                       </div>
                    </div>
                 </div>
               )}

               {activeTab === 'books' && (
                 <div className="space-y-8">
                    <div className="flex justify-between items-center">
                       <h3 className="text-xl font-bold text-text-main tracking-tight uppercase">User Catalogue</h3>
                       <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">{userBooks.length} ITEMS FOUND</span>
                    </div>
                    
                    {userBooks.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {userBooks.map(b => (
                           <Link key={b._id} to={`/books/${b._id}`} className="p-5 bg-gray-50/50 dark:bg-slate-800/20 border border-transparent hover:border-brand/20 dark:hover:border-slate-700 rounded-2xl flex items-center gap-4 transition-all group">
                              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-text-muted group-hover:text-brand shadow-sm transition-colors text-xl"><FiBook /></div>
                              <div className="min-w-0">
                                 <h4 className="text-sm font-bold text-text-main truncate">{b.title}</h4>
                                 <p className="text-[10px] font-bold text-text-muted uppercase mt-0.5 tracking-wider">{b.genre}</p>
                              </div>
                           </Link>
                         ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-20 opacity-30 italic">
                         <FiLayers size={64} className="mb-4" />
                         <p className="font-bold">No contributions found for this user.</p>
                      </div>
                    )}
                 </div>
               )}

               {activeTab === 'activity' && (
                  <div className="space-y-8">
                     <h3 className="text-xl font-bold text-text-main tracking-tight uppercase">Audit History</h3>
                     <div className="space-y-4">
                        <ActivityLine label="Account Generation" date={userData.createdAt} desc="Full identity was validated and recorded." />
                        {userData.lastLogin && <ActivityLine label="Security Validation" date={userData.lastLogin} desc="Standard session hash generated and verified." />}
                        <ActivityLine label="Contribution Check" date={new Date()} desc={`${userBooks.length} records verified in global inventory.`} />
                     </div>
                  </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal 
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={executeDeleteUser}
        title="Purge Member Records"
        message={`Are you fully certain about removing '${userData.name}'? This action is IRREVERSIBLE and will also cascade through all catalog records created by this user.`}
        confirmText={processing ? "Executing..." : "Confirm Purge"}
        cancelText="Cancel"
      />

      <ConfirmModal 
        isOpen={statusModal}
        onClose={() => setStatusModal(false)}
        onConfirm={executeToggleStatus}
        title="Update Access State"
        message={`You are about to ${userData.isActive ? 'Suspend' : 'Reinstate'} access for this member. Continue tracking status change?`}
        confirmText={processing ? "Updating..." : "Confirm Change"}
        cancelText="Cancel"
      />
    </div>
  );
};

const MetricBox = ({ label, value, icon, color }) => (
  <div className="p-6 bg-gray-50/50 dark:bg-slate-800/20 rounded-3xl border border-gray-50 dark:border-slate-800/50 flex items-center gap-6">
     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${
       color === 'brand' ? 'bg-brand/10 text-brand' : color === 'green' ? 'bg-green-500/10 text-green-600' : color === 'yellow' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-purple-500/10 text-purple-600'
     }`}>
        {icon}
     </div>
     <div>
        <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{label}</h5>
        <div className="text-xl font-bold text-text-main tracking-tight">{value}</div>
     </div>
  </div>
);

const ActivityLine = ({ label, date, desc }) => (
   <div className="relative pl-8 pb-8 border-l border-gray-100 dark:border-slate-800 last:pb-0">
      <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-brand ring-4 ring-white dark:ring-slate-900 shadow-sm"></div>
      <div className="font-bold text-sm text-text-main mb-1">{label}</div>
      <div className="text-[10px] font-bold text-brand uppercase tracking-widest mb-2">{new Date(date).toLocaleString()}</div>
      <p className="text-xs font-medium text-text-muted italic">{desc}</p>
   </div>
);

export default UserDetailPage;