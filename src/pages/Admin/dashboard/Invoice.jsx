import React, { useEffect, useState } from "react";
import { useAdminContext } from "../AdminContext";
import axios from "axios";
import {FaSpinner,FaCheckCircle, FaUser, FaEnvelope, FaCalendarAlt, FaMoneyBill, FaStickyNote, FaPaperPlane, FaClock, FaCalculator } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import BASE_URL from '../../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InvoiceSendPage = () => {
  const { adminData } = useAdminContext();
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [invoiceData, setInvoiceData] = useState({
    maintenanceCharge: '',
    cleaningCharge: '',
    finalPrice: 0,
    totalWithGst: 0
  });
  const navigate = useNavigate();

  // Fetch Approved Bookings
  const fetchApprovedBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/admin/bookings/approved/`, {
        headers: {
          Authorization: `Bearer ${adminData.access_token}`,
        },
      });
      setApprovedBookings(response.data);
    } catch (error) {
      console.error("Error fetching approved bookings:", error);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedBookings();
  }, []);

  // Handle Modal Open
  const openModal = (booking) => {
    setSelectedBooking(booking);
    setInvoiceData({ maintenanceCharge: '', cleaningCharge: '', finalPrice: 0, totalWithGst: 0 });
    setIsModalOpen(true);
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData(prev => ({ ...prev, [name]: value === '' ? '' : parseFloat(value) || 0 }));
  };

  // Calculate Total
  const calculateTotal = () => {
    const { maintenanceCharge, cleaningCharge } = invoiceData;
    const basePrice = selectedBooking.total_price;
    const finalPrice = basePrice + (maintenanceCharge || 0) + (cleaningCharge || 0);
    const totalWithGst = finalPrice + (finalPrice * 0.18); // 18% GST on final price
    setInvoiceData(prev => ({ ...prev, finalPrice, totalWithGst }));
  };

  // Send Invoice to Backend
  const handleSubmitInvoice = async () => {
    const bookingId = selectedBooking.id;
    const hallId = selectedBooking.hall_id;
    const userId = selectedBooking.user_id;
    const hallTotalPrice = selectedBooking.total_price;
    const useremail = selectedBooking.user_email;
    const { maintenanceCharge, cleaningCharge, totalWithGst } = invoiceData;

    try {
      await axios.post(
        `${BASE_URL}/admin/invoices/`,
        {
          booking_id: bookingId,
          hall_id: hallId,
          user_id: userId,
          maintenance_charge: maintenanceCharge || 0,
          cleaning_charge: cleaningCharge || 0,
          hall_total_price: hallTotalPrice,
          total_amount: totalWithGst, // Final total with GST
          useremail: useremail
        },
        {
          headers: {
            Authorization: `Bearer ${adminData.access_token}`,
          },
        }
      );
      toast.success("Invoice sent successfully!");
      setIsModalOpen(false);
      navigate("/admin-Dashboard/my-halls");
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error("Error sending invoice. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b ">
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-blue-600 py-14 shadow-xl">
        <h1 className="text-5xl font-extrabold text-white text-center tracking-tight">Send Invoices</h1>
      </div>

      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="text-5xl text-indigo-600 animate-spin" />
          </div>
        ) : approvedBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-xl font-semibold text-gray-700">No Approved Bookings Found</p>
            <p className="text-gray-500 mt-2">Please wait for approved bookings to send invoices.</p>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {approvedBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100"
              >
                <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-semibold text-gray-800 capitalize flex items-center gap-2">
                      <FaUser className="text-indigo-600" /> {booking.user_name}
                    </h2>
                    <span className="px-4 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 flex items-center gap-1 shadow-sm">
                      <FaCheckCircle /> Approved
                    </span>
                  </div>
                </div>

                <div className="px-6 py-5 space-y-4 text-gray-600">
                  <p className="flex items-center gap-2 flex-wrap">
                    <FaEnvelope className="text-indigo-600" />
                    <span className="font-medium">Email:</span> <span className="truncate">{booking.user_email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FaCalendarAlt className="text-indigo-600" />
                    <span className="font-medium">Hall ID:</span> {booking.hall_id}
                  </p>
                  <p className="flex items-center gap-2 flex-wrap">
                    <FaCalendarAlt className="text-indigo-600" />
                    <span className="font-medium">Dates:</span>
                    {booking.function_start_date}
                    {booking.function_start_date !== booking.function_end_date && ` - ${booking.function_end_date}`}
                  </p>
                  {!booking.full_day_slot && (
                    <p className="flex items-center gap-2">
                      <FaClock className="text-indigo-600" />
                      <span className="font-medium">Time:</span> {booking.start_time} - {booking.end_time}
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <FaClock className="text-indigo-600" />
                    <span className="font-medium">Slot:</span> {booking.full_day_slot ? 'Full Day' : 'Partial'}
                  </p>
                  <p className="flex items-center gap-2 flex-wrap">
                    <FaMoneyBill className="text-indigo-600" />
                    <span className="font-medium">Base Price:</span> ₹
                    {booking.total_price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </p>
                  {booking.additional_details && (
                    <p className="flex items-center gap-2 flex-wrap">
                      <FaStickyNote className="text-indigo-600" />
                      <span className="font-medium">Notes:</span> <span className="truncate">{booking.additional_details}</span>
                    </p>
                  )}
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => openModal(booking)}
                    className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <FaPaperPlane /> Send Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Invoice for {selectedBooking.user_name}</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Base Price</label>
                <input
                  type="number"
                  value={selectedBooking.total_price}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed py-2 px-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Maintenance Charge</label>
                <input
                  type="number"
                  name="maintenanceCharge"
                  value={invoiceData.maintenanceCharge}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                  placeholder="Enter Maintenance Charge"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cleaning Charge</label>
                <input
                  type="number"
                  name="cleaningCharge"
                  value={invoiceData.cleaningCharge}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                  placeholder="Enter Cleaning Charge"
                />
              </div>

              {(invoiceData.maintenanceCharge !== '' || invoiceData.cleaningCharge !== '') && (
                <button
                  onClick={calculateTotal}
                  className="w-full px-5 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <FaCalculator /> Calculate Total
                </button>
              )}

              {invoiceData.totalWithGst > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">Final Price (Base + Charges):</p>
                    <p className="text-lg font-semibold text-gray-800">
                      ₹{invoiceData.finalPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">Total (incl. 18% GST):</p>
                    <p className="text-xl font-bold text-indigo-600">
                      ₹{invoiceData.totalWithGst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <button
                    onClick={handleSubmitInvoice}
                    className="w-full px-5 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <FaPaperPlane /> Submit Invoice
                  </button>
                </div>
              )}

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full px-5 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-200 shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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

export default InvoiceSendPage;