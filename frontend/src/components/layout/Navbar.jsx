// components/layout/Navbar.jsx
import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useThemeContext } from '../../context/ThemeContext.jsx';
import { 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiSun,
  FiMoon,
  FiBook
} from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeContext();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user?.roleName) return '/user/dashboard';
    if (user.roleName === 'admin') return '/admin/dashboard';
    if (user.roleName === 'manager') return '/manager/dashboard';
    return '/user/dashboard';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Library', path: '/books' },
  ];

  if (isAuthenticated) {
    navLinks.push({ name: 'Console', path: getDashboardPath() });
    navLinks.push(
      { name: 'Profile', path: '/profile' },
      { name: 'Saved', path: '/favorites' }
    );
  }

  const adminLinks = [];
  if (isAuthenticated && user?.roleName === 'admin') {
    adminLinks.push(
      { name: 'Directory', path: '/admin/users' },
      { name: 'Inventory', path: '/admin/books' }
    );
  }

  const getLinkClass = (isActive) =>
    `px-4 py-2 rounded-xl text-sm font-bold transition-all ${
      isActive
        ? 'text-brand bg-brand/10 shadow-sm'
        : 'text-text-muted hover:text-brand hover:bg-brand/5'
    }`;

  const getAdminLinkClass = (isActive) =>
    `px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
      isActive
        ? 'text-brand bg-brand/10'
        : 'text-text-muted/60 hover:text-brand'
    }`;

  const getMobileLinkClass = (isActive) =>
    `block px-4 py-3 rounded-2xl text-base font-bold transition-all ${
      isActive
        ? 'text-brand bg-brand/10'
        : 'text-text-main hover:text-brand hover:bg-brand/5'
    }`;

  return (
    <nav className="bg-base border-b border-gray-100 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Brand - Emerald Theme */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand/20 group-hover:scale-110 transition-transform">
                 <FiBook className="text-xl" />
              </div>
              <span className="text-xl font-bold text-text-main tracking-tight group-hover:text-brand transition-colors">BookStore</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <div className="flex items-center space-x-1 mr-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => getLinkClass(isActive)}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {adminLinks.length > 0 && (
              <div className="flex items-center space-x-1 border-l border-gray-100 dark:border-slate-800 pl-4 mr-4">
                {adminLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => getAdminLinkClass(isActive)}
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-4 ml-4">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-text-muted hover:text-brand hover:border-brand/40 border border-transparent transition-all"
                aria-label="Toggle theme"
              >
                {mode === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-4 pl-4 border-l border-gray-100 dark:border-slate-800">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-text-main">
                      {user?.name}
                    </span>
                    <span className="text-[10px] items-center px-1.5 py-0.5 rounded bg-brand/10 text-brand font-bold uppercase tracking-widest">
                      {user?.roleName}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-10 h-10 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all flex items-center justify-center"
                    title="Logout"
                  >
                    <FiLogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-text-main font-bold px-4 py-2 hover:text-brand transition-colors text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-brand text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 shadow-lg shadow-brand/20 transition-all active:scale-95"
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-text-muted transition-all"
            >
              {mode === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-xl text-text-main hover:bg-gray-50 dark:hover:bg-slate-900 flex items-center justify-center transition-all bg-gray-50 dark:bg-slate-900"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden bg-base border-t border-gray-100 dark:border-slate-800 animate-fadeIn h-screen overflow-y-auto pb-20">
          <div className="px-4 pt-6 pb-8 space-y-4">
            <div className="space-y-2">
               <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-4 block mb-4">Navigation</label>
               {navLinks.map((link) => (
                  <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) => getMobileLinkClass(isActive)}
                  onClick={() => setIsMenuOpen(false)}
                  >
                  {link.name}
                  </NavLink>
               ))}
            </div>
            
            {adminLinks.length > 0 && (
              <div className="pt-6 space-y-2">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-4 block mb-4">Administrative</label>
                {adminLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => getMobileLinkClass(isActive)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            )}

            {isAuthenticated ? (
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-800 px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg text-text-main">{user?.name}</div>
                    <div className="text-[10px] text-brand font-bold uppercase tracking-[0.2em] mt-1">{user?.roleName} Access</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 rounded-xl font-bold flex items-center gap-2 transition-all"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-800 space-y-3 px-2">
                <Link
                  to="/login"
                  className="block w-full text-center py-4 text-text-main font-bold hover:bg-gray-50 rounded-2xl transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login to Account
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center py-4 bg-brand text-white rounded-2xl font-bold shadow-lg shadow-brand/20 transition-all active:scale-[0.98]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Join the Community
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
