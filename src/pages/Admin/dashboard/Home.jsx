import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdminContext } from "../AdminContext";
import { FaUser, FaLocationArrow, FaDollarSign, FaRegFileImage } from "react-icons/fa";
import BASE_URL from '../../config';

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
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const handleImageDelete = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length < 3 || formData.images.length > 8) {
      setErrorMessage("Please upload between 3 to 8 images.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

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
        setSuccessMessage("Hall registered successfully!");
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
        navigate("/admin-Dashboard/my-halls");
      } else {
        setErrorMessage("Failed to register hall. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  ">
      {/* Navbar */}
      {/* Add your navbar here */}

      {/* Main Content */}
      <div className="w-full h-screen p-0">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 py-12 shadow-lg">
          <h1 className="text-4xl font-bold text-white text-center">
            Register a Hall
          </h1>
        </div>


        {/* Messages */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form
          className="bg-white  overflow-y-auto p-8 shadow-2xl space-y-6 mt-2"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          {/* Section 1: Basic Information */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6  decoration-purple-500 decoration-4 bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent">
              Basic Information
            </h2>

            <div className="space-y-6">
              {/* Hall Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hall Name
                </label>
                <input
                  type="text"
                  name="hallName"
                  value={formData.hallName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Location and Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="hallLocation"
                    value={formData.hallLocation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="hallAddress"
                    value={formData.hallAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing and Capacity */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6  decoration-purple-500 decoration-4 bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent">Pricing and Capacity</h2>
            <div className="space-y-6">
              {/* Pricing Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Per Day
                  </label>
                  <input
                    type="number"
                    name="hallPricePerDay"
                    value={formData.hallPricePerDay}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maintenance Charge
                  </label>
                  <input
                    type="number"
                    name="maintenanceChargePerDay"
                    value={formData.maintenanceChargePerDay}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cleaning Charge
                  </label>
                  <input
                    type="number"
                    name="cleaningChargePerDay"
                    value={formData.cleaningChargePerDay}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Catering and Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catering Work Members
                  </label>
                  <input
                    type="number"
                    name="cateringWorkMembers"
                    value={formData.cateringWorkMembers}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Hall Capacity
                  </label>
                  <input
                    type="number"
                    name="totalHallCapacity"
                    value={formData.totalHallCapacity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Rooms
                  </label>
                  <input
                    type="number"
                    name="numberOfRooms"
                    value={formData.numberOfRooms}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Additional Details */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6  decoration-purple-500 decoration-4 bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent">Additional Details</h2>
            <div className="space-y-6">
              {/* About Hall */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Hall
                </label>
                <textarea
                  name="aboutHall"
                  value={formData.aboutHall}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows="4"
                  required
                ></textarea>
              </div>

              {/* Hall Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hall Images (3-8 images)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <div className="mt-4 flex flex-wrap gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Image ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageDelete(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Register Hall"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HallRegister;