import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaArrowRight, FaStar, FaGem, FaUserShield, FaHeadset, FaLock, FaUser, FaPhone, FaMapMarkerAlt, FaCity, FaGlobe } from "react-icons/fa";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import BASE_URL from '../config';

function AdminSignup() {
    const [alertMessage, setAlertMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [googleData, setGoogleData] = useState(null);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone_number: "",
        password: "",
        address: "",
        city: "",
        country: "",
        state: "none"
    });
    const navigate = useNavigate();

    // Google Login
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

                setGoogleData({
                    email: res.data.email,
                    googleId: res.data.id,
                });

                setFormData((prevData) => ({
                    ...prevData,
                    email: res.data.email,
                    username: res.data.name,
                }));

                setAlertMessage({ type: "success", text: "Google authentication successful! Please fill in the remaining details." });
            } catch (error) {
                console.error("Error fetching Google profile:", error);
                setAlertMessage({ type: "error", text: "Google authentication failed. Please try again." });
            }
        },
        onError: (error) => {
            console.error("Google Login Failed:", error);
            setAlertMessage({ type: "error", text: "Google authentication failed. Please try again." });
        },
    });

    // Handle input change for manual form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!googleData) {
            setAlertMessage({ type: "error", text: "Please authenticate with Google first." });
            setLoading(false);
            return;
        }

        const payload = {
            ...googleData,
            ...formData,
        };

        try {
            const response = await fetch(`${BASE_URL}/admin/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                setAlertMessage({ type: "success", text: "Admin registration successful! Redirecting to login..." });

                setTimeout(() => {
                    navigate("/admin-login");
                }, 2000);
            } else {
                setAlertMessage({ type: "error", text: "Registration failed. Please try again." });
            }
        } catch (error) {
            setAlertMessage({ type: "error", text: "An error occurred. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    // Clear alert message after 5 seconds
    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => {
                setAlertMessage(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 text-white overflow-hidden relative">
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
                                    <FaLock className="text-xl text-white" />
                                </div>
                                <div>
                                    <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                        Venuta
                                    </h1>
                                    <p className="text-xl text-white/80 mt-1">
                                        Admin Registration
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-lg text-white/80 leading-relaxed">
                                Join the Vpearl Venuta administration team. Register for admin access 
                                to manage events, venues, and system configurations with enterprise-level control.
                            </p>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 gap-3 pt-4">
                            {[
                                "Complete System Administration",
                                "Event & Venue Management", 
                                "User Analytics & Reporting",
                                "Enterprise-Level Security"
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
                                    <span className="font-medium">Admin Access Required</span>
                                    <p className="text-sm text-white/70">Registration requires approval from system administrators</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION - Signup Form */}
                <div className="flex items-center justify-center p-12 relative z-10">
                    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/20 w-full max-w-md">
                        {/* Form Header */}
                        <div className="text-center space-y-4 mb-8">
                            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg mx-auto">
                                <FaUserShield className="text-xl text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Admin Signup
                                </h2>
                                <p className="text-gray-600 text-sm mt-1">
                                    Register for administrative access
                                </p>
                            </div>
                        </div>

                        {/* Google Auth Section */}
                        {!googleData && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <p className="text-gray-600 text-sm mb-4">
                                        Start by authenticating with Google
                                    </p>
                                    <button
                                        onClick={googleLogin}
                                        className="w-full py-3.5 border border-gray-300 rounded-2xl shadow-sm flex items-center justify-center space-x-3 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-white"
                                    >
                                        <FaGoogle className="text-red-500 text-lg" />
                                        <span className="text-gray-700 font-medium">Continue with Google</span>
                                    </button>
                                </div>

                                <div className="text-center text-xs text-gray-500">
                                    <p>You'll complete your profile after authentication</p>
                                </div>
                            </div>
                        )}

                        {/* Registration Form (Visible after Google Auth) */}
                        {googleData && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email (Pre-filled from Google) */}
                                <div className="relative">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 bg-gray-50 text-gray-600 placeholder-gray-500 cursor-not-allowed"
                                        placeholder="Email address"
                                        required
                                        disabled
                                    />
                                    <div className="absolute right-3 top-3 text-green-500">
                                        ✓
                                    </div>
                                </div>

                                {/* Username */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 bg-white text-gray-800 placeholder-gray-500"
                                        placeholder="Full name"
                                        required
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 bg-white text-gray-800 placeholder-gray-500"
                                        placeholder="Phone number"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 bg-white text-gray-800 placeholder-gray-500"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 bg-white text-gray-800 placeholder-gray-500"
                                        placeholder="Street address"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* City */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 bg-white text-gray-800 placeholder-gray-500"
                                            placeholder="City"
                                            required
                                        />
                                    </div>

                                    {/* Country */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 bg-white text-gray-800 placeholder-gray-500"
                                            placeholder="Country"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-gradient-to-br from-blue-500 to-blue-700 border border-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2 mt-4"
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

                        {/* Additional Links */}
                        <div className="text-center space-y-3 mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                                Already have an admin account?{" "}
                                <a
                                    href="#"
                                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate("/admin-login");
                                    }}
                                >
                                    Sign in here
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
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FaUserShield className="text-lg text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Admin Signup</h2>
                                    <p className="text-xs text-gray-600 mt-1">Register for admin access</p>
                                </div>
                            </div>
                        </div>

                        {/* Google Auth Section - Mobile */}
                        {!googleData && (
                            <div className="space-y-4">
                                <p className="text-gray-600 text-sm text-center">
                                    Start by authenticating with Google
                                </p>
                                <button
                                    onClick={googleLogin}
                                    className="w-full py-3 border border-gray-300 rounded-xl flex items-center justify-center space-x-2 active:scale-[0.98] transition-all duration-300 bg-white"
                                >
                                    <FaGoogle className="text-red-500" />
                                    <span className="text-gray-700 font-medium text-sm">Continue with Google</span>
                                </button>
                            </div>
                        )}

                        {/* Registration Form - Mobile */}
                        {googleData && (
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-600 placeholder-gray-500 cursor-not-allowed"
                                    placeholder="Email"
                                    required
                                    disabled
                                />

                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
                                    placeholder="Full name"
                                    required
                                />

                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
                                    placeholder="Phone number"
                                    required
                                />

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
                                    placeholder="Password"
                                    required
                                />

                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
                                    placeholder="Address"
                                    required
                                />

                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
                                        placeholder="City"
                                        required
                                    />

                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
                                        placeholder="Country"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold rounded-xl shadow-lg active:scale-[0.98] transition-all duration-300 mt-2"
                                    disabled={loading}
                                >
                                    {loading ? "Creating Account..." : "Complete Registration"}
                                </button>
                            </form>
                        )}

                        {/* Alert Message - Mobile */}
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

                        {/* Additional Links - Mobile */}
                        <div className="text-center space-y-2 mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-600">
                                Already have an account?{" "}
                                <a 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); navigate("/admin-login"); }} 
                                    className="text-blue-600 font-medium"
                                >
                                    Sign in
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Mobile Brand Footer */}
                    <div className="text-center mt-6">
                        <p className="text-white/70 text-sm">Vpearl Venuta Admin Registration</p>
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

export default AdminSignup;