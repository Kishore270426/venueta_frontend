// BookingDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const BookingDetails = () => {
  const { id } = useParams();
  const [animate, setAnimate] = useState(false);

  const bookingData = {
    1: {
      booking_id: 1, hall_id: 1, admin_id: 1, function_start_date: "2025-03-01",
      function_end_date: "2025-03-06", function_type: "Anniversary", minimum_people_coming: 34,
      maximum_people_coming: 324, no_of_rooms_booked: 12, additional_details: "ddffh",
      user_name: "shakthi", user_email: "letsmail.sakthivel@gmail.com", total_price: 60000.0,
      gst: 10800.0, start_time: "00:00:00", end_time: "00:00:00", full_day_slot: true, status: "Approved",
      description: "Booking confirmed for your anniversary celebration."
    },
    4: {
      booking_id: 4, hall_id: 1, admin_id: 1, function_start_date: "2025-04-04",
      function_end_date: "2025-04-04", function_type: "Anniversary", minimum_people_coming: 324,
      maximum_people_coming: 435, no_of_rooms_booked: 23, additional_details: "dfgherg",
      user_name: "shakthi", user_email: "letsmail.sakthivel@gmail.com", total_price: 2083.3333333333335,
      gst: 375.0, start_time: "12:16:00", end_time: "17:16:00", full_day_slot: false, status: "Rejected",
      description: "Booking rejected due to hall maintenance schedule."
    },
    3: {
      booking_id: 3, hall_id: 2, admin_id: 1, function_start_date: "2025-04-04",
      function_end_date: "2025-04-04", function_type: "Anniversary", minimum_people_coming: 300,
      maximum_people_coming: 500, no_of_rooms_booked: 30, additional_details: "sdffbsb",
      user_name: "shakthi", user_email: "letsmail.sakthivel@gmail.com", total_price: 3750.0,
      gst: 675.0, start_time: "12:14:00", end_time: "18:14:00", full_day_slot: false, status: "Approved",
      description: "Booking confirmed. Please ensure setup is completed 30 minutes prior."
    },
    5: {
      booking_id: 5, hall_id: 5, admin_id: 1, function_start_date: "2025-03-25",
      function_end_date: "2025-03-26", function_type: "Baby Shower", minimum_people_coming: 300,
      maximum_people_coming: 400, no_of_rooms_booked: 5, additional_details: "need a showr bar method and stage based",
      user_name: "shakthi", user_email: "letsmail.sakthivel@gmail.com", total_price: 100000.0,
      gst: 18000.0, start_time: "00:00:00", end_time: "00:00:00", full_day_slot: true, status: "Approved",
      description: "Booking confirmed with stage and shower bar arrangements."
    },
    6: {
      booking_id: 6, hall_id: 4, admin_id: 1, function_start_date: "2025-03-01",
      function_end_date: "2025-03-11", function_type: "Wedding", minimum_people_coming: 430,
      maximum_people_coming: 432, no_of_rooms_booked: 21, additional_details: "ergerg",
      user_name: "shakthi", user_email: "letsmail.sakthivel@gmail.com", total_price: 880000.0,
      gst: 158400.0, start_time: "00:00:00", end_time: "00:00:00", full_day_slot: true, status: "Pending",
      description: "Awaiting approval from venue management."
    },
    7: {
      booking_id: 7, hall_id: 3, admin_id: 2, function_start_date: "2025-03-01",
      function_end_date: "2025-03-02", function_type: "Charity Event", minimum_people_coming: 12,
      maximum_people_coming: 32, no_of_rooms_booked: 12, additional_details: "sdderg",
      user_name: "shakthi", user_email: "letsmail.sakthivel@gmail.com", total_price: 25000.0,
      gst: 4500.0, start_time: "00:00:00", end_time: "00:00:00", full_day_slot: true, status: "Pending",
      description: "Under review by the charity event coordinator."
    }
  };

  const booking = bookingData[id];
  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  if (!booking) {
    return <div className="text-center p-6">Booking not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      <div className="max-w-2xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Bookings
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {booking.function_type} - Hall {booking.hall_id}
          </h1>
          
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                Date: {booking.function_start_date} 
                {booking.function_start_date !== booking.function_end_date && ` to ${booking.function_end_date}`}
              </span>
            </div>
            
            {!booking.full_day_slot && (
              <div className="flex items-center text-gray-600">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Time: {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}</span>
              </div>
            )}

            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 1.857h10M12 4a8 8 0 100 16 8 8 0 000-16z" />
              </svg>
              <span>Capacity: {booking.minimum_people_coming} - {booking.maximum_people_coming} people</span>
            </div>

            <div className="flex items-center text-gray-600">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m-6 0H9m-6 0h2" />
              </svg>
              <span>Rooms Booked: {booking.no_of_rooms_booked}</span>
            </div>

            <div className="text-gray-600">
              <span className="font-medium">Additional Details:</span> {booking.additional_details}
            </div>

            <div className="text-gray-600">
              <span className="font-medium">Total Cost:</span> ₹{booking.total_price.toLocaleString()} + GST ₹{booking.gst.toLocaleString()}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center mb-2">
              <span className="font-medium text-gray-700 mr-2">Status:</span>
              <span 
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  booking.status.toLowerCase() === "pending" 
                    ? "bg-gray-100 text-gray-600"
                    : booking.status.toLowerCase() === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {booking.status}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                  booking.status.toLowerCase() === "pending" 
                    ? "bg-gray-300"
                    : booking.status.toLowerCase() === "approved"
                    ? "bg-green-500 animate-pulse"
                    : "bg-red-500"
                }`}
                style={{
                  width: animate 
                    ? (booking.status.toLowerCase() === "pending" ? "0%" : "100%")
                    : "0%"
                }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{booking.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;