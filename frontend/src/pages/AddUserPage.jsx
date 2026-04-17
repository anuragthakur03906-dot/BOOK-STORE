import { useState } from 'react';
import { adminAPI } from '../services/api.js';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiShield, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import BackButton from '../components/common/BackButton.jsx';

const AddUserPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleName: 'user'
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      toast.error('Identity records require name, email, and password');
      return;
    }

    setSaving(true);
    try {
      const response = await adminAPI.createUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        roleName: formData.roleName
      });

      if (response.data.success) {
        toast.success('Member successfully onboarded');
        navigate('/admin/users');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to initialize account');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-base py-12 px-4 transition-colors duration-200">
      <div className="max-w-xl mx-auto">
        <div className="mb-10">
          <BackButton />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-gray-50 dark:border-slate-800 p-10 md:p-14">
          <div className="mb-10 flex flex-col items-center">
             <div className="w-16 h-16 bg-brand/10 text-brand rounded-2xl flex items-center justify-center text-3xl mb-4">
                <FiPlus />
             </div>
             <h1 className="text-3xl font-bold text-text-main text-center">New Member Enrollment</h1>
             <p className="text-text-muted mt-2 font-medium italic">Assign identity and access clearance.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
               <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2 block px-2">Full Identity</label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Legal Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand/20 transition-all text-text-main"
                    />
                  </div>
               </div>

               <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2 block px-2">Secure Email</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="email"
                      name="email"
                      placeholder="address@corporate.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand/20 transition-all text-text-main"
                    />
                  </div>
               </div>

               <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2 block px-2">Access Key</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-brand/20 transition-all text-text-main"
                    />
                  </div>
               </div>

               <div>
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-2 block px-2">Clearance Level</label>
                  <div className="relative">
                    <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    <select
                      name="roleName"
                      value={formData.roleName}
                      onChange={handleChange}
                      className="w-full bg-gray-50 dark:bg-slate-800/50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-brand/20 transition-all text-text-main appearance-none cursor-pointer"
                    >
                      <option value="user">Standard User</option>
                      <option value="manager">Content Manager</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
               </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 bg-brand text-white font-bold rounded-2xl shadow-xl shadow-brand/20 hover:opacity-90 transition-all transform active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
            >
              {saving ? 'Processing...' : 'Authorize Member Onboarding'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUserPage;
