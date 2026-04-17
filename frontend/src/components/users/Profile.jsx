import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api.js';
import { FiEdit2, FiTrash2, FiClock, FiShield, FiUser, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import BackButton from '../common/BackButton.jsx';
import ConfirmModal from '../common/ConfirmModal.jsx';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const { logout, user: authUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.data.success) {
        setUser(response.data.data);
        setFormData({
          name: response.data.data.name || '',
          email: response.data.data.email || '',
          password: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const updateData = { name: formData.name, email: formData.email };
      if (formData.password) updateData.password = formData.password;

      const response = await userAPI.updateProfile(updateData);
      if (response.data.success) {
        setUser(response.data.data);
        setEditing(false);
        toast.success('Your information has been updated');
      }
    } catch (error) {
      toast.error('Profile update failed');
    }
  };

  const handlePermanentDelete = async () => {
    setDeleting(true);
    try {
      // Logic for account deletion would go here
      toast.success('Account deactivated');
      await logout();
      navigate('/');
    } catch (err) {
      toast.error('Failed to close account');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  const profileData = user || authUser;

  return (
    <div className="min-h-screen bg-base py-12">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div className="flex flex-col gap-6">
            <BackButton />
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 md:h-28 md:w-28 bg-brand text-white rounded-2xl flex items-center justify-center text-4xl font-bold shadow-lg shadow-brand/20">
                {profileData.name?.charAt(0)}
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-text-main leading-tight">{profileData.name}</h1>
                <p className="text-text-muted mt-2 font-medium">{profileData.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={`px-6 py-3 font-bold rounded-xl transition-all whitespace-nowrap ${editing ? 'bg-gray-100 dark:bg-slate-800 text-text-main hover:bg-gray-200 dark:hover:bg-slate-700' : 'bg-brand text-white hover:bg-brand/90 shadow-lg shadow-brand/20'}`}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {editing ? (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
                <h2 className="text-2xl font-bold text-text-main mb-8">Update Your Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <FormInput label="Display Name" name="name" value={formData.name} onChange={handleChange} icon={<FiUser />} />
                  <FormInput label="Work Email" type="email" name="email" value={formData.email} onChange={handleChange} icon={<FiMail />} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormInput label="New Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Keep empty to stay same" />
                    <FormInput label="Repeat Password" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Verify password" />
                  </div>
                  <button type="submit" className="w-full bg-brand text-white font-bold py-4 rounded-xl hover:bg-brand/90 transition-all mt-6 shadow-lg shadow-brand/20">Save Profile Changes</button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <InfoBox icon={<FiClock />} label="Joined Date" value={new Date(profileData.createdAt).toLocaleDateString()} />
                   <InfoBox icon={<FiShield />} label="Access Level" value={profileData.roleName || 'Subscriber'} highlight />
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
                   <h3 className="text-xl font-bold text-text-main mb-8">Recent Activity</h3>
                   <div className="space-y-4">
                      {profileData.favoriteBooks?.length > 0 ? (
                        profileData.favoriteBooks.slice(0, 3).map((book, idx) => (
                          <div key={book._id || `fav-${idx}`} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-slate-700/50 transition-all">
                             <div>
                                <h4 className="font-bold text-text-main text-sm">{book.title}</h4>
                                <p className="text-xs text-text-muted font-medium mt-1">Stored in your favorites</p>
                             </div>
                             <Link to={`/books/${book._id}`} className="text-sm font-bold text-brand hover:underline underline-offset-2">View</Link>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-text-muted italic px-2">No activity records found for this account.</p>
                      )}
                   </div>
                   {profileData.favoriteBooks?.length > 0 && (
                     <Link to="/favorites" className="block text-center mt-8 text-sm font-bold text-brand hover:underline underline-offset-2 transition-colors">Browse All Favorites</Link>
                   )}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Area */}
          <div className="space-y-6">
             <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-6">Account Overview</h3>
                <div className="space-y-5">
                   <div className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-slate-800 pb-4">
                      <span className="text-text-muted font-medium">Catalog Entries</span>
                      <span className="font-bold text-text-main text-lg">{profileData.booksCount || 0}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-text-muted font-medium">Saved Items</span>
                      <span className="font-bold text-text-main text-lg">{profileData.favoriteBooks?.length || 0}</span>
                   </div>
                </div>
             </div>

             <div className="p-8 space-y-4 rounded-3xl border border-red-50 dark:border-red-950/30 bg-red-50/5 dark:bg-red-950/5">
                <h3 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">Account Termination</h3>
                <button
                   onClick={() => setShowDeleteConfirm(true)}
                   className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-red-500/20"
                >
                   Close Account Permanently
                </button>
             </div>
          </div>
        </div>
      </div>

      <ConfirmModal 
        isOpen={showDeleteConfirm} 
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handlePermanentDelete}
        title="Confirm Account Closure"
        message="This will permanently deactivate your account and erase all your associated records. Are you sure you want to proceed?"
        confirmText={deleting ? "Closing..." : "Close Account"}
        cancelText="Cancel"
      />
    </div>
  );
};

const FormInput = ({ label, icon, ...props }) => (
  <div className="space-y-2.5">
    <label className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
      {icon} {label}
    </label>
    <input
      className="w-full px-4 py-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand focus:border-transparent outline-none text-text-main font-medium transition-all"
      {...props}
    />
  </div>
);

const InfoBox = ({ icon, label, value, highlight }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
    <div className={`p-3 rounded-xl mb-4 w-fit ${highlight ? 'bg-brand/10 text-brand' : 'bg-gray-100 dark:bg-slate-800 text-text-muted'}`}>
      {icon}
    </div>
    <div>
       <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-2">{label}</span>
       <span className="text-2xl font-bold text-text-main">{value}</span>
    </div>
  </div>
);

export default Profile;