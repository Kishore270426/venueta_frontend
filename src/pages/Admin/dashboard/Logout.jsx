import React from "react";
import { FaSignOutAlt } from 'react-icons/fa';
import { useAdminContext } from "../AdminContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LogoutPage = () => {
  const { logout } = useAdminContext();
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    logout(); // Clear admin context and localStorage
    toast.success("Logged out successfully!");
    
    navigate("/"); // Redirect to login page after a short delay
    
  };

  return (
    <div className="min-h-screen  flex items-center justify-center py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Logout</h1>
        <p className="text-gray-600 mb-8">Are you sure you want to log out?</p>
        <button
          onClick={handleLogout}
          className="w-full px-6 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
      />
    </div>
  );
};

export default LogoutPage;