// BookingStatus.jsx
import React, { useState, useEffect,useContext } from 'react';
import BASE_URL from '../../config';
import { UserContext } from "../../Context/UserContext";

const BookingStatus = () => {
  const { user } =useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${BASE_URL}/hall/user/booking_status`, {
          method: 'GET',
          headers: {

            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.userAccessToken}`,
          },
        });
        console.log(user?.userAccessToken);
        if (!response.ok) {
          throw new Error('Failed to fetch booking status');
        }

        const data = await response.json();
        setBookings(data);
        setLoading(false);
        setTimeout(() => setAnimate(true), 100);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-red-600 text-lg">Error: {error}</p>
          <p className="mt-2 text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white  sm:p-6">
      <div className="max-w-5xl mx-auto">

        <div className="bg-purple-700 text-white text-center py-4">
          <h1 className="text-2xl sm:text-3xl font-bold">My Bookings</h1>
        </div>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
            <svg className="w-20 h-20 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="text-xl font-semibold text-gray-700 mb-2">No Bookings Found</p>
            <p className="text-gray-500 text-center max-w-md">
              You haven't booked any halls yet. Start by making a reservation to see your bookings here!
            </p>
            <button className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md">
              Book a Hall
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4 ">
            {bookings.map((booking) => (
              <div
                key={booking.booking_id}
                className=" rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-2">
                  {booking.hall_name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{booking.function_type}</p>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {booking.function_start_date}
                      {booking.function_start_date !== booking.function_end_date && ` - ${booking.function_end_date}`}
                    </span>
                  </div>

                  {!booking.full_day_slot && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}</span>
                    </div>
                  )}

                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 1.857h10M12 4a8 8 0 100 16 8 8 0 000-16z" />
                    </svg>
                    <span>{booking.minimum_people_coming} - {booking.maximum_people_coming} guests</span>
                  </div>

                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m-6 0H9m-6 0h2" />
                    </svg>
                    <span>{booking.no_of_rooms_booked} rooms</span>
                  </div>

                  <p className="text-gray-500">Details: {booking.additional_details}</p>
                  <p className="text-gray-600 font-medium">
                    ₹{booking.total_price.toLocaleString()} + GST ₹{booking.gst.toLocaleString()}
                  </p>
                </div>

                <div className="mt-4">
                  <button
                    className={`w-full py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 shadow-md ${booking.status.toLowerCase() === "pending"
                      ? "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400"
                      : booking.status.toLowerCase() === "approved"
                        ? "bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600"
                        : "bg-gradient-to-r from-red-400 to-red-500 text-white hover:from-red-500 hover:to-red-600"
                      }`}
                  >
                    {booking.status}
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingStatus;