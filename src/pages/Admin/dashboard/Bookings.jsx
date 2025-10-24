import React, { useEffect, useState } from "react";
import { useAdminContext } from "../AdminContext";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSpinner,
  FaMoneyBill,
  FaStickyNote,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BASE_URL from "../../config";
import NoBookingsMessage from "./NoBookingsMessage";

const BookingList = () => {
  const { adminData } = useAdminContext();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingStates, setUpdatingStates] = useState({});
  const [filters, setFilters] = useState({
    Approved: true,
    Pending: true,
    Rejected: true,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
      toast.error("Failed to load bookings.");
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
      toast.success(`Status updated to ${newStatus}!`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
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
    if (window.innerWidth < 640) setIsFilterOpen(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-12 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Booking Dashboard
          </h1>
          <p className="mt-2 text-base md:text-lg text-white opacity-90">
            Manage all bookings with ease
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800">All Bookings</h2>

          {/* Filter Button (Mobile) + Filters (Desktop) */}
          <div className="flex w-full sm:w-auto">
            {/* Mobile: Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="sm:hidden w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg font-medium shadow-sm hover:bg-gray-50 transition"
            >
              <FaFilter className="text-sm" />
              Filters
              <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                {Object.values(filters).filter(Boolean).length}
              </span>
            </button>

            {/* Desktop: Inline Filters */}
            <div className="hidden sm:flex items-center gap-3 bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-200">
              <span className="text-sm font-medium text-gray-600 mr-2">Show:</span>
              {["Approved", "Pending", "Rejected"].map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={filters[status]}
                    onChange={() => handleFilterChange(status)}
                    className={`w-4 h-4 rounded focus:ring-2 ${
                      status === "Approved"
                        ? "text-green-600 focus:ring-green-500"
                        : status === "Pending"
                        ? "text-yellow-600 focus:ring-yellow-500"
                        : "text-red-600 focus:ring-red-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium flex items-center gap-1 ${
                      status === "Approved"
                        ? "text-green-700"
                        : status === "Pending"
                        ? "text-yellow-700"
                        : "text-red-700"
                    }`}
                  >
                    {status === "Approved" && <FaCheckCircle className="text-xs" />}
                    {status === "Pending" && <FaClock className="text-xs" />}
                    {status === "Rejected" && <FaTimesCircle className="text-xs" />}
                    {status}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaSpinner className="text-5xl text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <NoBookingsMessage />
        ) : (
          /* Booking Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 truncate">
                      <FaUser className="text-indigo-600 flex-shrink-0" />
                      {booking.user_name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap ${
                        booking.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status === "Approved" && <FaCheckCircle className="text-xs" />}
                      {booking.status === "Rejected" && <FaTimesCircle className="text-xs" />}
                      {booking.status === "Pending" && <FaClock className="text-xs" />}
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-5 py-4 space-y-3 flex-grow text-sm text-gray-700">
                  <p className="flex items-start gap-2">
                    <FaEnvelope className="text-indigo-600 mt-0.5 flex-shrink-0" />
                    <span className="truncate">{booking.user_email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-indigo-600 flex-shrink-0" />
                    <span>Hall ID: <strong>{booking.hall_id}</strong></span>
                  </p>
                  <p className="flex items-center gap-2 text-xs">
                    <FaCalendarAlt className="text-indigo-600 flex-shrink-0" />
                    <span>
                      {new Date(booking.function_start_date).toLocaleDateString("en-IN")}
                      {booking.function_start_date !== booking.function_end_date &&
                        ` to ${new Date(booking.function_end_date).toLocaleDateString("en-IN")}`}
                    </span>
                  </p>
                  {!booking.full_day_slot && (
                    <p className="flex items-center gap-2 text-xs">
                      <FaClock className="text-indigo-600 flex-shrink-0" />
                      <span>
                        {booking.start_time} - {booking.end_time}
                      </span>
                    </p>
                  )}
                  <p className="flex items-center gap-2 text-xs">
                    <FaClock className="text-indigo-600 flex-shrink-0" />
                    <span className="font-medium">
                      {booking.full_day_slot ? "Full Day" : "Partial Slot"}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FaMoneyBill className="text-indigo-600 flex-shrink-0" />
                    <span>
                      INR {booking.total_price.toLocaleString("en-IN")}{" "}
                      <span className="text-xs text-gray-500">+{booking.gst}% GST</span>
                    </span>
                  </p>
                  {booking.additional_details && (
                    <p className="flex items-start gap-2 text-xs text-gray-600">
                      <FaStickyNote className="text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{booking.additional_details}</span>
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                {booking.status === "Pending" && (
                  <div className="px-5 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-3 mt-auto">
                    <button
                      onClick={() => updateStatus(booking.id, "Approved")}
                      disabled={updatingStates[booking.id]?.Approved}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm ${
                        updatingStates[booking.id]?.Approved
                          ? "bg-green-500 text-white opacity-70 cursor-not-allowed"
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
                    <button
                      onClick={() => updateStatus(booking.id, "Rejected")}
                      disabled={updatingStates[booking.id]?.Rejected}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm ${
                        updatingStates[booking.id]?.Rejected
                          ? "bg-red-500 text-white opacity-70 cursor-not-allowed"
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
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Mobile Filter Popup */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsFilterOpen(false)}
          />

          {/* Panel */}
          <div className="relative bg-white w-full max-w-md rounded-t-2xl shadow-2xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FaFilter /> Filter Bookings
              </h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              {["Approved", "Pending", "Rejected"].map((status) => (
                <label
                  key={status}
                  className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <span className="flex items-center gap-3 font-medium text-gray-800">
                    {status === "Approved" && <FaCheckCircle className="text-green-600" />}
                    {status === "Pending" && <FaClock className="text-yellow-600" />}
                    {status === "Rejected" && <FaTimesCircle className="text-red-600" />}
                    {status}
                  </span>
                  <input
                    type="checkbox"
                    checked={filters[status]}
                    onChange={() => handleFilterChange(status)}
                    className={`w-5 h-5 rounded focus:ring-2 ${
                      status === "Approved"
                        ? "text-green-600 focus:ring-green-500"
                        : status === "Pending"
                        ? "text-yellow-600 focus:ring-yellow-500"
                        : "text-red-600 focus:ring-red-500"
                    }`}
                  />
                </label>
              ))}
            </div>

            <button
              onClick={() => setIsFilterOpen(false)}
              className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BookingList;