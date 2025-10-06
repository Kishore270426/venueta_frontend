import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaLock, FaPhone, FaSave } from 'react-icons/fa';
import { useContext } from "react";
import { UserContext } from "../../Context/UserContext"; // Adjust path as needed
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../config'; // Adjust path as needed

const UserSettings = () => {
  const { user } = useContext(UserContext);

  // State for User Settings Form
  const [settingsData, setSettingsData] = useState({
    phone_number: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  // Fetch current user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/api/profile`, {
          headers: { Authorization: `Bearer ${user.userAccessToken}` },
        });
        const { phone_number } = response.data;
        setSettingsData(prev => ({ ...prev, phone_number: phone_number || '' }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    if (user.userAccessToken) {
      fetchUserData();
    }
  }, [user.userAccessToken]);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettingsData(prev => ({ ...prev, [name]: value }));
  };

  // Update User Settings
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validation
    if (settingsData.password || settingsData.confirmPassword) {
      if (!settingsData.password || !settingsData.confirmPassword) {
        toast.error("Please fill in both password fields.");
        return;
      }
      if (settingsData.password !== settingsData.confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
      if (settingsData.password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
      }
    }
    if (settingsData.phone_number && !/^\d{10}$/.test(settingsData.phone_number)) {
      toast.error("Phone number must be 10 digits.");
      return;
    }

    setLoading(true);
    try {
      const updateData = {};
      if (settingsData.password) updateData.password = settingsData.password;
      if (settingsData.phone_number) updateData.phone_number = settingsData.phone_number;

      await axios.patch(
        `${BASE_URL}/user/update_user`,
        updateData,
        {
          headers: { Authorization: `Bearer ${user.userAccessToken}` },
        }
      );
      toast.success("Settings updated successfully!");
      setSettingsData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b">
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 py-14 shadow-xl">
        <h1 className="text-5xl font-extrabold text-white text-center tracking-tight">User Settings</h1>
        <p className="text-lg text-white text-center mt-2">Manage your account details</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaLock className="text-indigo-600" /> Update Settings
          </h2>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                value={settingsData.phone_number}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                placeholder="Enter your 10-digit phone number"
                maxLength="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                name="password"
                value={settingsData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={settingsData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                placeholder="Confirm new password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-5 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FaSave /> {loading ? "Updating..." : "Update Settings"}
            </button>
          </form>
        </div>
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

export default UserSettings;