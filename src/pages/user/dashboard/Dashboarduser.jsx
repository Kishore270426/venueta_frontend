import React, { useEffect, useState,useContext } from "react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import { FaBuilding, FaMapMarkerAlt, FaSpinner, FaDollarSign, FaUsers, FaBroom, FaUtensils, FaBed, FaChevronLeft, FaChevronRight, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import BASE_URL from '../../config';

const HallListPage = () => {
  const { user } = useContext(UserContext);
  const [halls, setHalls] = useState([]);
  const [filteredHalls, setFilteredHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState("All"); // Default filter
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/hall/get_halls`, {
          headers: {
            Authorization: `Bearer ${user?.userAccessToken}`,
          },
        });
         console.log(user?.userAccessToken);
        setHalls(response.data.halls);
        setFilteredHalls(response.data.halls); // Initially show all halls
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Failed to load hall list. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.userAccessToken) {
      fetchHalls();
    } else {
      setErrorMessage("Please log in to view halls.");
      setLoading(false);
    }
  }, [user?.userAccessToken]);

  // Get unique locations for the filter dropdown
  const uniqueLocations = ["All", ...new Set(halls.map((hall) => hall.hall_location))];

  // Handle location filter change
  const handleLocationFilter = (e) => {
    const location = e.target.value;
    setSelectedLocation(location);
    if (location === "All") {
      setFilteredHalls(halls); // Show all halls
    } else {
      setFilteredHalls(halls.filter((hall) => hall.hall_location === location));
    }
  };

  const handleBookHallClick = (hall) => {
    navigate("/user-Dashboard/bookingpage", { state: { hall } });
  };

  const handleImageClick = (hall) => {
    setSelectedImages(hall.image_urls);
    setCurrentImageIndex(0);
    setIsPhotoModalOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Discover Your Perfect Venue
          </h1>
          <p className="mt-3 text-lg md:text-xl opacity-90">
            Browse and book halls tailored to your event needs
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Section */}
        <div className="mb-8 flex justify-end">
          <div className="flex items-center gap-2">
            <label htmlFor="locationFilter" className="text-gray-700 font-medium">
              Filter by Location:
            </label>
            <select
              id="locationFilter"
              value={selectedLocation}
              onChange={handleLocationFilter}
              className="border border-gray-300 rounded-lg p-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {uniqueLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="text-5xl text-indigo-600 animate-spin" />
            <span className="ml-3 text-lg text-gray-600">Loading halls...</span>
          </div>
        ) : errorMessage ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg text-center">
            <p className="text-lg text-red-700 font-medium">{errorMessage}</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 inline-block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHalls.map((hall) => (
              <div
                key={hall.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={hall.image_urls[0] || "https://via.placeholder.com/400x300?text=No+Image"}
                    alt={hall.hall_name}
                    className="w-full h-56 object-cover cursor-pointer transition-opacity hover:opacity-90"
                    onClick={() => handleImageClick(hall)}
                  />
                  <div className="absolute top-2 right-2 bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {hall.number_of_rooms} Rooms
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-2">
                    <FaBuilding className="text-indigo-500" /> {hall.hall_name}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2 text-sm mb-2">
                    <FaMapMarkerAlt className="text-indigo-500" /> {hall.hall_location}
                  </p>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{hall.hall_address}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                    <p className="flex items-center gap-1">
                      <FaDollarSign className="text-indigo-500" /> 
                      ₹{hall.hall_price_per_day.toLocaleString('en-IN')}/day
                    </p>
                    <p className="flex items-center gap-1">
                      <FaUsers className="text-indigo-500" /> 
                      {hall.total_hall_capacity} guests
                    </p>
                    <p className="flex items-center gap-1">
                      <FaBroom className="text-indigo-500" /> 
                      ₹{hall.cleaning_charge_per_day.toLocaleString('en-IN')}
                    </p>
                    <p className="flex items-center gap-1">
                      <FaUtensils className="text-indigo-500" /> 
                      {hall.catering_work_members} staff
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 italic">{hall.about_hall}</p>
                  <button
                    onClick={() => handleBookHallClick(hall)}
                    className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaCheck /> Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Photo Modal */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="relative max-w-4xl w-full">
            <img
              src={selectedImages[currentImageIndex]}
              alt={`Hall Image ${currentImageIndex + 1}`}
              className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-3 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200"
            >
              <FaChevronLeft size={24} className="text-gray-800" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-3 rounded-full shadow-lg hover:bg-opacity-100 transition-all duration-200"
            >
              <FaChevronRight size={24} className="text-gray-800" />
            </button>
            <button
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg"
            >
              <FaTimes size={18} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {selectedImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallListPage;