import { useState, useEffect, useRef, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  FaHeart,
  FaHistory,
  FaQuestionCircle,
  FaChevronDown
} from "react-icons/fa";
import { UserContext } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  const { logoutUser } = useContext(UserContext); // Use UserContext instead of AdminContext
  const navigate = useNavigate();
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/user-Dashboard/dashboard-user',
      icon: <FaHome className="w-4 h-4" />,
      badge: null
    },
    {
      name: 'Booking Status',
      path: '/user-Dashboard/my-booking-status',
      icon: <FaCalendarCheck className="w-4 h-4" />,
      badge: 3
    }
  ];

  const notifications = [
    { id: 1, title: "Booking Confirmed", message: "Your venue booking has been confirmed", time: "5m ago", unread: true },
    { id: 2, title: "Payment Successful", message: "Payment of ₹50,000 processed", time: "1h ago", unread: true },
    { id: 3, title: "New Offer Available", message: "Get 20% off on premium venues", time: "2h ago", unread: false },
  ];

  const handleLogout = () => {
    logoutUser(); // Clear user context and localStorage
    setTimeout(() => {
      navigate("/"); // Redirect to user login page after a short delay
    }, 1000); // 1-second delay for smoother transition
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsNotificationOpen(false);
  };

  return (
    <>
      {/* Main Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200'
          : 'bg-white border-b border-gray-100'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Left Section - Logo & Desktop Navigation */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex-shrink-0 flex items-center cursor-pointer"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <span className="text-white font-bold text-lg">V</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Venuta
                  </h1>
                  <p className="text-xs text-gray-500 font-medium hidden sm:block">User Portal</p>
                </div>
              </motion.div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex lg:space-x-2">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `relative flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 group ${isActive
                        ? "text-white"
                        : "text-gray-600 hover:text-gray-900"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center space-x-2">
                          <span className={`transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`}>
                            {item.icon}
                          </span>
                          <span>{item.name}</span>
                          {item.badge && (
                            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-purple-100 text-purple-600'
                              }`}>
                              {item.badge}
                            </span>
                          )}
                        </span>
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-3">



              {/* Notifications */}
              <div className="relative" ref={notificationRef}>


                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                    >
                      <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg">Notifications</h3>
                          <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-semibold">
                            {notifications.filter(n => n.unread).length} New
                          </span>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${notification.unread ? 'bg-purple-50/50' : ''
                              }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${notification.unread ? 'bg-purple-600' : 'bg-gray-300'
                                }`}></div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm">
                                  {notification.title}
                                </p>
                                <p className="text-gray-600 text-xs mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-gray-400 text-xs mt-2">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 bg-gray-50 border-t border-gray-200">
                        <button className="w-full text-center text-sm font-semibold text-purple-600 hover:text-purple-700 py-2">
                          View All Notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>


              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200 border-2 border-transparent hover:border-purple-200"
                >
          
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                      <FaUserCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <FaChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''
                    }`} />
                </motion.button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                    >
                      {/* User Info Header */}
                      <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <FaUserCircle className="w-8 h-8" />
                          </div>
                          {/* <div>
                            <p className="font-bold">John Doe</p>
                            <p className="text-xs text-purple-100">john.doe@example.com</p>
                          </div> */}
                        </div>
                      </div>

                      {/* Menu Items */}
                      {/* <div className="p-2">
                        <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all duration-200 group">
                          <div className="w-8 h-8 bg-gray-100 group-hover:bg-purple-100 rounded-lg flex items-center justify-center mr-3 transition-colors">
                            <FaUserCircle className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
                          </div>
                          <span>My Profile</span>
                        </button>

                        <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all duration-200 group">
                          <div className="w-8 h-8 bg-gray-100 group-hover:bg-purple-100 rounded-lg flex items-center justify-center mr-3 transition-colors">
                            <FaHistory className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
                          </div>
                          <span>Booking History</span>
                        </button>

                        <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all duration-200 group">
                          <div className="w-8 h-8 bg-gray-100 group-hover:bg-purple-100 rounded-lg flex items-center justify-center mr-3 transition-colors">
                            <FaCog className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
                          </div>
                          <span>Settings</span>
                        </button>

                        <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all duration-200 group">
                          <div className="w-8 h-8 bg-gray-100 group-hover:bg-purple-100 rounded-lg flex items-center justify-center mr-3 transition-colors">
                            <FaQuestionCircle className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
                          </div>
                          <span>Help & Support</span>
                        </button>
                      </div> */}

                      {/* Logout Button */}
                      <div className="p-2 border-t border-gray-200 bg-gray-50">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                        >
                          <div className="w-8 h-8 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center mr-3 transition-colors">
                            <FaSignOutAlt className="w-4 h-4" />
                          </div>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-all duration-200"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaTimes className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <FaBars className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-gray-200"
            >
              <div className="bg-gradient-to-br from-gray-50 to-purple-50 px-4 py-6">


                {/* Mobile Navigation Items */}
                <nav className="space-y-2 mb-6">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NavLink
                        to={item.path}
                        onClick={closeAllMenus}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-200 ${isActive
                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-gray-100'
                                }`}>
                                {item.icon}
                              </div>
                              <div>
                                <span className="font-semibold block">{item.name}</span>
                                {item.badge && (
                                  <span className={`text-xs font-medium ${isActive ? 'text-purple-200' : 'text-gray-500'
                                    }`}>
                                    {item.badge} pending
                                  </span>
                                )}
                              </div>
                            </div>
                            <FaChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'
                              }`} />
                          </>
                        )}
                      </NavLink>
                    </motion.div>
                  ))}
                </nav>

              

                {/* Mobile User Info */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl p-4 border border-gray-200"
                >
                  <div className="flex items-center space-x-3 mb-4">
                   

                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors"
                  >
                    <FaSignOutAlt />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={closeAllMenus}
          />
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16"></div>
    </>
  );
};

export default Header;