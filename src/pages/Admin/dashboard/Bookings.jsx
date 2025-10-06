import React, { useEffect, useState } from "react";
import { useAdminContext } from "../AdminContext";
import axios from "axios";
import { FaUser, FaEnvelope, FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaClock, FaSpinner, FaMoneyBill, FaStickyNote } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../config';
import NoBookingsMessage from './NoBookingsMessage';

const BookingList = () => {
  const { adminData } = useAdminContext();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingStates, setUpdatingStates] = useState({});
  const [toastId, setToastId] = useState(null);
  const [filters, setFilters] = useState({
    Approved: true,
    Pending: true,
    Rejected: true,
  });

  // Fetch Bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/admin/bookings`, {
        headers: { Authorization: `Bearer ${adminData.access_token}` },
      });
      setBookings(response.data);
      const initialUpdatingStates = response.data.reduce((acc, booking) => {
        acc[booking.id] = { Approved: false, Rejected: false, Pending: false };
        return acc;
      }, {});
      setUpdatingStates(initialUpdatingStates);
      applyFilters(response.data, filters);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update Booking Status
  const updateStatus = async (id, newStatus) => {
    setUpdatingStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], [newStatus]: true },
    }));
    try {
      await axios.put(
        `${BASE_URL}/admin/bookings/updatestatus`,
        { id, status: newStatus },
        { headers: { Authorization: `Bearer ${adminData.access_token}` } }
      );
      await fetchBookings();
      if (!toast.isActive(toastId)) {
        setToastId(toast.success(`Status updated to ${newStatus} successfully!`, { toastId: `update-success-${id}` }));
      }
    } catch (error) {
      console.error("Error updating status:", error);
      if (!toast.isActive(toastId)) {
        setToastId(toast.error("Failed to update status. Please try again.", { toastId: `update-error-${id}` }));
      }
    } finally {
      setUpdatingStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], [newStatus]: false },
      }));
    }
  };

  // Apply Filters
  const applyFilters = (bookingList, filterState) => {
    const filtered = bookingList.filter(
      (booking) =>
        (filterState.Approved && booking.status === "Approved") ||
        (filterState.Pending && booking.status === "Pending") ||
        (filterState.Rejected && booking.status === "Rejected")
    );
    setFilteredBookings(filtered);
  };

  // Handle Filter Change
  const handleFilterChange = (status) => {
    const newFilters = { ...filters, [status]: !filters[status] };
    setFilters(newFilters);
    applyFilters(bookings, newFilters);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 py-16 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Booking Dashboard
          </h1>
          <p className="mt-2 text-lg text-white opacity-80">Manage and review all bookings efficiently</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Filter Bookings</h2>
          <div className="flex flex-col sm:flex-row justify-start gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.Approved}
                onChange={() => handleFilterChange("Approved")}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="flex items-center gap-2 text-gray-800 font-medium">
                <FaCheckCircle className="text-green-600" /> Approved
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.Pending}
                onChange={() => handleFilterChange("Pending")}
                className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"
              />
              <span className="flex items-center gap-2 text-gray-800 font-medium">
                <FaClock className="text-yellow-600" /> Pending
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.Rejected}
                onChange={() => handleFilterChange("Rejected")}
                className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-2 focus:ring-red-500"
              />
              <span className="flex items-center gap-2 text-gray-800 font-medium">
                <FaTimesCircle className="text-red-600" /> Rejected
              </span>
            </label>
          </div>
        </div>

        {/* Booking List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="text-5xl text-indigo-600 animate-spin" />
            <span className="ml-3 text-lg text-gray-600">Loading bookings...</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <NoBookingsMessage />
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <FaUser className="text-indigo-600" /> {booking.user_name}
                    </h2>
                    <span
                      className={`px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                        booking.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status === "Approved" && <FaCheckCircle />}
                      {booking.status === "Rejected" && <FaTimesCircle />}
                      {booking.status === "Pending" && <FaClock />}
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-5 space-y-4 text-gray-700">
                  <p className="flex items-center gap-3">
                    <FaEnvelope className="text-indigo-600 flex-shrink-0" />
                    <span className="font-medium">Email:</span>
                    <span className="truncate">{booking.user_email}</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <FaCalendarAlt className="text-indigo-600" />
                    <span className="font-medium">Hall ID:</span> {booking.hall_id}
                  </p>
                  <p className="flex items-center gap-3 flex-wrap">
                    <FaCalendarAlt className="text-indigo-600" />
                    <span className="font-medium">Dates:</span>
                    {booking.function_start_date}
                    {booking.function_start_date !== booking.function_end_date &&
                      ` - ${booking.function_end_date}`}
                  </p>
                  {!booking.full_day_slot && (
                    <p className="flex items-center gap-3">
                      <FaClock className="text-indigo-600" />
                      <span className="font-medium">Time:</span>
                      {booking.start_time} - {booking.end_time}
                    </p>
                  )}
                  <p className="flex items-center gap-3">
                    <FaClock className="text-indigo-600" />
                    <span className="font-medium">Slot:</span>
                    {booking.full_day_slot ? "Full Day" : "Partial"}
                  </p>
                  <p className="flex items-center gap-3 flex-wrap">
                    <FaMoneyBill className="text-indigo-600" />
                    <span className="font-medium">Price:</span> ₹
                    {booking.total_price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                    <span className="text-sm text-gray-500 ml-2">+{booking.gst}% GST</span>
                  </p>
                  {booking.additional_details && (
                    <p className="flex items-center gap-3 flex-wrap">
                      <FaStickyNote className="text-indigo-600" />
                      <span className="font-medium">Notes:</span>
                      <span className="truncate">{booking.additional_details}</span>
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap justify-end gap-4">
                  {booking.status !== "Rejected" && booking.status !== "Approved" && (
                    <button
                      onClick={() => updateStatus(booking.id, "Approved")}
                      disabled={updatingStates[booking.id]?.Approved}
                      className={`px-5 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors duration-200 shadow-md ${
                        updatingStates[booking.id]?.Approved
                          ? "bg-green-600 text-white opacity-70 cursor-not-allowed"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {updatingStates[booking.id]?.Approved ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaCheckCircle />
                      )}
                      Approve
                    </button>
                  )}
                  {booking.status !== "Rejected" && booking.status !== "Approved" && (
                    <button
                      onClick={() => updateStatus(booking.id, "Rejected")}
                      disabled={updatingStates[booking.id]?.Rejected}
                      className={`px-5 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors duration-200 shadow-md ${
                        updatingStates[booking.id]?.Rejected
                          ? "bg-red-600 text-white opacity-70 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      {updatingStates[booking.id]?.Rejected ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        <FaTimesCircle />
                      )}
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Toast Container */}
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
        className="mt-20"
      />
    </div>
  );
};

export default BookingList;