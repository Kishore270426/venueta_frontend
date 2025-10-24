import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdminContext } from "../AdminContext";
import { 
  FaUser, 
  FaLocationArrow, 
  FaDollarSign, 
  FaRegFileImage,
  FaBuilding,
  FaUsers,
  FaBed,
  FaEdit,
  FaTrash,
  FaUpload,
  FaCheckCircle
} from "react-icons/fa";
import BASE_URL from '../../config';

// Notification Modal Component
const NotificationModal = ({ isOpen, onClose, type, title, message }) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'success':
        return {
          icon: <FaCheckCircle className="text-green-500 text-4xl" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800'
        };
      case 'error':
        return {
          icon: <FaTrash className="text-red-500 text-4xl" />,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800'
        };
      default:
        return {
          icon: <FaBuilding className="text-blue-500 text-4xl" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800'
        };
    }
  };

  const { icon, bgColor, borderColor, textColor } = getIconAndColor();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${bgColor} ${borderColor} border-2 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95 hover:scale-100`}>
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            {icon}
          </div>
          <h3 className={`text-xl font-bold mb-2 ${textColor}`}>{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
              type === 'success' 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : type === 'error'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const HallRegister = () => {
  const { adminData } = useAdminContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hallName: "",
    hallLocation: "",
    hallAddress: "",
    hallPricePerDay: "",
    maintenanceChargePerDay: "",
    cleaningChargePerDay: "",
    cateringWorkMembers: "",
    totalHallCapacity: "",
    numberOfRooms: "",
    aboutHall: "",
    images: [],
  });
  
  const [notification, setNotification] = useState({
    isOpen: false,
    type: '', // 'success', 'error'
    title: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const showNotification = (type, title, message) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const closeNotification = () => {
    setNotification({ ...notification, isOpen: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 8) {
      showNotification('error', 'Too Many Images', 'You can upload maximum 8 images');
      return;
    }
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const handleImageDelete = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length < 3) {
      showNotification('error', 'Insufficient Images', 'Please upload at least 3 images');
      return;
    }

    if (formData.images.length > 8) {
      showNotification('error', 'Too Many Images', 'Please upload maximum 8 images');
      return;
    }

    setLoading(true);

    const formPayload = new FormData();
    formPayload.append("hall_name", formData.hallName);
    formPayload.append("hall_location", formData.hallLocation);
    formPayload.append("hall_address", formData.hallAddress);
    formPayload.append("hall_price_per_day", formData.hallPricePerDay);
    formPayload.append("maintenance_charge_per_day", formData.maintenanceChargePerDay);
    formPayload.append("cleaning_charge_per_day", formData.cleaningChargePerDay);
    formPayload.append("catering_work_members", formData.cateringWorkMembers);
    formPayload.append("total_hall_capacity", formData.totalHallCapacity);
    formPayload.append("number_of_rooms", formData.numberOfRooms);
    formPayload.append("about_hall", formData.aboutHall);

    formData.images.forEach((image) => {
      formPayload.append("images", image);
    });

    try {
      const response = await axios.post(
        `${BASE_URL}/hall/register`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${adminData.access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        showNotification('success', 'Success!', 'Hall registered successfully!');
        setFormData({
          hallName: "",
          hallLocation: "",
          hallAddress: "",
          hallPricePerDay: "",
          maintenanceChargePerDay: "",
          cleaningChargePerDay: "",
          cateringWorkMembers: "",
          totalHallCapacity: "",
          numberOfRooms: "",
          aboutHall: "",
          images: [],
        });
        setTimeout(() => {
          navigate("/admin-Dashboard/my-halls");
        }, 2000);
      }
    } catch (error) {
      showNotification('error', 'Registration Failed', error.response?.data?.detail || error.message);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { title: "Basic Info", icon: <FaBuilding /> },
    { title: "Pricing & Capacity", icon: <FaDollarSign /> },
    { title: "Details & Images", icon: <FaRegFileImage /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notification Modal */}
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Register New Hall</h1>
            <p className="text-gray-600 mt-2">Add your hall to our premium venues collection</p>
          </div>
        </div>
      </div>

      {/* Progress Steps - Desktop */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 hidden md:block">
        <div className="flex items-center justify-between">
          {sections.map((section, index) => (
            <React.Fragment key={section.title}>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activeSection >= index 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {section.icon}
                </div>
                <span className={`ml-3 font-medium ${
                  activeSection >= index ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {section.title}
                </span>
              </div>
              {index < sections.length - 1 && (
                <div className={`flex-1 h-1 mx-4 ${
                  activeSection > index ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile Progress */}
      <div className="md:hidden bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            {sections.map((section, index) => (
              <div key={section.title} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  activeSection >= index 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {section.icon}
                </div>
                <span className="text-xs mt-1 text-gray-600">{section.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Section 1: Basic Information */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <FaBuilding className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                  <p className="text-gray-600">Essential details about your hall</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Hall Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hall Name *
                  </label>
                  <input
                    type="text"
                    name="hallName"
                    value={formData.hallName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter hall name"
                    required
                  />
                </div>

                {/* Location and Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaLocationArrow className="inline mr-2 text-blue-500" />
                      Location *
                    </label>
                    <input
                      type="text"
                      name="hallLocation"
                      value={formData.hallLocation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="City, State"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Address *
                    </label>
                    <input
                      type="text"
                      name="hallAddress"
                      value={formData.hallAddress}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Street address"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Pricing and Capacity */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <FaDollarSign className="text-green-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Pricing & Capacity</h2>
                  <p className="text-gray-600">Financial details and capacity information</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Pricing Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price Per Day ($)
                    </label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="hallPricePerDay"
                        value={formData.hallPricePerDay}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Maintenance Charge ($)
                    </label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="maintenanceChargePerDay"
                        value={formData.maintenanceChargePerDay}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cleaning Charge ($)
                    </label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="cleaningChargePerDay"
                        value={formData.cleaningChargePerDay}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Capacity Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaUsers className="inline mr-2 text-purple-500" />
                      Catering Staff
                    </label>
                    <input
                      type="number"
                      name="cateringWorkMembers"
                      value={formData.cateringWorkMembers}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Number of staff"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Total Capacity
                    </label>
                    <input
                      type="number"
                      name="totalHallCapacity"
                      value={formData.totalHallCapacity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Maximum guests"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaBed className="inline mr-2 text-indigo-500" />
                      Number of Rooms
                    </label>
                    <input
                      type="number"
                      name="numberOfRooms"
                      value={formData.numberOfRooms}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Total rooms"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Additional Details */}
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <FaRegFileImage className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Details & Images</h2>
                  <p className="text-gray-600">Description and visual assets</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* About Hall */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    About This Hall *
                  </label>
                  <textarea
                    name="aboutHall"
                    value={formData.aboutHall}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                    rows="4"
                    placeholder="Describe your hall's features, amenities, and unique qualities..."
                    required
                  ></textarea>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hall Images (3-8 images required)
                  </label>
                  
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-all duration-200 mb-4">
                    <FaUpload className="mx-auto text-3xl text-gray-400 mb-3" />
                    <p className="text-gray-600 mb-2">Drag & drop images or click to browse</p>
                    <p className="text-sm text-gray-500 mb-4">Supports JPG, PNG, GIF - Max 8 images</p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 cursor-pointer"
                    >
                      <FaUpload className="mr-2" />
                      Choose Images
                    </label>
                  </div>

                  {/* Image Preview Grid */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-all duration-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-200 flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleImageDelete(index)}
                              className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200"
                            >
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Image Count */}
                  {formData.images.length > 0 && (
                    <div className="text-center mt-4">
                      <span className={`text-sm font-medium ${
                        formData.images.length >= 3 && formData.images.length <= 8 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {formData.images.length} of 8 images selected
                        {formData.images.length < 3 && ' (Minimum 3 required)'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="bg-gray-50 px-6 py-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={loading || formData.images.length < 3}
                  className={`px-8 py-3 font-semibold rounded-xl transition-all duration-200 flex items-center ${
                    loading || formData.images.length < 3
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="mr-2" />
                      Register Hall
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HallRegister;