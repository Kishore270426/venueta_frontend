import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import { FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaUsers, FaBed, FaInfoCircle } from "react-icons/fa";
import BASE_URL from '../../config';
import { calculatePrice } from "./priceCalculator";

const BookingPage = () => {
  const { state } = useLocation();
  const hall = state?.hall;
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    user_name: user?.userName || "",
    user_email: "",
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
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, message: "", isSuccess: false });

  if (!hall) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-700">No hall details available. Please go back and select a hall.</p>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateFields = () => {
    const requiredFields = [
      "user_name",
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

    if (parseInt(formData.maximum_people_coming) > hall.total_hall_capacity) {
      throw new Error(`Maximum people cannot exceed hall capacity of ${hall.total_hall_capacity}.`);
    }

    if (parseInt(formData.no_of_rooms_booked) > hall.number_of_rooms) {
      throw new Error(`Rooms booked cannot exceed available ${hall.number_of_rooms} rooms.`);
    }
  };

  const calculateTotalPrice = () => {
    try {
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
      setShowConfirmButton(true);
      setError("");
    } catch (err) {
      setError(err.message);
      setTotalPrice(0);
      setShowConfirmButton(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      validateFields();
      
      const formattedStartTime = formData.full_day_slot ? "00:00:00" : `${formData.start_time}:00`;
      const formattedEndTime = formData.full_day_slot ? "00:00:00" : `${formData.end_time}:00`;

      const bookingData = {
        hall_id: hall.id,
        admin_id: hall.admin_id,
        user_id: user?.userId,
        user_name: formData.user_name,
        user_email: user.user_email,
        function_start_date: formData.function_start_date,
        function_end_date: formData.function_end_date,
        function_type: formData.function_type,
        minimum_people_coming: parseInt(formData.minimum_people_coming),
        maximum_people_coming: parseInt(formData.maximum_people_coming),
        no_of_rooms_booked: parseInt(formData.no_of_rooms_booked),
        additional_details: formData.additional_details,
        total_price: totalPrice,
        gst: totalPrice * 0.18, // Assuming 18% GST, adjust as needed
        start_time: formattedStartTime,
        end_time: formattedEndTime,
        full_day_slot: formData.full_day_slot,
      };

      setLoading(true);

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
    } catch (err) {
      console.error(err);
      setModal({
        isOpen: true,
        message: err.response?.data?.detail || "Failed to book the hall. Please try again.",
        isSuccess: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, message: "", isSuccess: false });
    if (modal.isSuccess) {
      navigate("/user-Dashboard/dashboard-user");
    }
  };

  return (
    <div className="min-h-screen sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold">Booking Details</h1>
          <p className="mt-2 text-sm sm:text-base">Fill out the form to book your event at {hall.hall_name}.</p>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            {/* Pricing cards remain the same */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm sm:text-base">Price Per Day</p>
              <p className="text-lg sm:text-xl font-semibold">₹{hall.hall_price_per_day.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm sm:text-base">Maintenance Charge Per Day</p>
              <p className="text-lg sm:text-xl font-semibold">₹{hall.maintenance_charge_per_day.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm sm:text-base">Cleaning Charge Per Day</p>
              <p className="text-lg sm:text-xl font-semibold">₹{hall.cleaning_charge_per_day.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="user_name"
                    value={user?.userName}
                    onChange={handleInputChange}
                    required
                    disabled
                    className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    
                    name="user_email"
                    value={user?.user_email}
                    onChange={handleInputChange}
                    required
                    disabled
                    className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Function Type</label>
                <div className="relative">
                  <select
                    name="function_type"
                    value={formData.function_type}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  >
                    <option value="">Select Function Type</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Baby Shower">Baby Shower</option>
                    <option value="Festival Celebration">Festival Celebration</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Reunion">Reunion</option>
                    <option value="Conference">Conference</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Retirement Party">Retirement Party</option>
                    <option value="Charity Event">Charity Event</option>
                    <option value="Product Launch">Product Launch</option>
                    <option value="Award Ceremony">Award Ceremony</option>
                    <option value="Cocktail Party">Cocktail Party</option>
                    <option value="Trade Show">Trade Show</option>
                    <option value="Team Building Event">Team Building Event</option>
                    <option value="Networking Event">Networking Event</option>
                    <option value="Exhibition">Exhibition</option>
                    <option value="Farewell Party">Farewell Party</option>
                    <option value="Cultural Event">Cultural Event</option>
                    <option value="Book Launch">Book Launch</option>
                    <option value="Photo Shoot">Photo Shoot</option>
                    <option value="Film Screening">Film Screening</option>
                    <option value="Musical Concert">Musical Concert</option>
                    <option value="Stand-up Comedy">Stand-up Comedy</option>
                    <option value="School Reunion">School Reunion</option>
                    <option value="Graduation Party">Graduation Party</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Start Date</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    name="function_start_date"
                    value={formData.function_start_date}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">End Date</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    name="function_end_date"
                    value={formData.function_end_date}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="flex items-center mt-4 sm:mt-6">
                <input
                  type="checkbox"
                  name="full_day_slot"
                  checked={formData.full_day_slot}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label className="text-gray-700 font-semibold text-sm sm:text-base">Full Day Slot</label>
              </div>

              {!formData.full_day_slot && (
                <>
                  <div className="relative">
                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Start Time</label>
                    <div className="relative">
                      <FaClock className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleInputChange}
                        required={!formData.full_day_slot}
                        className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">End Time</label>
                    <div className="relative">
                      <FaClock className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleInputChange}
                        required={!formData.full_day_slot}
                        className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Minimum People Coming</label>
                <div className="relative">
                  <FaUsers className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    name="minimum_people_coming"
                    value={formData.minimum_people_coming}
                    onChange={(e) => {
                      const value = Math.max(0, e.target.value);
                      setFormData({ ...formData, minimum_people_coming: value });
                    }}
                    min="1"
                    required
                    className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Maximum People Coming</label>
                <div className="relative">
                  <FaUsers className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    name="maximum_people_coming"
                    value={formData.maximum_people_coming}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setFormData({ ...formData, maximum_people_coming: value });
                      }
                    }}
                    required
                    className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Number of Rooms Booked</label>
                <div className="relative">
                  <FaBed className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="number"
                    name="no_of_rooms_booked"
                    value={formData.no_of_rooms_booked}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Additional Details</label>
                <div className="relative">
                  <FaInfoCircle className="absolute left-3 top-3 text-gray-400" />
                  <textarea
                    name="additional_details"
                    value={formData.additional_details}
                    onChange={handleInputChange}
                    className="w-full pl-10 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  ></textarea>
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-center text-sm sm:text-base">{error}</p>}

            {totalPrice > 0 && (
              <div className="text-center">
                <p className="text-gray-700 font-semibold text-sm sm:text-base">
                  Total Price: ₹{totalPrice.toLocaleString('en-IN')}
                </p>
              </div>
            )}

            <div className="text-center flex flex-col sm:flex-row gap-4 justify-center">
              {!showConfirmButton ? (
                <button
                  type="button"
                  onClick={calculateTotalPrice}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-600 transition duration-300 text-sm sm:text-base"
                >
                  Show Price
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-600 transition duration-300 text-sm sm:text-base"
                  disabled={loading}
                >
                  {loading ? "Booking..." : "Confirm Booking"}
                </button>
              )}
              <button
                type="button"
                onClick={() => navigate(-1)} // Go back to previous page
                className="w-full sm:w-auto bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition duration-300 text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal Implementation */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-center mb-4">
              {modal.isSuccess ? (
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <h2 className="text-xl font-bold text-center mb-4">
              {modal.isSuccess ? "Booking Successful" : "Booking Failed"}
            </h2>
            <p className="text-gray-600 text-center mb-6">{modal.message}</p>
            <div className="flex justify-center">
              <button
                onClick={closeModal}
                className={`px-6 py-2 rounded-lg font-semibold text-white transition duration-300 ${
                  modal.isSuccess
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;