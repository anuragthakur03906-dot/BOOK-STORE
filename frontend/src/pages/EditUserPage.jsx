import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { adminAPI } from '../services/api.js';
import { FiUser, FiMail, FiShield, FiSave, FiCheck, FiX, FiLayers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import BackButton from '../components/common/BackButton.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const EditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleName: 'user',
    isActive: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUserById(id);
      if (response.data.success) {
        const u = response.data.data;
        setFormData({
          name: u.name || '',
          email: u.email || '',
          roleName: u.roleName || 'user',
          isActive: u.isActive
        });
      }
    } catch (error) {
      toast.error('Identity record retrieval failed');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Identity validation failed');
      return;
    }

    setSaving(true);
    try {
      const response = await adminAPI.updateUser(id, formData);
      if (response.data.success) {
        toast.success('Identity metadata updated');
        navigate(`/admin/users/${id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Administrative commit failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-base py-12 px-4 transition-colors duration-200">
      <div className="max-w-xl mx-auto">
        <div className="mb-10">
          <BackButton />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-gray-50 dark:border-slate-800 p-10 md:p-14">
          <div className="mb-10 flex flex-col items-center">
             <div className="w-16 h-16 bg-brand/10 text-brand rounded-[1.25rem] flex items-center justify-center text-3xl mb-4 font-bold shadow-inner">
                {formData.name?.charAt(0)}
             </div>
             <h1 className="text-3xl font-bold text-text-main text-center">Modify Identity</h1>
             <p className="text-text-muted mt-2 font-medium italic">Adjust metadata for user ID {id.substring(0,8)}...</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
               <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2 block px-2">Official Identity</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand/20 transition-all text-text-main"
                    />
                  </div>
               </div>

               <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2 block px-2">Communications Hub</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand/20 transition-all text-text-main"
                    />
                  </div>
               </div>

               <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2 block px-2">Authorization Layer</label>
                  <div className="relative">
                    <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <select
                      name="roleName"
                      value={formData.roleName}
                      onChange={handleChange}
                      disabled={id === currentUser?._id}
                      className="w-full bg-gray-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-brand/20 transition-all text-text-main appearance-none cursor-pointer disabled:opacity-50"
                    >
                      <option value="user">Standard User</option>
                      <option value="manager">Content Manager</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  {id === currentUser?._id && <p className="text-[10px] text-brand/60 mt-2 font-bold uppercase italic px-2 tracking-tight">Self-role modification restricted</p>}
               </div>

               <div className="pt-4">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-4 block px-2">Account State</label>
                  <div className="flex items-center gap-4">
                     <button
                        type="button"
                        onClick={() => id !== currentUser?._id && setFormData(p => ({ ...p, isActive: true }))}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-bold text-xs ${
                          formData.isActive ? 'bg-green-500/10 border-green-500 text-green-600' : 'bg-transparent border-gray-100 dark:border-slate-800 text-text-muted opacity-40'
                        } ${id === currentUser?._id ? 'cursor-not-allowed' : ''}`}
                     >
                        <FiCheck /> Active
                     </button>
                     <button
                        type="button"
                        onClick={() => id !== currentUser?._id && setFormData(p => ({ ...p, isActive: false }))}
                        className={`flex-1 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 font-bold text-xs ${
                          !formData.isActive ? 'bg-red-500/10 border-red-500 text-red-600' : 'bg-transparent border-gray-100 dark:border-slate-800 text-text-muted opacity-40'
                        } ${id === currentUser?._id ? 'cursor-not-allowed' : ''}`}
                     >
                        <FiX /> Suspended
                     </button>
                  </div>
               </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-xl shadow-brand/20 hover:opacity-90 transition-all transform active:scale-[0.98] mt-6 flex items-center justify-center gap-2"
            >
              <FiSave />
              {saving ? 'Committing Changes...' : 'Authorize Metadata Update'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserPage;