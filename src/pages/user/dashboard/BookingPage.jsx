import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaEnvelope, 
  FaUsers, 
  FaBed, 
  FaInfoCircle, 
  FaCheck, 
  FaTimes,
  FaCalculator,
  FaArrowRight,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPhone,
  FaStar,
  FaCheckCircle
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import BASE_URL from '../../config';
import { calculatePrice } from "./priceCalculator";

const BookingPage = () => {
  const { state } = useLocation();
  const hall = state?.hall;
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    user_name: user?.userName || "",
    user_email: user?.user_email || "",
    function_start_date: "",
    function_end_date: "",
    function_type: "",
    minimum_people_coming: "",
    maximum_people_coming: "",
    no_of_rooms_booked: "",
    additional_details: "",
    start_time: "",
    end_time: "",
    full_day_slot: false,
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, message: "", isSuccess: false });

  if (!hall) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center border border-white/20"
        >
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur">
            <FaTimes className="text-red-400 text-3xl" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">No Hall Selected</h2>
          <p className="text-gray-300 mb-8">Please select a venue to continue with your booking.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Browse Venues
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (error) setError("");
  };

  const validateFields = () => {
    const requiredFields = [
      "function_type",
      "function_start_date",
      "function_end_date",
      "minimum_people_coming",
      "maximum_people_coming",
      "no_of_rooms_booked",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        throw new Error(`Please fill out the ${field.replace(/_/g, " ")} field.`);
      }
    }

    if (new Date(formData.function_start_date) > new Date(formData.function_end_date)) {
      throw new Error("Start date cannot be after end date.");
    }

    if (!formData.full_day_slot && (!formData.start_time || !formData.end_time)) {
      throw new Error("Please provide start and end times for partial day booking.");
    }

    if (parseInt(formData.maximum_people_coming) > hall.total_hall_capacity) {
      throw new Error(`Maximum guests cannot exceed hall capacity of ${hall.total_hall_capacity}.`);
    }

    if (parseInt(formData.no_of_rooms_booked) > hall.number_of_rooms) {
      throw new Error(`Rooms required cannot exceed available ${hall.number_of_rooms} rooms.`);
    }

    if (parseInt(formData.minimum_people_coming) >= parseInt(formData.maximum_people_coming)) {
      throw new Error("Minimum guests must be less than maximum guests.");
    }
  };

  const calculateTotalPrice = async () => {
    try {
      setError("");
      validateFields();
      
      const price = calculatePrice({
        function_start_date: formData.function_start_date,
        function_end_date: formData.function_end_date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        full_day_slot: formData.full_day_slot,
        hall_price_per_day: hall.hall_price_per_day,
      });
      
      setTotalPrice(price);
      setStep(2);
    } catch (err) {
      setError(err.message);
      setTotalPrice(0);
    }
  };

  const confirmBooking = async () => {
    try {
      setBookingLoading(true);
      setError("");
      
      const formattedStartTime = formData.full_day_slot ? "00:00:00" : `${formData.start_time}:00`;
      const formattedEndTime = formData.full_day_slot ? "00:00:00" : `${formData.end_time}:00`;

      const bookingData = {
        hall_id: hall.id,
        admin_id: hall.admin_id,
        user_id: user?.userId,
        user_name: formData.user_name,
        user_email: formData.user_email,
        function_start_date: formData.function_start_date,
        function_end_date: formData.function_end_date,
        function_type: formData.function_type,
        minimum_people_coming: parseInt(formData.minimum_people_coming),
        maximum_people_coming: parseInt(formData.maximum_people_coming),
        no_of_rooms_booked: parseInt(formData.no_of_rooms_booked),
        additional_details: formData.additional_details,
        total_price: totalPrice,
        gst: totalPrice * 0.18,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        full_day_slot: formData.full_day_slot,
      };

      const response = await axios.post(
        `${BASE_URL}/hall/user/book_hall`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${user?.userAccessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setModal({
        isOpen: true,
        message: response.data.message || "Hall booked successfully!",
        isSuccess: true,
      });
      setStep(3);
    } catch (err) {
      console.error(err);
      setModal({
        isOpen: true,
        message: err.response?.data?.detail || "Failed to book the hall. Please try again.",
        isSuccess: false,
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, message: "", isSuccess: false });
    if (modal.isSuccess) {
      navigate("/user-Dashboard/dashboard-user");
    }
  };

  const goBackToForm = () => setStep(1);
  const goToConfirm = () => setStep(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft />
              <span className="hidden sm:inline font-medium">Back to Venues</span>
            </motion.button>
            
            <div className="text-center flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {hall.hall_name}
              </h1>
              <p className="text-sm text-gray-600 mt-1 hidden sm:block">Complete your reservation</p>
            </div>

            <div className="w-20 sm:w-32"></div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 md:mb-12"
        >
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 md:p-6 border border-white/50">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full hidden sm:block">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Steps */}
              {[
                { num: 1, label: 'Details', icon: FaInfoCircle },
                { num: 2, label: 'Review', icon: FaCalculator },
                { num: 3, label: 'Confirm', icon: FaCheckCircle }
              ].map((s, i) => (
                <div key={s.num} className="flex flex-col items-center relative z-10 flex-1">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 mb-2 ${
                      step > s.num 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg' 
                        : step === s.num 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg animate-pulse' 
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step > s.num ? <FaCheck className="text-lg" /> : <s.icon className="text-sm md:text-base" />}
                  </motion.div>
                  <span className={`text-xs md:text-sm font-semibold transition-colors ${
                    step >= s.num ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Sidebar - Venue Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Venue Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/50">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h3 className="text-xl md:text-2xl font-bold mb-2">Venue Details</h3>
                <p className="text-blue-100 text-sm">Everything you need to know</p>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaUsers className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Capacity</p>
                    <p className="text-lg font-bold text-gray-900">{hall.total_hall_capacity} Guests</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaBed className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Rooms Available</p>
                    <p className="text-lg font-bold text-gray-900">{hall.number_of_rooms} Rooms</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaCalculator className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Price Per Day</p>
                    <p className="text-lg font-bold text-green-600">₹{hall.hall_price_per_day.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-yellow-200/50 hidden lg:block">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                  <FaInfoCircle className="text-white" />
                </div>
                <h4 className="font-bold text-gray-900">Booking Info</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>Full day slot: 10 AM - 10 PM</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>18% GST applies on total amount</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-2">•</span>
                  <span>Instant booking confirmation</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-white/50"
                >
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Event Information</h2>
                    <p className="text-gray-600">Tell us about your special occasion</p>
                  </div>

                  <div className="space-y-6">
                    {/* Event Type */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        What type of event are you planning? *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['Wedding', 'Birthday', 'Corporate Event', 'Conference', 'Engagement', 'Other'].map(type => (
                          <motion.button
                            key={type}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData({...formData, function_type: type})}
                            className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                              formData.function_type === type
                                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 text-purple-700 shadow-lg'
                                : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                            }`}
                          >
                            {type}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Date Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                          <FaCalendarAlt className="mr-2 text-blue-500" />
                          Start Date *
                        </label>
                        <input
                          type="date"
                          name="function_start_date"
                          value={formData.function_start_date}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                          <FaCalendarAlt className="mr-2 text-purple-500" />
                          End Date *
                        </label>
                        <input
                          type="date"
                          name="function_end_date"
                          value={formData.function_end_date}
                          onChange={handleInputChange}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-white"
                        />
                      </div>
                    </div>

                    {/* Full Day Slot */}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200"
                    >
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="full_day_slot"
                          checked={formData.full_day_slot}
                          onChange={handleInputChange}
                          className="w-6 h-6 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <div>
                          <span className="text-base font-bold text-gray-900">Full Day Booking</span>
                          <p className="text-sm text-gray-600">10:00 AM - 10:00 PM</p>
                        </div>
                      </label>
                    </motion.div>

                    {/* Time Selection */}
                    {!formData.full_day_slot && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                            <FaClock className="mr-2 text-green-500" />
                            Start Time *
                          </label>
                          <input
                            type="time"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleInputChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                            <FaClock className="mr-2 text-orange-500" />
                            End Time *
                          </label>
                          <input
                            type="time"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleInputChange}
                            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-white"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Guest Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                          <FaUsers className="mr-2 text-blue-500" />
                          Minimum Guests *
                        </label>
                        <input
                          type="number"
                          name="minimum_people_coming"
                          value={formData.minimum_people_coming}
                          onChange={(e) => {
                            const value = Math.max(0, parseInt(e.target.value) || 0);
                            setFormData({ ...formData, minimum_people_coming: value });
                          }}
                          placeholder="Expected minimum"
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                          <FaUsers className="mr-2 text-purple-500" />
                          Maximum Guests *
                        </label>
                        <input
                          type="number"
                          name="maximum_people_coming"
                          value={formData.maximum_people_coming}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || "";
                            if (value <= hall.total_hall_capacity) {
                              setFormData({ ...formData, maximum_people_coming: value });
                            }
                          }}
                          max={hall.total_hall_capacity}
                          placeholder={`Max: ${hall.total_hall_capacity}`}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-white"
                        />
                      </div>
                    </div>

                    {/* Rooms */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
                        <FaBed className="mr-2 text-indigo-500" />
                        Number of Rooms Required *
                      </label>
                      <input
                        type="number"
                        name="no_of_rooms_booked"
                        value={formData.no_of_rooms_booked}
                        onChange={(e) => {
                          const value = Math.min(parseInt(e.target.value) || 0, hall.number_of_rooms);
                          setFormData({ ...formData, no_of_rooms_booked: value });
                        }}
                        max={hall.number_of_rooms}
                        placeholder={`Available: ${hall.number_of_rooms}`}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all bg-white"
                      />
                    </div>

                    {/* Additional Details */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        Additional Requirements
                      </label>
                      <textarea
                        name="additional_details"
                        value={formData.additional_details}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Special requests, catering preferences, decoration needs, etc."
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none bg-white"
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
                      >
                        <div className="flex items-center">
                          <FaTimes className="text-red-500 mr-3" />
                          <p className="text-red-700 font-medium">{error}</p>
                        </div>
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(-1)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all"
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={calculateTotalPrice}
                        className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all"
                      >
                        <FaArrowRight className="inline mr-2" />
                        Continue to Review
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-white/50"
                >
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.6 }}
                      className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                    >
                      <FaCheck className="text-white text-3xl" />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Review Your Booking</h2>
                    <p className="text-gray-600">Please verify all details before proceeding</p>
                  </div>

                  {/* Booking Summary Cards */}
                  <div className="space-y-6 mb-8">
                    {/* Event Details Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <FaInfoCircle className="text-white text-sm" />
                        </div>
                        Event Details
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Event Type</p>
                          <p className="font-bold text-gray-900">{formData.function_type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Booking Period</p>
                          <p className="font-bold text-gray-900">
                            {formData.full_day_slot ? 'Full Day' : 'Partial Day'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Start Date</p>
                          <p className="font-bold text-gray-900">{new Date(formData.function_start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">End Date</p>
                          <p className="font-bold text-gray-900">{new Date(formData.function_end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        {!formData.full_day_slot && (
                          <>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Start Time</p>
                              <p className="font-bold text-gray-900">{formData.start_time}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">End Time</p>
                              <p className="font-bold text-gray-900">{formData.end_time}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Guest & Rooms Card */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                          <FaUsers className="text-white text-sm" />
                        </div>
                        Guest Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Min Guests</p>
                          <p className="font-bold text-gray-900">{formData.minimum_people_coming}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Max Guests</p>
                          <p className="font-bold text-gray-900">{formData.maximum_people_coming}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Rooms</p>
                          <p className="font-bold text-gray-900">{formData.no_of_rooms_booked}</p>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown Card */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-300 shadow-lg">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                          <FaCalculator className="text-white text-sm" />
                        </div>
                        Price Breakdown
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-3 border-b border-green-200">
                          <span className="text-gray-700">Base Price</span>
                          <span className="font-bold text-gray-900">₹{totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-green-200">
                          <span className="text-gray-700">GST (18%)</span>
                          <span className="font-bold text-gray-900">₹{(totalPrice * 0.18).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-xl font-bold text-gray-900">Total Amount</span>
                          <span className="text-3xl font-bold text-green-600">
                            ₹{(totalPrice * 1.18).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={goBackToForm}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all"
                    >
                      <FaArrowLeft className="inline mr-2" />
                      Edit Details
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={goToConfirm}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all"
                    >
                      Proceed to Confirm
                      <FaArrowRight className="inline ml-2" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-white/50"
                >
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", duration: 0.8 }}
                      className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl"
                    >
                      <FaCheckCircle className="text-white text-3xl" />
                    </motion.div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Final Confirmation</h2>
                    <p className="text-gray-600">One last step to secure your booking</p>
                  </div>

                  {/* Final Summary */}
                  <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 md:p-8 mb-8 border-2 border-purple-300 shadow-inner">
                    <div className="text-center mb-6">
                      <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Total Booking Amount</p>
                      <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                      >
                        ₹{(totalPrice * 1.18).toLocaleString('en-IN')}
                      </motion.div>
                      <p className="text-sm text-gray-600 mt-2">Including 18% GST</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-white/50 rounded-xl p-3 text-center">
                        <FaCalendarAlt className="text-blue-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-600">Event</p>
                        <p className="font-bold text-sm text-gray-900">{formData.function_type}</p>
                      </div>
                      <div className="bg-white/50 rounded-xl p-3 text-center">
                        <FaUsers className="text-purple-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-600">Guests</p>
                        <p className="font-bold text-sm text-gray-900">{formData.maximum_people_coming}</p>
                      </div>
                      <div className="bg-white/50 rounded-xl p-3 text-center">
                        <FaBed className="text-pink-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-600">Rooms</p>
                        <p className="font-bold text-sm text-gray-900">{formData.no_of_rooms_booked}</p>
                      </div>
                      <div className="bg-white/50 rounded-xl p-3 text-center">
                        <FaClock className="text-green-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-600">Duration</p>
                        <p className="font-bold text-sm text-gray-900">
                          {Math.ceil((new Date(formData.function_end_date) - new Date(formData.function_start_date)) / (1000 * 60 * 60 * 24)) + 1} Days
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Important Notice */}
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-8">
                    <div className="flex items-start">
                      <FaInfoCircle className="text-yellow-600 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-yellow-900 mb-1">Important Information</h4>
                        <p className="text-sm text-yellow-800">
                          By confirming this booking, you agree to the venue's terms and conditions. 
                          You will receive a confirmation email with all booking details.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={confirmBooking}
                      disabled={bookingLoading}
                      className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-bold py-5 px-8 rounded-xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      {bookingLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin h-6 w-6 mr-3 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing Your Booking...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <FaCheck className="mr-2" />
                          Confirm & Complete Booking
                        </span>
                      )}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={goBackToForm}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition-all"
                    >
                      <FaArrowLeft className="inline mr-2" />
                      Back to Edit
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Success/Error Modal */}
      <AnimatePresence>
        {modal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  modal.isSuccess 
                    ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                    : 'bg-gradient-to-br from-red-400 to-rose-500'
                }`}
              >
                {modal.isSuccess ? (
                  <FaCheckCircle className="text-white text-5xl" />
                ) : (
                  <FaTimes className="text-white text-5xl" />
                )}
              </motion.div>

              <h2 className={`text-2xl md:text-3xl font-bold text-center mb-4 ${
                modal.isSuccess ? 'text-green-600' : 'text-red-600'
              }`}>
                {modal.isSuccess ? 'Booking Confirmed!' : 'Booking Failed'}
              </h2>

              <p className="text-gray-600 text-center mb-8 leading-relaxed">
                {modal.message}
              </p>

              {modal.isSuccess && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 border border-green-200">
                  <p className="text-sm text-green-800 text-center">
                    <FaEnvelope className="inline mr-2" />
                    A confirmation email has been sent to your registered email address.
                  </p>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeModal}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all ${
                  modal.isSuccess 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                    : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700'
                }`}
              >
                {modal.isSuccess ? (
                  <>
                    <FaCheckCircle className="inline mr-2" />
                    Go to Dashboard
                  </>
                ) : (
                  <>
                    <FaArrowLeft className="inline mr-2" />
                    Try Again
                  </>
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingPage;