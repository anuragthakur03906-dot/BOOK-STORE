// src/components/users/Profile.jsx
import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api.js';
import { FiEdit2, FiTrash2, FiHeart } from 'react-icons/fi';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const toast = useToast();
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
          name: response.data.data.name,
          email: response.data.data.email,
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
        toast.success('Profile updated');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleRemoveFromFavorites = async (bookId) => {
    try {
      await userAPI.removeFromFavorites(bookId);
      toast.success('Removed');
      fetchProfile();
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  if (loading) return <div className="min-h-screen bg-base flex justify-center items-center"><div className="animate-spin h-8 w-8 border-t-2 border-brand rounded-full"></div></div>;

  const profileData = user || authUser;

  return (
    <div className="min-h-screen bg-base py-16 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div>
            <span className="text-xs font-black text-brand uppercase tracking-widest bg-brand/10 px-3 py-1 rounded-full mb-4 inline-block">Member Account</span>
            <h1 className="text-5xl font-black text-text-main tracking-tight italic">{profileData.name}</h1>
            <p className="text-lg text-text-muted mt-2">{profileData.email}</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="px-6 py-2 bg-text-main text-base font-bold rounded-xl hover:opacity-90 transition-all dark:bg-base dark:text-black"
          >
            {editing ? 'Back to View' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-12">
            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-8 bg-base/50 dark:bg-gray-800/20 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-base border-b-2 border-gray-200 dark:border-gray-800 dark:border-gray-700 focus:border-brand py-2 outline-none text-text-main font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-text-muted uppercase tracking-widest">Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-base border-b-2 border-gray-200 dark:border-gray-800 dark:border-gray-700 focus:border-brand py-2 outline-none text-text-main font-bold" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-text-muted uppercase tracking-widest">New Password</label>
                      <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-base border-b-2 border-gray-200 dark:border-gray-800 dark:border-gray-700 focus:border-brand py-2 outline-none text-text-main font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-text-muted uppercase tracking-widest">Confirm</label>
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-base border-b-2 border-gray-200 dark:border-gray-800 dark:border-gray-700 focus:border-brand py-2 outline-none text-text-main font-bold" />
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full bg-brand text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-brand/20">Update Identity</button>
              </form>
            ) : (
              <div className="space-y-12">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-black text-text-muted uppercase tracking-widest mb-2">Member Since</h4>
                    <p className="text-xl font-bold text-text-main">{new Date(profileData.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-text-muted uppercase tracking-widest mb-2">Role Type</h4>
                    <p className="text-xl font-bold text-brand uppercase tracking-tight">{profileData.roleName || 'User'}</p>
                  </div>
                </div>

                {/* Favorites Section */}
                <div>
                  <h4 className="text-xs font-black text-text-muted uppercase tracking-widest mb-6 border-l-4 border-brand pl-4">Your Favorites</h4>
                  <div className="space-y-4">
                    {profileData.favoriteBooks?.length > 0 ? (
                      profileData.favoriteBooks.map((book) => (
                        <div key={book._id} className="flex items-center justify-between p-4 bg-base/50 dark:bg-gray-800/10 rounded-2xl group border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all">
                          <div className="min-w-0">
                            <h5 className="font-bold text-text-main group-hover:text-brand transition-colors truncate">{book.title}</h5>
                            <p className="text-xs text-text-muted">by {book.author}</p>
                          </div>
                          <button onClick={() => handleRemoveFromFavorites(book._id)} className="p-2 text-text-muted hover:text-red-500 transition-colors">
                            <FiTrash2 />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-text-muted italic text-sm">No favorites yet. Start exploring collection.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Area - Metadata */}
          <div className="space-y-12">
             <div className="bg-base/50 dark:bg-gray-800/10 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
                <h4 className="text-xs font-black text-text-muted uppercase tracking-widest mb-6">Stats</h4>
                <div className="space-y-6">
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-text-main">Books Added</span>
                      <span className="text-xl font-black text-brand">{profileData.booksCount || 0}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-text-main">Favorite Books</span>
                      <span className="text-xl font-black text-brand">{profileData.favoriteBooks?.length || 0}</span>
                   </div>
                </div>
             </div>

             <div className="p-8 space-y-4">
                <h4 className="text-xs font-black text-red-600 uppercase tracking-widest mb-2">Danger Zone</h4>
                <button
                   onClick={() => setShowDeleteConfirm(true)}
                   className="w-full text-left text-sm font-bold text-red-600 hover:underline"
                >
                   Deactivate Account Permanently
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-base rounded-3xl p-10 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black text-text-main mb-4 italic uppercase">Confirm Deletion</h3>
            <p className="text-text-muted mb-8 text-sm leading-relaxed">Identity erasure is permanent. This will remove all books, favorites, and profile metadata from our systems.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-3 text-text-main font-bold hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">Abort</button>
              <button className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-600/20">Purge Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;