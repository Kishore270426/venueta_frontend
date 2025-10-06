// NoBookingsMessage.jsx
import React from 'react';
import { FaCalendarTimes } from 'react-icons/fa';

const NoBookingsMessage = () => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center transform transition-all duration-300">
      <div className="flex flex-col items-center gap-6">
        {/* Icon */}
        <div className="bg-gray-100 p-4 rounded-full">
          <FaCalendarTimes className="text-5xl text-indigo-600" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-800">No Bookings Found</h2>
          <p className="text-gray-600 text-sm sm:text-base">
            There are currently no bookings to display. Check back later or create a new booking to get started.
          </p>
        </div>

        {/* Optional Action Button */}
        <button
          className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={() => window.location.reload()} // Optional: Refresh page
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default NoBookingsMessage;