import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { UserContext } from "../../Context/UserContext";
import { 
  FaMapMarkerAlt, 
  FaBuilding,
  FaUsers, 
  FaBed, 
  FaDollarSign, 
  FaUtensils, 
  FaWifi, 
  FaParking, 
  FaSnowflake, 
  FaHeart, 
  FaShareAlt,
  FaExpandArrowsAlt,
  FaStar,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaSpinner,
  FaFilter,
  FaSearch,
  FaChevronDown,
  FaCheck
} from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BASE_URL from '../../config';

const HallListPage = () => {
  const { user } = useContext(UserContext);
  const [halls, setHalls] = useState([]);
  const [filteredHalls, setFilteredHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [imageCache, setImageCache] = useState(new Map());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [capacityFilter, setCapacityFilter] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Image caching and preloading utilities
  const getImageFromCache = useCallback((imageUrl) => {
    const cacheKey = `img_${btoa(imageUrl)}`;
    return imageCache.get(imageUrl);
  }, [imageCache]);

  const cacheImage = useCallback(async (imageUrl, blob) => {
    setImageCache(prev => new Map(prev).set(imageUrl, blob));
  }, []);

  const preloadImages = useCallback(async (hall) => {
    const promises = hall.image_urls.map(async (url) => {
      try {
        const cached = getImageFromCache(url);
        if (cached) return cached;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch image');
        
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        await cacheImage(url, objectUrl);
        return objectUrl;
      } catch (error) {
        console.error(`Failed to preload image ${url}:`, error);
        return url;
      }
    });
    
    return Promise.all(promises);
  }, [getImageFromCache, cacheImage]);

  // Fetch halls with image preloading
  useEffect(() => {
    const fetchHalls = async () => {
      if (!user?.userAccessToken) {
        setErrorMessage("Please log in to view premium venues.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/hall/get_halls`, {
          headers: { Authorization: `Bearer ${user.userAccessToken}` },
        });

        const hallsWithPreloadedImages = await Promise.all(
          response.data.halls.map(async (hall) => {
            const preloadedUrls = await preloadImages(hall);
            return { ...hall, preloaded_image_urls: preloadedUrls };
          })
        );

        setHalls(hallsWithPreloadedImages);
        setFilteredHalls(hallsWithPreloadedImages);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Failed to load venues.");
        console.error("Error fetching halls:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHalls();
  }, [user?.userAccessToken, preloadImages]);

  // Filter and sort halls
  useEffect(() => {
    let filtered = [...halls];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(hall => 
        hall.hall_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hall.hall_location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(hall => 
      hall.hall_price_per_day >= priceRange[0] && 
      hall.hall_price_per_day <= priceRange[1]
    );

    // Capacity filter
    if (capacityFilter > 0) {
      filtered = filtered.filter(hall => hall.total_hall_capacity >= capacityFilter);
    }

    // Sort
    switch(sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.hall_price_per_day - b.hall_price_per_day);
        break;
      case "price-high":
        filtered.sort((a, b) => b.hall_price_per_day - a.hall_price_per_day);
        break;
      case "capacity":
        filtered.sort((a, b) => b.total_hall_capacity - a.total_hall_capacity);
        break;
      default:
        break;
    }

    setFilteredHalls(filtered);
  }, [halls, searchQuery, sortBy, priceRange, capacityFilter]);

  const handleBookHallClick = (hall) => {
    navigate("/user-Dashboard/bookingpage", { state: { hall } });
  };

  const handleImageClick = (hall, index = 0) => {
    setSelectedHall(hall);
    setCurrentImageIndex(index);
    setIsPhotoModalOpen(true);
  };

  const ImageWithFallback = ({ src, alt, className, onLoad, ...props }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageLoad = useCallback((e) => {
      setImageLoading(false);
      onLoad?.(e);
    }, [onLoad]);

    const handleImageError = useCallback(() => {
      setImageError(true);
      setImageLoading(false);
    }, []);

    if (imageError) {
      return (
        <div className={`w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-2xl ${className}`}>
          <FaBuilding className="text-gray-400 text-6xl" />
        </div>
      );
    }

    return (
      <div className="relative w-full h-full">
        {imageLoading && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center rounded-2xl z-10">
            <FaSpinner className="animate-spin text-purple-600 text-3xl" />
          </div>
        )}
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${className} ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...props}
        />
      </div>
    );
  };

  const HallCard = React.memo(({ hall, index }) => {
    const cachedImage = hall.preloaded_image_urls?.[0] || hall.image_urls?.[0];
    const isFavorite = favorites.has(hall.id);

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
      >
        {/* Image Container */}
        <div 
          className="relative h-72 overflow-hidden cursor-pointer bg-gray-50"
          onClick={() => handleImageClick(hall, 0)}
        >
          <ImageWithFallback
            src={cachedImage}
            alt={hall.hall_name}
            className="transition-transform duration-700 group-hover:scale-110 rounded-t-2xl"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          {/* Top Actions Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            {/* Premium Badge */}
            {hall.hall_price_per_day > 500000 ? (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1"
              >
                <span>✨</span>
                <span>LUXURY</span>
              </motion.div>
            ) : (
              <div className="bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-gray-700 shadow-md">
                Featured
              </div>
            )}
            
            {/* Favorite Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                const newFavorites = new Set(favorites);
                if (newFavorites.has(hall.id)) {
                  newFavorites.delete(hall.id);
                } else {
                  newFavorites.add(hall.id);
                }
                setFavorites(newFavorites);
              }}
              className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 ${
                isFavorite 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/95 text-gray-600 hover:bg-white'
              }`}
            >
              <FaHeart className={`text-sm ${isFavorite ? 'fill-current' : ''}`} />
            </motion.button>
          </div>

          {/* Bottom Info Bar */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
            {/* Image Count */}
            {hall.image_urls?.length > 1 && (
              <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5">
                <span>📷</span>
                <span>{hall.image_urls.length}</span>
              </div>
            )}
            
            {/* Expand Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick(hall, 0);
              }}
              className="bg-white/95 backdrop-blur-sm p-2.5 rounded-full shadow-lg text-gray-700 hover:bg-white transition-colors ml-auto"
            >
              <FaExpandArrowsAlt className="text-sm" />
            </motion.button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0 pr-3">
              <h3 className="text-lg font-bold text-gray-900 mb-1.5 truncate hover:text-purple-600 transition-colors cursor-pointer">
                {hall.hall_name}
              </h3>
              <div className="flex items-center text-gray-500 text-sm">
                <FaMapMarkerAlt className="mr-1.5 text-purple-500 flex-shrink-0 text-xs" />
                <span className="truncate">{hall.hall_location}</span>
              </div>
            </div>
            
            {/* Rating Badge */}
            <div className="flex flex-col items-end">
              <div className="flex items-center bg-amber-50 px-2.5 py-1 rounded-lg mb-1">
                <FaStar className="text-amber-500 mr-1 text-xs" />
                <span className="text-sm font-bold text-gray-900">4.8</span>
              </div>
              <span className="text-xs text-gray-400">127 reviews</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />

          {/* Key Features Grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <FeatureChip icon={FaUsers} label={`${hall.total_hall_capacity || 0} Guests`} />
            <FeatureChip icon={FaBed} label={`${hall.number_of_rooms || 0} Rooms`} />
            <FeatureChip icon={FaUtensils} label={`${hall.catering_work_members || 0} Staff`} />
            <FeatureChip icon={FaWifi} label="WiFi" />
          </div>

          {/* Pricing Section */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 mb-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs text-gray-500 mb-1 flex items-center">
                  <FaClock className="mr-1" /> Per Day
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ₹{(hall.hall_price_per_day || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Cleaning</div>
                <div className="text-sm font-semibold text-gray-700">
                  +₹{(hall.cleaning_charge_per_day || 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                handleBookHallClick(hall);
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Book Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick(hall, 0);
              }}
              className="p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <FaExpandArrowsAlt />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  });

  const FeatureChip = ({ icon: Icon, label }) => (
    <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg text-gray-700 border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all duration-200">
      <Icon className="text-purple-500 mr-2 text-xs flex-shrink-0" />
      <span className="text-xs font-medium truncate">{label}</span>
    </div>
  );

  // Enhanced Image Modal
  const ImageGalleryModal = () => {
    if (!selectedHall) return null;

    const images = selectedHall.preloaded_image_urls || selectedHall.image_urls || [];
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/96 z-50 flex items-center justify-center p-4"
        onClick={() => setIsPhotoModalOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] flex flex-col overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Display Area */}
          <div className="relative flex-1 min-h-0 bg-black">
            <ImageWithFallback
              src={images[currentImageIndex]}
              alt={`${selectedHall.hall_name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => 
                      prev === 0 ? images.length - 1 : prev - 1
                    );
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl text-gray-800 hover:bg-white transition-all z-10"
                >
                  <FaChevronLeft size={24} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => 
                      prev === images.length - 1 ? 0 : prev + 1
                    );
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl text-gray-800 hover:bg-white transition-all z-10"
                >
                  <FaChevronRight size={24} />
                </motion.button>
              </>
            )}

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-xl shadow-2xl hover:bg-red-600 transition-colors z-10"
            >
              <FaTimes size={20} />
            </motion.button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-semibold z-10">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
                {images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05, y: -3 }}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden transition-all ${
                      index === currentImageIndex
                        ? 'ring-4 ring-purple-500 shadow-lg'
                        : 'ring-2 ring-gray-200 hover:ring-gray-300'
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === currentImageIndex && (
                      <div className="absolute inset-0 bg-purple-500/20" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Hall Info Footer */}
          <div className="p-6 bg-white border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedHall.hall_name}</h3>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2 text-purple-500" />
                  <span>{selectedHall.hall_location}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleBookHallClick(selectedHall)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                Book This Venue
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
        >
          <div className="h-72 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          <div className="p-5 space-y-4">
            <div className="flex justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-300 rounded-lg w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/2 animate-pulse"></div>
              </div>
              <div className="h-10 w-14 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-9 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
            <div className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="h-12 bg-gray-300 rounded-xl animate-pulse"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <div className="h-12 bg-gray-300 rounded-2xl w-64 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded-xl w-96 animate-pulse"></div>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-3xl p-12 shadow-2xl max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaBuilding className="text-red-500 text-5xl" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">Access Required</h3>
          <p className="text-gray-600 mb-8 text-lg">{errorMessage}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-10 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
            onClick={() => navigate("/login")}
          >
            Sign In to Continue
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50">
      {/* Modern Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Title Section */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Discover Premium Venues
              </h1>
              <p className="text-gray-600 text-lg">
                {filteredHalls.length} luxury venues • Perfect for your special moments
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex items-center space-x-3">
              <div className="relative flex-1 lg:w-80">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  showFilters 
                    ? 'bg-purple-600 text-white border-purple-600' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                }`}
              >
                <FaFilter />
              </motion.button>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-6 pb-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none bg-white"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="capacity">Capacity: High to Low</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Max Price: ₹{priceRange[1].toLocaleString('en-IN')}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="50000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>

                  {/* Min Capacity */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Min Capacity: {capacityFilter} guests
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="50"
                      value={capacityFilter}
                      onChange={(e) => setCapacityFilter(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Stats Bar */}
      {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                {filteredHalls.length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Available Venues</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-1">
                4.8★
              </div>
              <div className="text-sm text-gray-600 font-medium">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-1">
                24/7
              </div>
              <div className="text-sm text-gray-600 font-medium">Support</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-1">
                1000+
              </div>
              <div className="text-sm text-gray-600 font-medium">Happy Events</div>
            </div>
          </div>
        </motion.div>
      </div> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Results Info */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-between bg-purple-50 border border-purple-200 rounded-xl p-4"
          >
            <p className="text-purple-900 font-medium">
              Found {filteredHalls.length} venues matching "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center space-x-1"
            >
              <FaTimes />
              <span>Clear</span>
            </button>
          </motion.div>
        )}

        {/* Hall Grid */}
        {filteredHalls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHalls.map((hall, index) => (
              <HallCard key={hall.id} hall={hall} index={index} />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white rounded-3xl shadow-lg"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBuilding className="text-6xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No Venues Found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? "Try adjusting your search or filters to find more venues" 
                : "No venues are currently available. Check back later!"}
            </p>
            {(searchQuery || capacityFilter > 0 || priceRange[1] < 1000000) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchQuery("");
                  setCapacityFilter(0);
                  setPriceRange([0, 1000000]);
                  setSortBy("featured");
                }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                Reset Filters
              </motion.button>
            )}
          </motion.div>
        )}
      </main>

      {/* Image Gallery Modal */}
      <AnimatePresence>
        {isPhotoModalOpen && <ImageGalleryModal />}
      </AnimatePresence>

      {/* Floating Action Button - Favorites */}
      {favorites.size > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-8 right-8 z-30"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-full shadow-2xl flex items-center space-x-3"
          >
            <FaHeart className="text-xl" />
            <span className="font-bold pr-2">{favorites.size}</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default React.memo(HallListPage);