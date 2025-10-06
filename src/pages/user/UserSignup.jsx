import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 px-4">
      <div className="bg-white p-6 sm:p-10 md:p-12 rounded-2xl shadow-2xl w-full max-w-md text-center space-y-8">
        <h2 className="text-3xl font-bold text-gray-800">Sign Up with Google</h2>

        {!formData.email ? (
          <button
            onClick={googleLogin}
            className="w-full py-3 border border-gray-300 rounded-lg shadow-md flex items-center justify-center space-x-3 hover:shadow-lg transition duration-300"
          >
            <FaGoogle className="text-red-500 text-2xl" />
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="email" value={formData.email} />
            <input type="hidden" name="googleId" value={formData.googleId} />
            <input type="hidden" name="name" value={formData.name} />

            <div className="flex flex-col space-y-2 text-left">
              <label className="text-gray-600 font-medium">Mobile Number</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your mobile number"
                required
              />
            </div>
            
            <div className="flex flex-col space-y-2 text-left">
              <label className="text-gray-600 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
                required
              />
            </div>
            
            <div className="flex flex-col space-y-2 text-left">
              <label className="text-gray-600 font-medium">City</label>
              <input
                type="text"
                name="city_name"
                value={formData.city_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your city"
                required
              />
            </div>
            
            <div className="flex flex-col space-y-2 text-left">
              <label className="text-gray-600 font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your address"
                required
              />
            </div>
            
            
            
            <div className="flex flex-col space-y-2 text-left">
              <label className="text-gray-600 font-medium">Country</label>
              <input
                type="text"
                name="country_name"
                value={formData.country_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your country"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Signing up..." : "Complete Signup"}
            </button>
          </form>
        )}

        {alertMessage && (
          <div className={`mt-4 p-3 text-sm rounded-lg ${alertMessage.type === "error" ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"}`}>{alertMessage.text}</div>
        )}
      </div>
    </div>
  );
};

export default UserSignupPage;
