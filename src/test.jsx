import React, { useState, useContext, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "./pages/Context/UserContext";
import { 
  FaBars, FaTimes, FaHome, FaCalendarCheck, FaCog, FaSignOutAlt,
  FaUser, FaBell, FaChevronDown, FaMoon, FaSun, FaSearch
} from "react-icons/fa";

const UserDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
    setUserOpen(false);
    setMobileMenu(false);
  }, [location]);

  const logout = () => {
    logoutUser();
    navigate("/user-login");
  };

  const navItems = [
    { name: "Dashboard", path: "/user-Dashboard/dashboard-user", icon: FaHome, desc: "Overview" },
    { name: "Bookings", path: "/user-Dashboard/bookings", icon: FaCalendarCheck, desc: "Reservations" },
    { name: "Halls", path: "/user-Dashboard/halls", icon: FaHome, desc: "Venues" },
    { name: "Settings", path: "/user-Dashboard/settings", icon: FaCog, desc: "Account" }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile Overlay */}
      {mobileMenu && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileMenu(false)} />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center animate-bounce">
              <span className="text-white font-bold">V</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-purple-600">Venuta</h1>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-2">
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200
                  ${isActive(item.path)
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                  } animate-pulse
                `}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <Icon className="text-lg" />
                <div>
                  <span className="font-medium">{item.name}</span>
                  <p className="text-xs opacity-60">{item.desc}</p>
                </div>
                {isActive(item.path) && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-ping" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            <span>{darkMode ? 'Light' : 'Dark'} Mode</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className={`
          bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30
          backdrop-blur-sm transition-all duration-200
        `}>
          <div className="flex items-center justify-between p-4">
            {/* Left */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {sidebarOpen ? <FaTimes /> : <FaBars />}
              </button>
              <h1 className="text-xl font-semibold animate-fade-in">
                {navItems.find(item => isActive(item.path))?.name || 'Dashboard'}
              </h1>
            </div>

            {/* Right */}
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                <FaBell className="animate-bounce" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <FaUser className="text-white text-sm" />
                  </div>
                  <span className="hidden sm:block">{user?.name || 'User'}</span>
                  <FaChevronDown className={`transition-transform ${userOpen ? 'rotate-180' : ''}`} />
                </button>

                {userOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 animate-slide-down">
                    <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg">
                      Profile
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenu(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 p-3 rounded-lg
                    ${isActive(item.path) ? 'bg-purple-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                  `}
                >
                  <Icon />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        <main className="p-6">
          <div className={`
            bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700
            p-6 animate-fade-in-up transition-all duration-300 hover:shadow-md
          `}>
            <Outlet />
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .dark .animate-fade-in { animation: fade-in 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default UserDashboardLayout;