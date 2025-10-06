import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaUserShield } from "react-icons/fa";

const LoginOptionsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 px-4">
      <div className="bg-white p-6 sm:p-10 md:p-12 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg text-center space-y-8 transition-all duration-300">
        {/* Header Section */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Welcome to <span className="text-blue-500">VpearlVenuta</span>
        </h2>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          Choose your login type to get started. Whether you are a user or an
          admin, we have the right tools for you to manage your experiences.
        </p>

        {/* Login Buttons */}
        <div className="space-y-5">
          {/* User Login */}
          <button
            onClick={() => navigate("/user-login")}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 flex items-center justify-center space-x-3"
          >
            <FaUserAlt className="text-2xl" />
            <span className="text-lg">User Login</span>
          </button>

          {/* Admin Login */}
          <button
            onClick={() => navigate("/admin-login")}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 flex items-center justify-center space-x-3"
          >
            <FaUserShield className="text-2xl" />
            <span className="text-lg">Admin Login</span>
          </button>
        </div>

        {/* Additional Information */}
        <div className="mt-6 text-gray-500 text-sm">
          <p>
            Need help?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginOptionsPage;
