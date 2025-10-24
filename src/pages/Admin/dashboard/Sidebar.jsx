import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAdminContext } from "../AdminContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAdminContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const menuItems = [
    { name: "My Halls", path: "my-halls", icon: <FaHome /> },
    { name: "Bookings", path: "Admin-Bookings", icon: <FaUser /> },
    { name: "Invoice", path: "invoice", icon: <FaChartBar /> },
    { name: "Subscriptions", path: "subscriptions", icon: <FaCog /> },
    // 👇 Add logout here so it shows with other menu items
    {
      name: "Logout",
      action: handleLogout,
      icon: <FaSignOutAlt />,
      isButton: true,
    },
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
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Venuta
          </h2>

          {/* Menu Items */}
          <ul className="space-y-4">
            {menuItems.map((item) => (
              <li key={item.name}>
                {item.isButton ? (
                  <button
                    onClick={item.action}
                    className="flex items-center space-x-3 w-full p-3 rounded-lg transition duration-300 hover:bg-gray-100 text-gray-700 text-left"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 p-3 rounded-lg transition duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                          : "hover:bg-gray-100 text-gray-700"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <div className="md:hidden fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full shadow-lg focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </button>
      </div>

      {/* Toast */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Sidebar;
