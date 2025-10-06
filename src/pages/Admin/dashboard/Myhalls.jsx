import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBuilding, FaMapMarkerAlt, FaSpinner, FaDollarSign, FaUsers, FaBroom, FaUtensils, FaChevronLeft, FaChevronRight, FaTimes, FaEdit, FaPlus } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import BASE_URL from '../../config';
import { useAdminContext } from "../AdminContext";

const MyHalls = () => {
  const { adminData } = useAdminContext();
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const user = { id: adminData.user_id };

  useEffect(() => {
    const fetchHalls = async () => {
      if (!user?.id) {
        setErrorMessage("Please log in to view your halls.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/hall/get_halls_for_admin_based/${user.id}`);
        setHalls(response.data.halls);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Failed to load your halls. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHalls();
  }, [user?.id]);

  const handleImageClick = (hall) => {
    if (hall.image_urls && hall.image_urls.length > 0) {
      setSelectedImages(hall.image_urls);
      setCurrentImageIndex(0);
      setIsPhotoModalOpen(true);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);
  };

  const handleEditClick = (hallId) => {
    navigate(`/edit-hall/${hallId}`);
  };

  const handleAddNewHallClick = () => {
    navigate("/admin-Dashboard/hall-register");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Your Managed Halls
          </h1>
          <p className="mt-3 text-lg md:text-xl opacity-90">
            View and manage your registered event halls
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Add New Hall Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleAddNewHallClick}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 shadow-md"
          >
            <FaPlus /> Add New Hall
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className="text-5xl text-indigo-600 animate-spin" />
            <span className="ml-3 text-lg text-gray-600">Loading your halls...</span>
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
        ) : halls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">You haven't registered any halls yet.</p>
            <button
              onClick={() => navigate("/register-hall")}
              className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Register a Hall
            </button>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {halls.map((hall) => (
              <div
                key={hall.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={hall.image_urls?.[0] || "https://via.placeholder.com/400x300?text=No+Image"}
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
                  <p className="text-gray-600 flex items-center gap-2 text-sm mb-3">
                    <FaMapMarkerAlt className="text-indigo-500" /> {hall.hall_location}
                  </p>
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
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{hall.about_hall}</p>
                  <button
                    onClick={() => handleEditClick(hall.id)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <FaEdit /> Edit Hall
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {isPhotoModalOpen && selectedImages.length > 0 && (
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

export default MyHalls;