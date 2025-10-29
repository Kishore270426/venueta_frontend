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

  // Cache image and return object URL
  const cacheImage = useCallback((imageUrl, blob) => {
    const objectUrl = URL.createObjectURL(blob);
    setImageCache(prev => new Map(prev).set(imageUrl, objectUrl));
    return objectUrl;
  }, []);

  const preloadAllImages = async (hallsData) => {
    const preloadPromises = hallsData.map(async (hall) => {
      const imagePromises = hall.image_urls.map(async (url) => {
        if (imageCache.has(url)) return imageCache.get(url);

        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error("Failed to fetch");
          const blob = await response.blob();
          return cacheImage(url, blob);
        } catch (err) {
          console.error("Image preload failed:", url, err);
          return url; // fallback to original URL
        }
      });

      const preloadedUrls = await Promise.all(imagePromises);
      return { ...hall, preloaded_image_urls: preloadedUrls };
    });

    return Promise.all(preloadPromises);
  };

  // Fetch halls + preload images BEFORE rendering
  useEffect(() => {
    const fetchAndPreload = async () => {
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

        const hallsWithImages = await preloadAllImages(response.data.halls);

        setHalls(hallsWithImages);
        setFilteredHalls(hallsWithImages);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Failed to load venues.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndPreload();
  }, [user?.userAccessToken]);

  // Filter and sort
  useEffect(() => {
    let filtered = [...halls];

    if (searchQuery) {
      filtered = filtered.filter(hall => 
        hall.hall_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hall.hall_location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered = filtered.filter(hall => 
      hall.hall_price_per_day >= priceRange[0] && 
      hall.hall_price_per_day <= priceRange[1]
    );

    if (capacityFilter > 0) {
      filtered = filtered.filter(hall => hall.total_hall_capacity >= capacityFilter);
    }

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

  // Simple Image Component - No animation, instant show when loaded
  const CachedImage = ({ src, alt, className, ...props }) => {
    const cachedSrc = imageCache.get(src) || src;

    return (
      <img
        src={cachedSrc}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        loading="eager"
        {...props}
      />
    );
  };

  const HallCard = React.memo(({ hall }) => {
    const mainImage = hall.preloaded_image_urls?.[0] || hall.image_urls?.[0];
    const isFavorite = favorites.has(hall.id);

    return (
      <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
        {/* Image */}
        <div 
          className="relative h-72 overflow-hidden cursor-pointer bg-gray-50"
          onClick={() => handleImageClick(hall, 0)}
        >
          <CachedImage
            src={mainImage}
            alt={hall.hall_name}
            className="transition-transform duration-500 group-hover:scale-110"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
          
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            {hall.hall_price_per_day > 500000 ? (
              <div className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                <span>LUXURY</span>
              </div>
            ) : (
              <div className="bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold text-gray-700 shadow-md">
                Featured
              </div>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                const newFavorites = new Set(favorites);
                isFavorite ? newFavorites.delete(hall.id) : newFavorites.add(hall.id);
                setFavorites(newFavorites);
              }}
              className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all duration-200 ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-white/95 text-gray-600 hover:bg-white'
              }`}
            >
              <FaHeart className={`text-sm ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
            {hall.image_urls?.length > 1 && (
              <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5">
                <span>{hall.image_urls.length}</span>
              </div>
            )}
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick(hall, 0);
              }}
              className="bg-white/95 backdrop-blur-sm p-2.5 rounded-full shadow-lg text-gray-700 hover:bg-white transition-colors ml-auto"
            >
              <FaExpandArrowsAlt className="text-sm" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
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
            
            <div className="flex flex-col items-end">
              <div className="flex items-center bg-amber-50 px-2.5 py-1 rounded-lg mb-1">
                <FaStar className="text-amber-500 mr-1 text-xs" />
                <span className="text-sm font-bold text-gray-900">4.8</span>
              </div>
              <span className="text-xs text-gray-400">127 reviews</span>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4" />

          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <FeatureChip icon={FaUsers} label={`${hall.total_hall_capacity || 0} Guests`} />
            <FeatureChip icon={FaBed} label={`${hall.number_of_rooms || 0} Rooms`} />
            <FeatureChip icon={FaUtensils} label={`${hall.catering_work_members || 0} Staff`} />
            <FeatureChip icon={FaWifi} label="WiFi" />
          </div>

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

          <div className="flex items-center space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBookHallClick(hall);
              }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
            >
              Book Now
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick(hall, 0);
              }}
              className="p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <FaExpandArrowsAlt />
            </button>
          </div>
        </div>
      </div>
    );
  });

  const FeatureChip = ({ icon: Icon, label }) => (
    <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg text-gray-700 border border-gray-100 hover:border-purple-200 hover:bg-purple-50 transition-all duration-200">
      <Icon className="text-purple-500 mr-2 text-xs flex-shrink-0" />
      <span className="text-xs font-medium truncate">{label}</span>
    </div>
  );

  const ImageGalleryModal = () => {
    if (!selectedHall) return null;

    const images = selectedHall.preloaded_image_urls || selectedHall.image_urls || [];
    
    return (
      <div className="fixed inset-0 bg-black/96 z-50 flex items-center justify-center p-4" onClick={() => setIsPhotoModalOpen(false)}>
        <div className="relative bg-white rounded-3xl max-w-6xl w-full max-h-[95vh] flex flex-col overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="relative flex-1 min-h-0 bg-black">
            <CachedImage
              src={images[currentImageIndex]}
              alt={`${selectedHall.hall_name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl text-gray-800 hover:bg-white transition-all z-10"
                >
                  <FaChevronLeft size={24} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl text-gray-800 hover:bg-white transition-all z-10"
                >
                  <FaChevronRight size={24} />
                </button>
              </>
            )}

            <button
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-xl shadow-2xl hover:bg-red-600 transition-colors z-10"
            >
              <FaTimes size={20} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-semibold z-10">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>

          {images.length > 1 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden transition-all ${
                      index === currentImageIndex
                        ? 'ring-4 ring-purple-500 shadow-lg'
                        : 'ring-2 ring-gray-200 hover:ring-gray-300'
                    }`}
                  >
                    <CachedImage
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === currentImageIndex && (
                      <div className="absolute inset-0 bg-purple-500/20" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 bg-white border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedHall.hall_name}</h3>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2 text-purple-500" />
                  <span>{selectedHall.hall_location}</span>
                </div>
              </div>
              <button
                onClick={() => handleBookHallClick(selectedHall)}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                Book This Venue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(9)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-pulse">
          <div className="h-72 bg-gray-300" />
          <div className="p-5 space-y-4">
            <div className="flex justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-300 rounded-lg w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
              </div>
              <div className="h-10 w-14 bg-gray-300 rounded-lg"></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="h-9 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-20 bg-gray-200 rounded-xl"></div>
            <div className="h-12 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Show loading until ALL images are preloaded
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
        <div className="bg-white rounded-3xl p-12 shadow-2xl max-w-md w-full text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FaBuilding className="text-red-500 text-5xl" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">Access Required</h3>
          <p className="text-gray-600 mb-8 text-lg">{errorMessage}</p>
          <button
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-10 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
            onClick={() => navigate("/login")}
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Discover Premium Venues
              </h1>
              <p className="text-gray-600 text-lg">
                {filteredHalls.length} luxury venues • Perfect for your special moments
              </p>
            </div>

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
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  showFilters 
                    ? 'bg-purple-600 text-white border-purple-600' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                }`}
              >
                <FaFilter />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="pt-6 pb-2 grid grid-cols-1 md:grid-cols-3 gap-4">
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
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between bg-purple-50 border border-purple-200 rounded-xl p-4">
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
          </div>
        )}

        {filteredHalls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHalls.map((hall) => (
              <HallCard key={hall.id} hall={hall} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl shadow-lg">
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
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCapacityFilter(0);
                  setPriceRange([0, 1000000]);
                  setSortBy("featured");
                }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </main>

      {isPhotoModalOpen && <ImageGalleryModal />}

      {favorites.size > 0 && (
        <div className="fixed bottom-8 right-8 z-30">
          <button className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-full shadow-2xl flex items-center space-x-3">
            <FaHeart className="text-xl" />
            <span className="font-bold pr-2">{favorites.size}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default HallListPage;