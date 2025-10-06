import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaUser, FaChartBar, FaCog, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard-User', path: 'dashboard-user', icon: <FaHome /> },
    
    // { name: 'Invoice', path: 'invoice', icon: <FaChartBar /> },
    { name: ' Booking Status', path: 'my-booking-status', icon: <FaCog /> },
    { name: 'Settings', path: 'usersettings', icon: <FaCog /> },
    { name: 'Logout', path: 'user-logout', icon: <FaSignOutAlt /> },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 min-h-screen w-64 bg-white shadow-xl transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:flex md:w-64 z-50`}
      >
        <div className="p-5 h-full flex flex-col">
          {/* Sidebar Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            VpearlVenuta
          </h2>

          {/* Menu Items */}
          <ul className="space-y-4 flex-grow">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-3 rounded-lg transition duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                        : "hover:bg-gray-100 text-gray-700"
                    }`
                  }
                  onClick={() => setIsOpen(false)} // Close sidebar on mobile after clicking
                >
                  {item.icon}
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bottom Positioned Hamburger Button for Mobile */}
      <div className="md:hidden fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full shadow-lg focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </button>
      </div>
    </>
  );
};

export default Sidebar;
