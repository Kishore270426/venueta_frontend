import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BASE_URL from '../../config';
import { UserContext } from "../../Context/UserContext";
import { 
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  ClockIcon as PendingIcon,
  XMarkIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const BookingStatus = () => {
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/hall/user/booking_status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.userAccessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userAccessToken) {
      fetchBookings();
    }
  }, [user?.userAccessToken]);

  const getStatusVariant = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'approved':
        return {
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          icon: CheckCircleIcon,
          dot: 'bg-emerald-500'
        };
      case 'pending':
        return {
          color: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: PendingIcon,
          dot: 'bg-amber-500'
        };
      default:
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XMarkIcon,
          dot: 'bg-red-500'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error || bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <BuildingStorefrontIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Found</h3>
          <p className="text-gray-600 mb-6">
            You haven't made any bookings yet. Start by reserving a hall.
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Book a Hall
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
              <p className="mt-1 text-sm text-gray-500">{bookings.length} active reservation{bookings.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                New Booking
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Summary Cards */}
          <motion.aside 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Bookings</span>
                  <span className="text-lg font-semibold text-gray-900">{bookings.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Approved</span>
                  <span className="text-lg font-semibold text-emerald-600">
                    {bookings.filter(b => b.status?.toLowerCase() === 'approved').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Pending</span>
                  <span className="text-lg font-semibold text-amber-600">
                    {bookings.filter(b => b.status?.toLowerCase() === 'pending').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-900">View Invoice</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-900">Cancel Booking</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <span className="font-medium text-gray-900">Contact Support</span>
                </button>
              </div>
            </div>
          </motion.aside>

          {/* Bookings List */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <AnimatePresence>
              {bookings.map((booking, index) => {
                const statusVariant = getStatusVariant(booking.status);
                const StatusIcon = statusVariant.icon;
                
                return (
                  <motion.div
                    key={booking.booking_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                    }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6 hover:border-gray-300 transition-all duration-200"
                  >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{booking.hall_name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{booking.function_type}</p>
                        </div>
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${statusVariant.color}`}>
                          <div className={`w-2 h-2 rounded-full ${statusVariant.dot}`}></div>
                          <StatusIcon className="w-4 h-4" />
                          <span>{booking.status}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Date & Time */}
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <CalendarDaysIcon className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {booking.function_start_date}
                                {booking.function_start_date !== booking.function_end_date && ` - ${booking.function_end_date}`}
                              </p>
                              {!booking.full_day_slot && (
                                <p className="text-sm text-gray-500">
                                  {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Capacity & Rooms */}
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <UserGroupIcon className="w-5 h-5 text-gray-400 mr-3" />
                            <span className="text-sm text-gray-900">
                              {booking.minimum_people_coming} - {booking.maximum_people_coming} guests
                            </span>
                          </div>
                          <div className="flex items-center">
                            <BuildingStorefrontIcon className="w-5 h-5 text-gray-400 mr-3" />
                            <span className="text-sm text-gray-900">
                              {booking.no_of_rooms_booked} room{booking.no_of_rooms_booked !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Details & Pricing */}
                      <div className="border-t border-gray-200 pt-4">
                        {booking.additional_details && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-2 flex items-center">
                              <DocumentTextIcon className="w-4 h-4 mr-2 text-gray-400" />
                              Additional Details
                            </p>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{booking.additional_details}</p>
                          </div>
                        )}
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end">
                          <div className="text-sm text-gray-500 mb-2 sm:mb-0">
                            Total: ₹{booking.total_price.toLocaleString()} + GST ₹{booking.gst.toLocaleString()}
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            ₹{(booking.total_price + booking.gst).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <button className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                          View Details
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          Invoice
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default BookingStatus;