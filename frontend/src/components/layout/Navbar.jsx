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
  FiMoon
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
    { name: 'Books', path: '/books' },
  ];

  if (isAuthenticated) {
    navLinks.push({ name: 'Dashboard', path: getDashboardPath() });
    navLinks.push(
      { name: 'Profile', path: '/profile' },
      { name: 'Favorites', path: '/favorites' }
    );
  }

  const adminLinks = [];
  if (isAuthenticated && user?.roleName === 'admin') {
    adminLinks.push(
      { name: 'Users', path: '/admin/users' },
      { name: 'Management', path: '/admin/books' }
    );
  }

  const getLinkClass = (isActive) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'text-brand bg-brand/10 font-semibold'
        : 'text-text-main hover:text-brand'
    }`;

  const getAdminLinkClass = (isActive) =>
    `px-2 py-1 rounded text-xs font-medium transition-colors ${
      isActive
        ? 'text-brand bg-brand/10 font-semibold'
        : 'text-text-muted hover:text-brand'
    }`;

  const getMobileLinkClass = (isActive) =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      isActive
        ? 'text-brand bg-brand/10 font-semibold'
        : 'text-text-main hover:text-brand hover:bg-brand/5'
    }`;

  return (
    <nav className="bg-base shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-text-main">BookStore</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
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
              <div className="flex items-center space-x-1 border-l border-gray-200 dark:border-gray-800 dark:border-gray-700 pl-4 mr-4">
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

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-text-muted hover:text-brand hover:bg-brand/10 transition-colors"
                aria-label="Toggle theme"
              >
                {mode === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-text-main">
                      {user?.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-text-muted">
                      {user?.roleName}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-text-muted hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <FiLogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-text-main hover:text-brand px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-text-muted hover:text-brand transition-colors"
            >
              {mode === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text-main hover:text-brand p-2"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-base border-t border-gray-100 dark:border-gray-800 animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1">
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
            
            {adminLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => getMobileLinkClass(isActive)}
                onClick={() => setIsMenuOpen(false)}
              >
                Admin: {link.name}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-4 px-3">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-medium text-text-main">{user?.name}</div>
                    <div className="text-xs text-text-muted uppercase tracking-tighter">{user?.roleName}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 font-medium"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-100 dark:border-gray-800 mt-4 pt-4 space-y-2">
                <Link
                  to="/login"
                  className="block w-full text-center py-2 text-text-main font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center py-2 bg-brand text-white rounded-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
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
