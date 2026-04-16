// components/layout/Navbar.jsx - Active Link Highlighting Implementation
import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { 
  FiBook, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiHome, 
  FiGrid,
  FiUsers,
  FiBarChart2,
  FiHeart,
  FiSettings
} from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Function to get dashboard path based on user role
  const getDashboardPath = () => {
    if (!user?.roleName) return '/user/dashboard';
    if (user.roleName === 'admin') return '/admin/dashboard';
    if (user.roleName === 'manager') return '/manager/dashboard';
    return '/user/dashboard';
  };

  // ALL NAV LINKS
  const navLinks = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'Books', path: '/books', icon: FiBook },
  ];

  // ROLE-BASED DASHBOARD LINK
  if (isAuthenticated) {
    navLinks.push({ name: 'Dashboard', path: getDashboardPath(), icon: FiGrid });
    
    // User-specific links
    navLinks.push(
      { name: 'Profile', path: '/profile', icon: FiUser },
      { name: 'Favorites', path: '/favorites', icon: FiHeart }
    );
  }

  // ADMIN LINKS
  const adminLinks = [];
  if (isAuthenticated && user?.roleName === 'admin') {
    adminLinks.push(
      { name: 'User Management', path: '/admin/users', icon: FiUsers },
      { name: 'Book Management', path: '/admin/books', icon: FiBook }
    );
  }

  // NavLink styling helper function
  const getLinkClass = (isActive) =>
    `px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors ${
      isActive
        ? 'text-blue-600 bg-blue-50 font-semibold'
        : 'text-gray-700 hover:text-blue-600'
    }`;

  const getAdminLinkClass = (isActive) =>
    `px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 transition-colors ${
      isActive
        ? 'text-blue-600 bg-blue-50 font-semibold'
        : 'text-gray-600 hover:text-blue-600'
    }`;

  const getMobileLinkClass = (isActive) =>
    `block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 transition-colors ${
      isActive
        ? 'text-blue-600 bg-blue-50 font-semibold'
        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
    }`;

  const getMobileAdminLinkClass = (isActive) =>
    `block px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ml-4 transition-colors ${
      isActive
        ? 'text-blue-600 bg-blue-50 font-semibold'
        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
    }`;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FiBook className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">BookStore</span>
            </Link>
          </div>

          {/* Desktop Navigation - LEFT SIDE */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => getLinkClass(isActive)}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Desktop Navigation - RIGHT SIDE (Admin Links + User) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Admin Links */}
            {adminLinks.length > 0 && (
              <div className="flex items-center space-x-2 border-r pr-4">
                {adminLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => getAdminLinkClass(isActive)}
                    title={link.name}
                  >
                    <link.icon className="h-3 w-3" />
                    <span className="hidden lg:inline">{link.name}</span>
                  </NavLink>
                ))}
              </div>
            )}

            {/* User Actions */}
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUser className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                    <span className={`text-xs px-1 rounded ${
                      user?.roleName === 'admin' ? 'bg-red-100 text-red-800' :
                      user?.roleName === 'manager' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user?.roleName}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Regular Links */}
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => getMobileLinkClass(isActive)}
                onClick={() => setIsMenuOpen(false)}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.name}</span>
              </NavLink>
            ))}

            {/* Admin Links (Mobile) */}
            {adminLinks.length > 0 && (
              <div className="border-t pt-2">
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Admin Panel
                </p>
                {adminLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) => getMobileAdminLinkClass(isActive)}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </NavLink>
                ))}
              </div>
            )}
            
            {/* User Info & Logout */}
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 flex items-center space-x-2 border-t mt-2 pt-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUser className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                    <div className={`text-xs px-1 mt-1 rounded inline-block ${
                      user?.roleName === 'admin' ? 'bg-red-100 text-red-800' :
                      user?.roleName === 'manager' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {user?.roleName}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left text-gray-700 hover:text-red-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 mt-2 transition-colors"
                >
                  <FiLogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="border-t pt-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium text-center transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium text-center mt-2 transition-colors"
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
