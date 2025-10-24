import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaArrowRight, FaStar, FaGem, FaUserPlus, FaHeadset } from "react-icons/fa";
import BASE_URL from "../config";

const UserSignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    googleId: "",
    phone_number: "",
    password: "",
    city_name: "",
    address: "",
    country_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const { data } = await axios.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              Accept: "application/json",
            },
          }
        );
        
        setFormData((prev) => ({
          ...prev,
          email: data.email,
          username: data.name,
          googleId: data.id,
        }));
      } catch (error) {
        console.error("Google authentication failed:", error);
        setAlertMessage({ type: "error", text: "Google login failed. Try again." });
      }
    },
    onError: (error) => console.error("Google Login Failed:", error),
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertMessage(null);

    try {
      const response = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error("Signup failed. Try again.");
      
      setAlertMessage({ type: "success", text: "Signup successful! Redirecting..." });
      setTimeout(() => navigate("/user-Dashboard/dashboard-user"), 2000);
    } catch (error) {
      setAlertMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-900 text-white overflow-hidden relative">
      {/* Background Elements */}
      <BackgroundElements />
      
      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 bg-white/20 backdrop-blur-lg border border-white/30 text-white px-4 py-2 rounded-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105"
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
                  <span className="text-2xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">VV</span>
                </div>
                <div>
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Venuta
                  </h1>
                  <p className="text-xl text-white/80 mt-1">
                    Join Our Community
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-white/80 leading-relaxed">
                Create your account and unlock access to exclusive venues, personalized event recommendations, 
                and seamless booking experiences with Vpearl Venuta.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-3 pt-4">
              {[
                "Exclusive Venue Access",
                "Personalized Event Recommendations", 
                "Quick & Easy Booking",
                "24/7 Customer Support",
                "Manage All Your Events"
              ].map((item, index) => (
                <div key={item} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                  <span className="text-white/90">{item}</span>
                </div>
              ))}
            </div>

            {/* Support Section */}
            <div className="pt-6 border-t border-white/20">
              <div className="inline-flex items-center space-x-3 text-white/80 p-4 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg transition-colors duration-300">
                  <FaHeadset className="text-lg group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-left">
                  <span className="font-medium">Need help signing up?</span>
                  <p className="text-sm text-white/70">Our team is here to assist you</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - Registration Form */}
        <div className="flex items-center justify-center p-12 relative z-10">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 w-full max-w-md">
            {/* Form Header */}
            <div className="text-center space-y-4 mb-8">
              <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-lg mx-auto">
                <FaUserPlus className="text-xl text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {formData.email ? "Complete Registration" : "Create Account"}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {formData.email 
                    ? "Fill in your details to complete registration" 
                    : "Start your journey with us"
                  }
                </p>
              </div>
            </div>

            {!formData.email ? (
              // Google Signup Button
              <div className="space-y-6">
                <button
                  onClick={googleLogin}
                  className="w-full py-4 border border-gray-300 rounded-2xl shadow-sm flex items-center justify-center space-x-3 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-white"
                >
                  <FaGoogle className="text-red-500 text-lg" />
                  <span className="text-gray-700 font-medium">Sign up with Google</span>
                </button>

                {/* OR Divider */}
                <div className="flex items-center justify-center space-x-3 my-6">
                  <div className="h-px w-20 bg-gray-300 flex-1"></div>
                  <span className="text-gray-500 text-xs px-2">OR</span>
                  <div className="h-px w-20 bg-gray-300 flex-1"></div>
                </div>

                {/* Manual Signup Option */}
                <button
                  onClick={() => setFormData(prev => ({ ...prev, email: "manual" }))}
                  className="w-full py-3.5 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center space-x-2 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
                >
                  <span className="text-gray-600 font-medium">Sign up with Email</span>
                </button>

                {/* Login Redirect */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <a
                      href="#"
                      className="text-purple-600 hover:text-purple-700 font-medium hover:underline transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/user-login");
                      }}
                    >
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              // Registration Form
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Hidden Google Data */}
                <input type="hidden" name="email" value={formData.email} />
                <input type="hidden" name="googleId" value={formData.googleId} />
                <input type="hidden" name="username" value={formData.username} />

                {/* Full Name */}
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 bg-white text-gray-800 placeholder-gray-500"
                    placeholder="Full name"
                    required
                  />
                </div>

                {/* Email (readonly if from Google) */}
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 bg-gray-50 text-gray-600 cursor-not-allowed"
                    placeholder="Email address"
                    readOnly
                  />
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 bg-white text-gray-800 placeholder-gray-500"
                    placeholder="Mobile number"
                    required
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 bg-white text-gray-800 placeholder-gray-500"
                    placeholder="Create password"
                    required
                  />
                </div>

                {/* Address */}
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 bg-white text-gray-800 placeholder-gray-500"
                    placeholder="Street address"
                    required
                  />
                </div>

                {/* City & Country Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="city_name"
                      value={formData.city_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 bg-white text-gray-800 placeholder-gray-500"
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="country_name"
                      value={formData.country_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 bg-white text-gray-800 placeholder-gray-500"
                      placeholder="Country"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-br from-purple-500 to-purple-700 border border-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <FaArrowRight className="text-sm" />
                    </>
                  )}
                </button>

                {/* Back to Signup Options */}
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, email: "", googleId: "" }))}
                  className="w-full py-3 text-gray-600 hover:text-gray-700 font-medium text-sm transition-colors duration-300"
                >
                  ← Back to signup options
                </button>
              </form>
            )}

            {/* Alert Message */}
            {alertMessage && (
              <div
                className={`mt-6 p-4 rounded-xl text-sm ${
                  alertMessage.type === "error"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {alertMessage.text}
              </div>
            )}
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
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaUserPlus className="text-lg text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {formData.email ? "Complete Signup" : "Create Account"}
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">
                    {formData.email ? "Fill in your details" : "Join our community"}
                  </p>
                </div>
              </div>
            </div>

            {!formData.email ? (
              // Mobile Google Signup
              <div className="space-y-4">
                <button
                  onClick={googleLogin}
                  className="w-full py-3.5 border border-gray-300 rounded-xl flex items-center justify-center space-x-2 active:scale-[0.98] transition-all duration-300 bg-white"
                >
                  <FaGoogle className="text-red-500" />
                  <span className="text-gray-700 font-medium text-sm">Sign up with Google</span>
                </button>

                <div className="flex items-center justify-center space-x-2 my-4">
                  <div className="h-px w-16 bg-gray-300 flex-1"></div>
                  <span className="text-gray-500 text-xs px-2">OR</span>
                  <div className="h-px w-16 bg-gray-300 flex-1"></div>
                </div>

                <button
                  onClick={() => setFormData(prev => ({ ...prev, email: "manual" }))}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 text-sm active:scale-[0.98] transition-all"
                >
                  Sign up with Email
                </button>

                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    Have an account?{" "}
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); navigate("/user-login"); }} 
                      className="text-purple-600 font-medium"
                    >
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            ) : (
              // Mobile Registration Form
              <form onSubmit={handleSubmit} className="space-y-3">
                <input type="hidden" name="email" value={formData.email} />
                <input type="hidden" name="googleId" value={formData.googleId} />

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 placeholder-gray-500"
                  placeholder="Full name"
                  required
                />

                <input
                  type="email"
                  value={formData.email}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                  placeholder="Email"
                  readOnly
                />

                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 placeholder-gray-500"
                  placeholder="Mobile number"
                  required
                />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 placeholder-gray-500"
                  placeholder="Password"
                  required
                />

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 placeholder-gray-500"
                  placeholder="Address"
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="city_name"
                    value={formData.city_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 placeholder-gray-500"
                    placeholder="City"
                    required
                  />
                  <input
                    type="text"
                    name="country_name"
                    value={formData.country_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-800 placeholder-gray-500"
                    placeholder="Country"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-br from-purple-500 to-purple-700 text-white font-semibold rounded-xl shadow-lg active:scale-[0.98] transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Complete Signup"}
                </button>

                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, email: "", googleId: "" }))}
                  className="w-full py-2 text-gray-600 text-xs transition-colors"
                >
                  ← Back
                </button>
              </form>
            )}

            {/* Alert Message */}
            {alertMessage && (
              <div
                className={`mt-4 p-3 rounded-lg text-sm ${
                  alertMessage.type === "error" 
                    ? "bg-red-50 text-red-700 border border-red-200" 
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {alertMessage.text}
              </div>
            )}
          </div>

          {/* Mobile Brand Footer */}
          <div className="text-center mt-6">
            <p className="text-white/70 text-sm">Join Vpearl Venuta Today</p>
          </div>
        </div>
      </div>

      <CustomStyles />
    </div>
  );
};

// Background Elements Component
const BackgroundElements = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse-slower"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-300/5 rounded-full blur-3xl animate-pulse-delayed"></div>
    
    <div className="absolute top-20 left-10 animate-float">
      <FaStar className="text-purple-300/30 text-xl" />
    </div>
    <div className="absolute top-40 right-20 animate-float-delayed">
      <FaGem className="text-purple-200/40 text-lg" />
    </div>
    <div className="absolute bottom-32 left-20 animate-float-slow">
      <FaStar className="text-purple-300/20 text-lg" />
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

export default UserSignupPage;