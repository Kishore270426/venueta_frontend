import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaCalendarCheck, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaChevronRight,
  FaUserCircle,
  FaBell,
  FaCog,
  FaSearch,
  FaBook
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState(3); // Example notification count
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navigationItems = [
    { 
      name: 'Dashboard', 
      path: '/user-Dashboard/dashboard-user', 
      icon: <FaHome className="w-5 h-5" />,
      activeIcon: <FaHome className="w-5 h-5" />
    },
    { 
      name: 'My Bookings', 
      path: '/user-Dashboard/my-booking-status', 
      icon: <FaBook className="w-5 h-5" />,
      activeIcon: <FaBook className="w-5 h-5" />
    },
    { 
      name: 'Hall Booking', 
      path: '/user-Dashboard/hall-list', 
      icon: <FaCalendarCheck className="w-5 h-5" />,
      activeIcon: <FaCalendarCheck className="w-5 h-5" />
    }
  ];

  const handleLogout = () => {
    // Add logout logic here
    localStorage.removeItem('userToken'); // Example
    navigate('/login');
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <>
      {/* Enhanced Fixed Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200/80 shadow-sm z-50 supports-[backdrop-filter]:bg-white/95"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left Section - Logo & Desktop Navigation */}
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Logo with Animation */}
              <motion.div 
                className="flex-shrink-0 flex items-center cursor-pointer"
                onClick={() => navigate('/user-Dashboard/dashboard-user')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">V</span>
                  </div>
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl blur opacity-75 animate-ping"
                    style={{ animationDuration: '2s' }}
                  />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Venuta
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">Premium Venues</p>
                </div>
              </motion.div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex lg:ml-10 space-x-1">
                {navigationItems.map((item, index) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `group relative flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <motion.span
                          initial={false}
                          animate={{ scale: isActive ? 1.1 : 1 }}
                          className="mr-2"
                        >
                          {isActive ? item.activeIcon : item.icon}
                        </motion.span>
                        <span>{item.name}</span>
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t-full"
                            layoutId="activeIndicator"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </motion.div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-4">
              
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 hidden md:flex"
                onClick={() => {/* Handle search modal */}}
              >
                <FaSearch className="w-5 h-5" />
              </motion.button>

              {/* Notifications */}
              <motion.div className="relative" whileHover={{ scale: 1.05 }}>
                <button className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200">
                  <FaBell className="w-5 h-5" />
                  {notifications > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg"
                    >
                      {notifications > 9 ? '9+' : notifications}
                    </motion.span>
                  )}
                </button>
              </motion.div>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
                onClick={() => {/* Handle settings */}}
              >
                <FaCog className="w-5 h-5" />
              </motion.button>

              {/* User Menu */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                >
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-semibold text-gray-900 hidden sm:block">John Doe</p>
                    <p className="text-xs text-gray-500 hidden sm:block">User</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <FaUserCircle className="w-6 h-6 text-white" />
                  </div>
                </motion.button>

                {/* Enhanced User Dropdown */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                    >
                      {/* User Info Card */}
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4 text-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <FaUserCircle className="w-7 h-7" />
                          </div>
                          <div>
                            <p className="font-semibold">John Doe</p>
                            <p className="text-sm opacity-90">john.doe@example.com</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <motion.button 
                          whileHover={{ backgroundColor: '#f3f4f6' }}
                          className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => {/* Handle profile */}}
                        >
                          <FaUserCircle className="w-4 h-4 mr-3 text-gray-400" />
                          Profile Settings
                        </motion.button>
                        <motion.button 
                          whileHover={{ backgroundColor: '#f3f4f6' }}
                          className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => {/* Handle preferences */}}
                        >
                          <FaCog className="w-4 h-4 mr-3 text-gray-400" />
                          Account Preferences
                        </motion.button>
                      </div>

                      {/* Logout Section */}
                      <div className="border-t border-gray-100">
                        <motion.button
                          whileHover={{ backgroundColor: '#fef2f2' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleLogout}
                          className="flex items-center w-full px-6 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 font-medium"
                        >
                          <FaSignOutAlt className="w-4 h-4 mr-3" />
                          Sign Out
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200"
              >
                {isMobileMenuOpen ? 
                  <FaTimes className="w-5 h-5 text-gray-700" /> : 
                  <FaBars className="w-5 h-5 text-gray-700" />
                }
              </motion.button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-4 space-y-2">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={closeAllMenus}
                    className={({ isActive }) =>
                      `group flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-xl transition-all duration-300 ${
                        location.pathname === item.path 
                          ? "bg-white/20" 
                          : "bg-gray-100 group-hover:bg-gray-200"
                      }`}>
                        {item.icon}
                      </div>
                      <span className="font-semibold">{item.name}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: location.pathname === item.path ? 90 : 0 }}
                      className="w-4 h-4 text-white/70"
                    >
                      <FaChevronRight />
                    </motion.div>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={closeAllMenus}
          />
        )}
      </AnimatePresence>

      {/* Header Spacer */}
      <div className="h-16 lg:h-16"></div>
    </>
  );
};

export default Header;