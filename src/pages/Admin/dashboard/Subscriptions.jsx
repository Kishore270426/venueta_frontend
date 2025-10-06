import React from "react";
import axios from "axios";
import { FaCheck, FaGift, FaCrown, FaCheckCircle } from 'react-icons/fa';
import { useAdminContext } from "../AdminContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../config';
const SubscriptionPage = () => {
  const { adminData } = useAdminContext();
  const navigate = useNavigate();

  // Pricing in INR
  const annualPrice = 10000; // ₹10,000 for 1 year
  const trialPrice = 0; // Free trial for 1 month

  const plans = [
    { name: "1 Month Free Trial", price: trialPrice, duration: "30_days", offer: "Completely Free", isFreeTrial: true },
    { name: "1 Year", price: annualPrice, duration: "12_months", offer: "Best Value!" },
  ];

  // Handle Payment with Razorpay
  const handlePayment = async (amount, plan) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/create_order/`, 
        { amount: amount }, 
        { 
          headers: { Authorization: `Bearer ${adminData.access_token}` },
        }
      );

      const { order_id, currency } = response.data;

      const options = {
        key: "rzp_test_OWMIbAgJMlXJSy",
        amount: amount * 100, // Convert INR to paise
        currency,
        name: "ShadowHaven",
        description: `Subscription Plan: ${plan.name}`,
        order_id,
        handler: async function (response) {
          const verifyResponse = await axios.post(`${BASE_URL}/api/verify_payment`, {
            order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            plan: plan.duration,
            admin_id: adminData.user_id,
          }, {
            headers: { Authorization: `Bearer ${adminData.access_token}` },
          });

          if (verifyResponse.data.status === "success") {
            toast.success("Payment successful! Subscription activated.");
            navigate("/admin-dashboard/dashboard-admin");
          } else {
            toast.error("Payment verification failed.");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Failed to initiate payment.");
    }
  };

  // Handle Free Trial Registration
  const handleFreeTrial = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/trial/register_free_trial`, {
        admin_id: adminData.user_id,
      }, {
        headers: { Authorization: `Bearer ${adminData.access_token}` },
      });

      if (response.data.status === "success") {
        toast.success("Free trial activated!");
        navigate("/admin-Dashboard/subscriptions");
      } else {
        toast.error("Free trial registration failed.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.detail;
        if (errorMessage === "Free trial already used") {
          toast.error("You have already used your free trial.");
        } else {
          toast.error("Failed to register free trial.");
        }
      } else {
        toast.error("Failed to register free trial.");
      }
      console.error("Free Trial Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b py-2">
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 py-14 shadow-xl">
        <h1 className="text-5xl font-extrabold text-white text-center tracking-tight underline-offset-8">Subscription Plans</h1>
        <p className="text-lg text-white text-center mt-2">Choose the perfect plan for your needs</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
          {/* 1 Month Free Trial */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:shadow-xl border-2 border-indigo-500 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">Free Trial</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1 Month Trial</h2>
            <p className="text-4xl font-extrabold text-indigo-600 mb-6">₹{trialPrice}<span className="text-lg font-medium">/month</span></p>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-center justify-center gap-2"><FaCheck className="text-green-500" /> Halls visible to public</li>
              <li className="flex items-center justify-center gap-2"><FaCheck className="text-green-500" /> Premium customer support</li>
              <li className="flex items-center justify-center gap-2"><FaCheck className="text-green-500" /> Advanced features</li>
            </ul>
            <button
              onClick={() => handleFreeTrial()}
              className="w-full px-5 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <FaGift /> Start Free Trial
            </button>
          </div>

          {/* 1 Year Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:shadow-xl border-2 border-yellow-500 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">Best Value</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">1 Year</h2>
            <p className="text-4xl font-extrabold text-yellow-600 mb-6">₹{annualPrice.toLocaleString('en-IN')}<span className="text-lg font-medium">/year</span></p>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-center justify-center gap-2"><FaCheck className="text-green-500" /> Halls visible to public</li>
              <li className="flex items-center justify-center gap-2"><FaCheck className="text-green-500" /> Premium customer support</li>
              <li className="flex items-center justify-center gap-2"><FaCheck className="text-green-500" /> Advanced features</li>
            </ul>
            <button
              onClick={() => handlePayment(annualPrice, plans[1])}
              className="w-full px-5 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <FaCrown /> Subscribe Now
            </button>
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

export default SubscriptionPage;