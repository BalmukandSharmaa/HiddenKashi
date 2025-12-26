import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'hotel_owner') return '/owner/dashboard';
    return '/customer/dashboard';
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-xl">SK</span>
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-800">
                Swagatam Kashi
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/hotels" className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg font-medium transition-all duration-200">
              Hotels
            </Link>
            <Link to="/tours" className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg font-medium transition-all duration-200">
              Tours
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <FiUser className="text-white text-sm" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.fullName}
                    </span>
                  </div>
                  <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transform hover:scale-105 transition-all duration-200">
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-gray-900 px-6 py-2 rounded-lg font-medium transition-all duration-200">
                  Login
                </Link>
                <Link to="/register" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transform hover:scale-105 transition-all duration-200">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-green-600 p-2 rounded-lg transition-all duration-200"
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-slideUp border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-2 bg-white">
            <Link
              to="/hotels"
              className="block text-gray-700 hover:text-green-600 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hotels
            </Link>
            <Link
              to="/tours"
              className="block text-gray-700 hover:text-green-600 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tours
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block text-gray-700 hover:text-green-600 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="px-4 py-2">
                  <div className="flex items-center space-x-3 bg-gray-100 px-4 py-3 rounded-lg mb-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <FiUser className="text-white text-sm" />
                    </div>
                    <span className="font-medium text-gray-700">{user?.fullName}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-200"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="px-4 space-y-2">
                <Link
                  to="/login"
                  className="block text-center text-gray-700 hover:text-gray-900 px-4 py-3 rounded-lg font-medium transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-center bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
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
