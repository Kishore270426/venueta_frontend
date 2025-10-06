import React, { useContext } from "react";
import { FaSignOutAlt, FaExclamationTriangle } from 'react-icons/fa';
import { UserContext } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";

const UserLogoutPage = () => {
  const { logoutUser } = useContext(UserContext); // Use UserContext instead of AdminContext
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = () => {
    logoutUser(); // Clear user context and localStorage
    setTimeout(() => {
      navigate("/"); // Redirect to user login page after a short delay
    }, 1000); // 1-second delay for smoother transition
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center transform transition-all duration-300 hover:shadow-xl">
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <FaExclamationTriangle className="text-yellow-500 text-4xl" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Confirm Logout
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8 text-sm md:text-base">
          Are you sure you want to log out? You’ll need to log in again to access your dashboard.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <FaSignOutAlt /> Yes, Logout
          </button>
          <button
            onClick={() => navigate("/user-Dashboard")}
            className="w-full sm:w-auto bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserLogoutPage;