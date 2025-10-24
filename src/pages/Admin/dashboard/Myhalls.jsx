import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { 
  FaBuilding, 
  FaMapMarkerAlt, 
  FaSpinner, 
  FaDollarSign, 
  FaUsers, 
  FaBroom, 
  FaUtensils, 
  FaChevronLeft, 
  FaChevronRight, 
  FaTimes, 
  FaEdit, 
  FaPlus,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCapacity, setFilterCapacity] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const navigate = useNavigate();

  const user = { id: adminData.user_id };

  // Fetch halls with error handling
  useEffect(() => {
    const fetchHalls = async () => {
      if (!user?.id) {
        setErrorMessage("Please log in to view your halls.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
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

  // Filtered and sorted halls
  const filteredHalls = useMemo(() => {
    let filtered = [...halls];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(hall => 
        hall.hall_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hall.hall_location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Capacity filter
    if (filterCapacity) {
      filtered = filtered.filter(hall => hall.total_hall_capacity >= parseInt(filterCapacity));
    }

    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.hall_name.localeCompare(b.hall_name);
        case 'price':
          return a.hall_price_per_day - b.hall_price_per_day;
        case 'capacity':
          return a.total_hall_capacity - b.total_hall_capacity;
        default:
          return 0;
      }
    });
  }, [halls, searchTerm, filterCapacity, sortBy]);

  // Image gallery handlers
  const handleImageClick = useCallback((hall) => {
    if (hall.image_urls?.length > 0) {
      setSelectedImages(hall.image_urls);
      setCurrentImageIndex(0);
      setIsPhotoModalOpen(true);
    }
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length);
  }, [selectedImages.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);
  }, [selectedImages.length]);

  const handleEditClick = useCallback((hallId) => {
    navigate(`/edit-hall/${hallId}`);
  }, [navigate]);

  const handleAddNewHallClick = useCallback(() => {
    navigate("/admin-Dashboard/hall-register");
  }, [navigate]);

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-200"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="space-y-2 mb-4">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-3 bg-gray-200 rounded w-1/2"></div>
              ))}
            </div>
            <div className="h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty State Component
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
        <FaBuilding className="text-3xl text-indigo-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Halls Found</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        You haven't registered any event halls yet. Start by adding your first venue.
      </p>
      <button
        onClick={handleAddNewHallClick}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
      >
        <FaPlus className="mr-2" />
        Register Your First Hall
      </button>
    </div>
  );

  // Error State Component
  const ErrorState = () => (
    <div className="max-w-md mx-auto py-16">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FaTimes className="text-2xl text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to Load Halls</h3>
        <p className="text-red-700 mb-6">{errorMessage}</p>
        <div className="space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Event Halls</h1>
              <p className="text-gray-600 mt-1">Manage your registered venues ({halls.length})</p>
            </div>
            <button
              onClick={handleAddNewHallClick}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
            >
              <FaPlus className="mr-2" />
              Add New Hall
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterCapacity}
              onChange={(e) => setFilterCapacity(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Capacities</option>
              <option value="50">50+ guests</option>
              <option value="100">100+ guests</option>
              <option value="200">200+ guests</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="capacity">Sort by Capacity</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSkeleton />
        ) : errorMessage ? (
          <ErrorState />
        ) : filteredHalls.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHalls.map((hall) => (
              <HallCard
                key={hall.id}
                hall={hall}
                onImageClick={handleImageClick}
                onEditClick={() => handleEditClick(hall.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Enhanced Photo Modal */}
      {isPhotoModalOpen && selectedImages.length > 0 && (
        <PhotoModal
          images={selectedImages}
          currentIndex={currentImageIndex}
          onClose={() => setIsPhotoModalOpen(false)}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
};

// Professional Hall Card Component
const HallCard = ({ hall, onImageClick, onEditClick }) => (
  <div className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    {/* Image Section */}
    <div className="relative overflow-hidden">
      <img
        src={hall.image_urls?.[0] || "https://via.placeholder.com/400x250/6B7280/FFFFFF?text=No+Image"}
        alt={hall.hall_name}
        className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
        onClick={() => onImageClick(hall)}
        loading="lazy"
      />
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
        <span className="text-xs font-semibold text-gray-700">
          {hall.number_of_rooms} Rooms
        </span>
      </div>
    </div>

    {/* Content Section */}
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-1">
        {hall.hall_name}
      </h3>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <FaMapMarkerAlt className="mr-2 text-indigo-500 flex-shrink-0" />
          <span className="truncate">{hall.hall_location}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div className="flex items-center">
            <FaDollarSign className="mr-1 text-indigo-500" />
            ₹{hall.hall_price_per_day.toLocaleString('en-IN')}/day
          </div>
          <div className="flex items-center">
            <FaUsers className="mr-1 text-indigo-500" />
            {hall.total_hall_capacity} guests
          </div>
          <div className="flex items-center">
            <FaBroom className="mr-1 text-indigo-500" />
            ₹{hall.cleaning_charge_per_day.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center">
            <FaUtensils className="mr-1 text-indigo-500" />
            {hall.catering_work_members} staff
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{hall.about_hall}</p>

      <button
        onClick={onEditClick}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-md transition-all duration-200 font-medium"
      >
        <FaEdit className="text-xs" />
        Edit Hall
      </button>
    </div>
  </div>
);

// Enhanced Photo Modal Component
const PhotoModal = ({ images, currentIndex, onClose, onNext, onPrev }) => (
  <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
    <div 
      className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Image */}
      <img
        src={images[currentIndex]}
        alt={`Hall Image ${currentIndex + 1}`}
        className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
      />
      
      {/* Navigation Buttons */}
      <button
        onClick={onPrev}
        className="absolute left-4 p-3 bg-white/20 hover:bg-white/30 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm"
      >
        <FaChevronLeft size={24} className="text-white" />
      </button>
      <button
        onClick={onNext}
        className="absolute right-4 p-3 bg-white/20 hover:bg-white/30 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm"
      >
        <FaChevronRight size={24} className="text-white" />
      </button>
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full shadow-lg transition-all duration-200 backdrop-blur-sm"
      >
        <FaTimes size={20} className="text-white" />
      </button>
      
      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  </div>
);

export default MyHalls;