import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa"; // Google icon
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import BASE_URL from '../config';

function AdminSignup() {
    const [alertMessage, setAlertMessage] = useState(null);
    const [loading, setLoading] = useState(false); // Loading state
    const [googleData, setGoogleData] = useState(null); // Store Google profile data
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone_number: "",
        password: "",
        address: "",
        city: "",
        country: "",
        state:"none"
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

                // Set Google profile data
                setGoogleData({
                    email: res.data.email,
                    googleId: res.data.id,
                    
                });

                // Pre-fill the email field in the form
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
                setAlertMessage({ type: "success", text: "Signup successful! Redirecting..." });

                // Redirect to login page after a delay
                setTimeout(() => {
                    navigate("/admin-login");
                }, 2000);
            } else {
                setAlertMessage({ type: "error", text: "Signup failed. Please try again." });
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 px-4">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md mx-auto text-center space-y-6 transition-all duration-300">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Admin Signup to <span className="text-blue-500">VpearlVenuta</span>
                </h2>

                {/* Google Login Button */}
                {!googleData && (
                    <button
                        onClick={googleLogin}
                        className="w-full py-2.5 border border-gray-300 rounded-lg shadow-md flex items-center justify-center space-x-3 hover:shadow-lg transition duration-300"
                    >
                        <FaGoogle className="text-red-500 text-xl" />
                        <span className="text-gray-700 font-medium">Sign up with Google</span>
                    </button>
                )}

                {/* Manual Form (Visible after Google Auth) */}
                {googleData && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email (Pre-filled from Google) */}
                        <div className="flex flex-col space-y-1 text-left">
                            <label className="text-gray-600 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                placeholder="Enter your email"
                                required
                                disabled
                            />
                        </div>

                        {/* phone_number Number */}
                        <div className="flex flex-col space-y-1 text-left">
                            <label className="text-gray-600 font-medium">phone_number Number</label>
                            <input
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                placeholder="Enter your phone_number number"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col space-y-1 text-left">
                            <label className="text-gray-600 font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        {/* Address */}
                        <div className="flex flex-col space-y-1 text-left">
                            <label className="text-gray-600 font-medium">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                placeholder="Enter your address"
                                required
                            />
                        </div>

                        {/* City */}
                        <div className="flex flex-col space-y-1 text-left">
                            <label className="text-gray-600 font-medium">City</label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                placeholder="Enter your city"
                                required
                            />
                        </div>

                        {/* Country */}
                        <div className="flex flex-col space-y-1 text-left">
                            <label className="text-gray-600 font-medium">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                                placeholder="Enter your country"
                                required
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
                            disabled={loading}
                        >
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>
                    </form>
                )}

                {/* Alert Message */}
                {alertMessage && (
                    <div
                        className={`mt-4 p-3 text-sm rounded-lg ${alertMessage.type === "error"
                                ? "bg-red-100 text-red-500"
                                : "bg-green-100 text-green-500"
                            }`}
                    >
                        {alertMessage.text}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminSignup;