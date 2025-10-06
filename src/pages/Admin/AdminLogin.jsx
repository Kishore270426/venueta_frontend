import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminContext } from "./AdminContext";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import BASE_URL from '../config';

function AdminLogin() {
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(''); // 'success' or 'error'
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

  const closeAlert = () => {
    setAlertMessage(null);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 px-4">
      {/* Login Form - Hidden when alert is active */}
      <div className={`${alertMessage ? 'hidden' : 'block'} bg-white p-6 sm:p-10 md:p-12 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg text-center space-y-8 transition-all duration-300`}>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
          Admin Login to <span className="text-blue-500">VpearlVenuta</span>
        </h2>

        <form onSubmit={handleFormSubmit} className="space-y-6">
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

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex items-center justify-center space-x-2">
          <div className="h-px w-24 bg-gray-300"></div>
          <span className="text-gray-500">OR</span>
          <div className="h-px w-24 bg-gray-300"></div>
        </div>

        <button
          onClick={googleLogin}
          className="w-full py-3 border border-gray-300 rounded-lg shadow-md flex items-center justify-center space-x-3 hover:shadow-lg transition duration-300"
        >
          <FaGoogle className="text-red-500 text-2xl" />
          <span className="text-gray-700 font-medium">Sign in with Google</span>
        </button>

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
              onClick={() => navigate("/admin-signup")}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* Professional Modal Alert with Full Black Background */}
      {alertMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black opacity-93 ">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full text-center space-y-4 transform transition-all duration-300 scale-100 hover:scale-105">
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                alertType === 'success'
                  ? 'bg-gradient-to-r from-green-400 to-green-500'
                  : 'bg-gradient-to-r from-red-400 to-red-500'
              }`}
            >
              {alertType === 'success' ? (
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </div>
            <p
              className={`text-lg font-semibold ${
                alertType === 'success' ? 'text-gray-800' : 'text-gray-800'
              }`}
            >
              {alertMessage}
            </p>
            <button
              onClick={closeAlert}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLogin;