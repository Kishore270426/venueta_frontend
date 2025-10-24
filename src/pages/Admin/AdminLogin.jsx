import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminContext } from "./AdminContext";
import { FaGoogle, FaArrowRight, FaStar, FaGem, FaUserShield, FaHeadset, FaLock } from "react-icons/fa";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import BASE_URL from '../config';

function AdminLogin() {
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAdminContext, adminData } = useAdminContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    googleId: "",
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              Accept: "application/json",
            },
          }
        );

        const updatedFormData = {
          email: res.data.email,
          googleId: res.data.id,
        };
        setFormData(updatedFormData);
        handleSubmit(updatedFormData);
      } catch (error) {
        console.error("Error fetching Google profile:", error);
        setAlertType('error');
        setAlertMessage("Google login failed.");
      }
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
      setAlertType('error');
      setAlertMessage("Google login failed.");
    },
  });

  useEffect(() => {
    if (adminData.access_token) {
      navigate("/admin-Dashboard/my-halls");
    }
  }, [adminData.access_token, navigate]);

  const handleSubmit = async (submittedData) => {
    setLoading(true);
    const loginData = submittedData.googleId
      ? { email: submittedData.email, googleId: submittedData.googleId }
      : { email: submittedData.email, password: submittedData.password };

    try {
      const response = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        setAdminContext({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          token_type: data.token_type,
          user_id: data.user_id,
          admin_name: data.admin_name,
        });
        localStorage.setItem("access_token", data.access_token);
        setAlertType('success');
        setAlertMessage("Login successful!");
        setTimeout(() => {
          navigate("/admin-Dashboard/my-halls");
          setAlertMessage(null);
        }, 1500);
      } else {
        setAlertType('error');
        setAlertMessage("Invalid email or password!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setAlertType('error');
      setAlertMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-purple-400 to-purple-400 text-white overflow-hidden relative">
      {/* Background Elements */}
      <BackgroundElements />
      
      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="cursor-pointer absolute top-6 left-6 z-20 flex items-center space-x-2 bg-white/20 backdrop-blur-lg border border-white/30 text-white px-4 py-2 rounded-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105"
      >
        <span>←</span>
        <span>Back to Home</span>
      </button>

      {/* DESKTOP VIEW - Grid Layout */}
      <div className="hidden lg:grid grid-cols-2 min-h-screen">
        {/* LEFT SECTION - Content */}
        <div className="flex items-center justify-center p-12 relative z-10">
          <div className="max-w-lg space-y-8 animate-fadeIn">
            {/* Logo and Title */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl">
                  <FaLock className="text-xl text-white" />
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    Venuta
                  </h1>
                  <p className="text-xl text-white/80 mt-1">
                    Admin Portal
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-white/80 leading-relaxed">
                Access the administrative dashboard to manage events, venues, users, 
                and system configurations. Maintain complete control over the Vpearl Venuta platform.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-3 pt-4">
              {[
                "Manage All Event Bookings",
                "Venue & Inventory Control", 
                "User Management & Analytics",
                "System Configuration & Reports"
              ].map((item, index) => (
                <div key={item} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                  <span className="text-white/90">{item}</span>
                </div>
              ))}
            </div>

            {/* Security Notice */}
            <div className="pt-6 border-t border-white/20">
              <div className="inline-flex items-center space-x-3 text-white/80 p-4 rounded-xl bg-white/10">
                <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg">
                  <FaUserShield className="text-lg" />
                </div>
                <div className="text-left">
                  <span className="font-medium">Secure Access</span>
                  <p className="text-sm text-white/70">Restricted to authorized personnel only</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - Login Form */}
        <div className="flex items-center justify-center p-12 relative z-10">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 w-full max-w-md">
            {/* Form Header */}
            <div className="text-center space-y-4 mb-8">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-lg mx-auto">
                <FaUserShield className="text-xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Admin Login
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  System administration access
                </p>
              </div>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="space-y-5"
            >
              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 bg-white text-gray-800 placeholder-gray-500 focus:placeholder-gray-400"
                  placeholder="Enter admin email address"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 bg-white text-gray-800 placeholder-gray-500 focus:placeholder-gray-400"
                  placeholder="Enter admin password"
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-br cursor-pointer from-purple-500 to-purple-700 border border-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Accessing System...</span>
                  </>
                ) : (
                  <>
                    <span>Access Admin Panel</span>
                    <FaArrowRight className="text-sm" />
                  </>
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="flex items-center justify-center space-x-3 my-6">
              <div className="h-px w-20 bg-gray-300 flex-1"></div>
              <span className="text-gray-500 text-xs px-2">OR CONTINUE WITH</span>
              <div className="h-px w-20 bg-gray-300 flex-1"></div>
            </div>

            {/* Google Login */}
            <button
              onClick={googleLogin}
              className="w-full cursor-pointer py-3.5 border border-gray-300 rounded-2xl shadow-sm flex items-center justify-center space-x-3 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-white"
            >
              <FaGoogle className="text-red-500 text-lg" />
              <span className="text-gray-700 font-medium">Google</span>
            </button>

            {/* Alert Message */}
            {alertMessage && (
              <div
                className={`mt-6 p-4 rounded-xl text-sm ${
                  alertType === 'error'
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {alertMessage}
              </div>
            )}

            {/* Additional Links */}
            <div className="text-center space-y-3 mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <a href="/admin-forgotpassword" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                  Forgot your password?
                </a>
              </p>
              <p className="text-sm text-gray-600">
                Need admin access?{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/admin-signup");
                  }}
                >
                  Request access
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE VIEW - Form Only */}
      <div className="lg:hidden min-h-screen flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-sm">
          {/* Mobile Form */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20">
            {/* Mobile Header */}
            <div className="text-center space-y-4 mb-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 border border-purple-600   rounded-2xl flex items-center justify-center shadow-lg">
                  <FaUserShield className="text-lg text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Admin Login</h2>
                  <p className="text-xs text-gray-600 mt-1">System administration access</p>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleFormSubmit}
              className="space-y-4"
            >
              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 bg-white text-gray-800 placeholder-gray-500"
                  placeholder="Admin email address"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 bg-white text-gray-800 placeholder-gray-500"
                  placeholder="Admin password"
                  required
                />
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="cursor-pointer w-full py-3.5 bg-gradient-to-br from-purple-500 to-purple-700 border border-purple-600 text-white font-semibold rounded-xl shadow-lg active:scale-[0.98] transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Accessing System..." : "Access Admin Panel"}
              </button>
            </form>

            {/* OR Divider */}
            <div className="flex items-center justify-center space-x-2 my-4">
              <div className="h-px w-16 bg-gray-300 flex-1"></div>
              <span className="text-gray-500 text-xs px-2">OR</span>
              <div className="h-px w-16 bg-gray-300 flex-1"></div>
            </div>

            {/* Google Login */}
            <button
              onClick={googleLogin}
              className="w-full py-3 border border-gray-300 rounded-xl flex items-center justify-center space-x-2 active:scale-[0.98] transition-all duration-300 bg-white"
            >
              <FaGoogle className="text-red-500" />
              <span className="text-gray-700 font-medium text-sm">Sign in with Google</span>
            </button>

            {/* Alert Message */}
            {alertMessage && (
              <div
                className={`mt-4 p-3 rounded-lg text-sm ${
                  alertType === 'error' 
                    ? "bg-red-50 text-red-700 border border-red-200" 
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {alertMessage}
              </div>
            )}

            {/* Additional Links */}
            <div className="text-center space-y-2 mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                <a href="#" className="text-blue-600 font-medium">Forgot password?</a>
              </p>
              <p className="text-xs text-gray-600">
                Need access?{" "}
                <a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); navigate("/admin-signup"); }} 
                  className="text-blue-600 font-medium"
                >
                  Request admin access
                </a>
              </p>
            </div>
          </div>

          {/* Mobile Brand Footer */}
          <div className="text-center mt-6">
            <p className="text-white/70 text-sm">Vpearl Venuta Admin Portal</p>
          </div>
        </div>
      </div>

      <CustomStyles />
    </div>
  );
}

// Background Elements Component
const BackgroundElements = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse-slower"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/5 rounded-full blur-3xl animate-pulse-delayed"></div>
    
    <div className="absolute top-20 left-10 animate-float">
      <FaStar className="text-blue-300/30 text-xl" />
    </div>
    <div className="absolute top-40 right-20 animate-float-delayed">
      <FaGem className="text-blue-200/40 text-lg" />
    </div>
    <div className="absolute bottom-32 left-20 animate-float-slow">
      <FaStar className="text-blue-300/20 text-lg" />
    </div>
  </div>
);

// Custom Styles Component
const CustomStyles = () => (
  <style jsx>{`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    @keyframes float-delayed {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(5deg); }
    }
    @keyframes float-slow {
      0%, 100% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-10px) scale(1.05); }
    }
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.1; }
      50% { opacity: 0.2; }
    }
    @keyframes pulse-slower {
      0%, 100% { opacity: 0.05; }
      50% { opacity: 0.15; }
    }
    @keyframes pulse-delayed {
      0%, 100% { opacity: 0.08; }
      50% { opacity: 0.12; }
    }
    .animate-fadeIn {
      animation: fadeIn 0.8s ease-out forwards;
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    .animate-float-delayed {
      animation: float-delayed 8s ease-in-out infinite;
    }
    .animate-float-slow {
      animation: float-slow 10s ease-in-out infinite;
    }
    .animate-pulse-slow {
      animation: pulse-slow 8s ease-in-out infinite;
    }
    .animate-pulse-slower {
      animation: pulse-slower 12s ease-in-out infinite;
    }
    .animate-pulse-delayed {
      animation: pulse-delayed 10s ease-in-out infinite;
    }
  `}</style>
);

export default AdminLogin;