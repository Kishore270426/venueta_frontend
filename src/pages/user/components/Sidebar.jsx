// components/Sidebar.js
import React from 'react';
import {
  FaHome,
  FaCalendarAlt,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaBuilding
} from 'react-icons/fa';

const Sidebar = ({ user, mobile, onClose }) => {
  const menuItems = [
    { name: 'Dashboard', href: '#dashboard', icon: FaHome },
    { name: 'Browse Halls', href: '#halls', icon: FaBuilding },
    { name: 'My Bookings', href: '#bookings', icon: FaCalendarAlt },
    { name: 'Booking History', href: '#history', icon: FaHistory },
    { name: 'Settings', href: '#settings', icon: FaCog },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Sidebar header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700">
            <span className="text-lg font-bold text-white">VV</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Venuta</h1>
            <p className="text-xs text-gray-500">User Portal</p>
          </div>
        </div>

        {mobile && (
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        )}
      </div>



      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className="group flex items-center rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
            >
              <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-purple-500" />
              {item.name}
            </a>
          );
        })}
      </nav>

      {/* Logout button */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}
          className="group flex w-full items-center rounded-lg px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
        >
          <FaSignOutAlt className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;