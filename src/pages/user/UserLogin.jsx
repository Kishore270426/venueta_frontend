import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { FaGoogle } from "react-icons/fa";
import BASE_URL from "../config";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

const UserLoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const userAccessToken = localStorage.getItem("user_access_token");

    if (userId && userAccessToken) {
      navigate("/user-Dashboard/dashboard-user");
    }
  }, [navigate]);

  // Handle Google Login
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

        // Proceed with login
        handleSubmit({ email: data.email, googleId: data.id });
      } catch (error) {
        console.error("Error fetching Google profile:", error);
        setAlertMessage({ type: "error", text: "Google login failed. Try again." });
      }
    },
    onError: (error) => console.error("Google Login Failed:", error),
  });

  // Handle Form Submission
  const handleSubmit = async (data) => {
    setLoading(true);
    setAlertMessage(null);

    try {
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const userData = await response.json();
      localStorage.setItem("user_id", userData.user_id);
      localStorage.setItem("user_email", userData.user_email);
      localStorage.setItem("user_name", userData.user_name);
      localStorage.setItem("user_access_token", userData.user_access_token);

      loginUser(userData.user_name, userData.user_access_token, userData.user_id,userData.user_email);
      setAlertMessage({ type: "success", text: "Login successful!" });

      setTimeout(() => navigate("/user-Dashboard/dashboard-user"), 2000);
    } catch (error) {
      setAlertMessage({ type: "error", text: error.message || "Login failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 px-4">
      <div className="bg-white p-6 sm:p-10 md:p-12 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg text-center space-y-8 transition-all duration-300">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
          User Login to <span className="text-blue-500">VpearlVenuta</span>
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(formData);
          }}
          className="space-y-6"
        >
          {/* Email */}
          <div className="flex flex-col space-y-2 text-left">
            <label className="text-gray-600 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-2 text-left">
            <label className="text-gray-600 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center justify-center space-x-2">
          <div className="h-px w-24 bg-gray-300"></div>
          <span className="text-gray-500">OR</span>
          <div className="h-px w-24 bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={googleLogin}
          className="w-full py-3 border border-gray-300 rounded-lg shadow-md flex items-center justify-center space-x-3 hover:shadow-lg transition duration-300"
        >
          <FaGoogle className="text-red-500 text-2xl" />
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button>

        {/* Alert Message */}
        {alertMessage && (
          <div
            className={`mt-4 p-3 text-sm rounded-lg ${
              alertMessage.type === "error"
                ? "bg-red-100 text-red-500"
                : "bg-green-100 text-green-500"
            }`}
          >
            {alertMessage.text}
          </div>
        )}

        {/* Additional Links */}
        <div className="text-sm text-gray-500">
          <p>
            Forgot your password?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Reset here
            </a>
          </p>
          <p>
            Don't have an account?{" "}
            <a
              href="#"
              className="text-blue-600 hover:underline"
              onClick={() => navigate("/user-signup")}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLoginPage;
