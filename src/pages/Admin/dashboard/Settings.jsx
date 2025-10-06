import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaSave } from 'react-icons/fa';
import { useAdminContext } from "../AdminContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../config'; // Adjust path as needed

const SettingsPage = () => {
  const { adminData } = useAdminContext();

  // State for Profile Form
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobile: ''
  });

  // State for Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);

  // Fetch current admin data on mount
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/profile`, {
          headers: { Authorization: `Bearer ${adminData.access_token}` },
        });
        const { name, email, mobile } = response.data;
        setProfileData({ name, email, mobile });
      } catch (error) {
        console.error("Error fetching admin data:", error);
       
      }
    };
    fetchAdminData();
  }, [adminData.access_token]);

  // Handle Profile Input Change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Password Input Change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Update Profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileData.name || !profileData.email || !profileData.mobile) {
      toast.error("Please fill in all profile fields.");
      return;
    }
    if (!/^\d{10}$/.test(profileData.mobile)) {
      toast.error("Mobile number must be 10 digits.");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${BASE_URL}/admin/profile/update`,
        {
          name: profileData.name,
          email: profileData.email,
          mobile: profileData.mobile
        },
        {
          headers: { Authorization: `Bearer ${adminData.access_token}` },
        }
      );
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // Update Password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${BASE_URL}/admin/password/update`,
        {
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${adminData.access_token}` },
        }
      );
      toast.success("Password updated successfully!");
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b ">
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 py-14 shadow-xl">
        <h1 className="text-5xl font-extrabold text-white text-center tracking-tight">Settings</h1>
        <p className="text-lg text-white text-center mt-2">Manage your profile and security</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
          {/* Profile Update Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaUser className="text-indigo-600" /> Update Profile
            </h2>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input
                  type="text"
                  name="mobile"
                  value={profileData.mobile}
                  onChange={handleProfileChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                  placeholder="Enter your 10-digit mobile number"
                  maxLength="10"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-5 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FaSave /> {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>

          {/* Password Update Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaLock className="text-indigo-600" /> Update Password
            </h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
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
                <FaSave /> {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
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

export default SettingsPage;