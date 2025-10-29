import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaUserShield, FaArrowRight, FaHeadset } from "react-icons/fa";

const LoginOptionsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-200 via-purple-400 to-purple-800 px-4 py-8">
      {/* Desktop: Full-screen elegant layout */}
      <div className="hidden lg:flex w-full max-w-7xl mx-auto items-center justify-between space-x-12">
        
        {/* Left: Brand Section - Desktop Only */}
        <div className="flex-1 max-w-2xl space-y-8 text-white">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30">
                <span className="text-3xl font-bold text-white">VV</span>
              </div>
              <h1 className="text-5xl font-bold text-white">
                Venuta
              </h1>
            </div>
            <p className="text-2xl font-light text-white/90 leading-relaxed">
              Enterprise Management Platform
            </p>
            <p className="text-lg text-white/80 leading-relaxed max-w-lg">
              Streamline your operations with our comprehensive suite of tools. 
              Secure, scalable, and designed for modern businesses.
            </p>
          </div>

          {/* Feature Points - Desktop Only */}
          <div className="grid grid-cols-2 gap-6 pt-8">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white/90">Secure Authentication</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white/90">Real-time Analytics</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white/90">Multi-platform Support</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white/90">24/7 Monitoring</span>
            </div>
          </div>
        </div>

        {/* Right: Login Cards - Desktop Enhanced */}
        <div className="flex-1 max-w-md">
          <div className="bg-white/95 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full space-y-10 border border-white/20">
            {/* Header Section */}
            <div className="space-y-6">
              <div className="lg:hidden inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-lg mb-2">
                <span className="text-2xl font-bold text-white">VV</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 text-center">
                Welcome to <span className="text-transparent bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text">Venuta</span>
              </h1>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                Select your login type to access your personalized dashboard
              </p>
            </div>

            {/* Login Cards */}
            <div className="space-y-6">
              {/* User Login Card */}
              <div 
                onClick={() => navigate("/user-login")}
                className="group p-6 bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer hover:border-purple-300 hover:from-purple-100 hover:to-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 group-hover:bg-purple-200 rounded-xl transition-all duration-300 group-hover:scale-110">
                      <FaUserAlt className="text-xl text-purple-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800 text-lg">User Login</h3>
                      <p className="text-sm text-gray-600">Access your personal account</p>
                    </div>
                  </div>
                  <FaArrowRight className="text-purple-500 group-hover:translate-x-2 transition-transform duration-300 text-lg" />
                </div>
              </div>

              {/* Admin Login Card */}
              <div 
                onClick={() => navigate("/admin-login")}
                className="group p-6 bg-gradient-to-br from-purple-100 to-white border border-purple-200 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer hover:border-purple-400 hover:from-purple-200 hover:to-white"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-200 group-hover:bg-purple-300 rounded-xl transition-all duration-300 group-hover:scale-110">
                      <FaUserShield className="text-xl text-purple-700" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800 text-lg">Admin Login</h3>
                      <p className="text-sm text-gray-600">Manage system administration</p>
                    </div>
                  </div>
                  <FaArrowRight className="text-purple-700 group-hover:translate-x-2 transition-transform duration-300 text-lg" />
                </div>
              </div>
            </div>

            {/* Support Section */}
            <div className="pt-6 border-t border-gray-200">
              <div className="inline-flex items-center space-x-3 text-gray-500 hover:text-purple-700 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 group-hover:bg-purple-100 rounded-lg transition-colors duration-300">
                  <FaHeadset className="text-sm group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-sm font-medium">Need assistance? Contact Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: App-like Design */}
      <div className="lg:hidden w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full space-y-10 border border-white/20">
          {/* Header Section - Mobile */}
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-lg">
                <span className="text-2xl font-bold text-white">VV</span>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800">
                  Welcome to <span className="text-transparent bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text">Venuta</span>
                </h1>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Select your login type to continue
                </p>
              </div>
            </div>
          </div>

          {/* Login Cards - Mobile Optimized */}
          <div className="space-y-5">
            {/* User Login Card */}
            <div 
              onClick={() => navigate("/user-login")}
              className="group p-5 bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl shadow-lg active:scale-[0.98] active:shadow-md transition-all duration-200 cursor-pointer active:border-purple-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
                    <FaUserAlt className="text-xl text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800 text-lg">User Login</h3>
                    <p className="text-sm text-gray-600">Personal account</p>
                  </div>
                </div>
                <FaArrowRight className="text-purple-500 text-lg" />
              </div>
            </div>

            {/* Admin Login Card */}
            <div 
              onClick={() => navigate("/admin-login")}
              className="group p-5 bg-gradient-to-br from-purple-100 to-white border border-purple-200 rounded-2xl shadow-lg active:scale-[0.98] active:shadow-md transition-all duration-200 cursor-pointer active:border-purple-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-200 rounded-xl">
                    <FaUserShield className="text-xl text-purple-700" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800 text-lg">Admin Login</h3>
                    <p className="text-sm text-gray-600">System administration</p>
                  </div>
                </div>
                <FaArrowRight className="text-purple-700 text-lg" />
              </div>
            </div>
          </div>

          {/* Support Section - Mobile */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-3 text-gray-500 active:text-purple-700 transition-colors duration-200 cursor-pointer">
              <FaHeadset className="text-sm" />
              <span className="text-sm font-medium">Contact Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOptionsPage;