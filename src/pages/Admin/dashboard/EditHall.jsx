import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaSpinner, FaBuilding, FaMapMarkerAlt, FaDollarSign, FaUsers, FaBroom, FaUtensils, FaBed, FaStickyNote } from 'react-icons/fa';
import BASE_URL from '../../config';
import { useAdminContext } from "../AdminContext";

const EditHall = () => {
  // State Management
  const { adminData } = useAdminContext();
  const { hallId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
  });

  // Fetch Hall Data
  useEffect(() => {
    const fetchHallData = async () => {
      if (!adminData?.user_id) return;

      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/hall/get_halls_for_admin_based/${adminData.user_id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const hall = response.data.halls.find((h) => h.id === parseInt(hallId));
        if (hall) {
          setFormData({
            hallName: hall.hall_name || "",
            hallLocation: hall.hall_location || "",
            hallAddress: hall.hall_address || "",
            hallPricePerDay: hall.hall_price_per_day || "",
            maintenanceChargePerDay: hall.maintenance_charge_per_day || "",
            cleaningChargePerDay: hall.cleaning_charge_per_day || "",
            cateringWorkMembers: hall.catering_work_members || "",
            totalHallCapacity: hall.total_hall_capacity || "",
            numberOfRooms: hall.number_of_rooms || "",
            aboutHall: hall.about_hall || "",
          });
        } else {
          setErrorMessage("Hall not found.");
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Failed to load hall data.");
      } finally {
        setLoading(false);
      }
    };

    fetchHallData();
  }, [adminData?.user_id, hallId]);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("hall_name", formData.hallName);
    data.append("hall_location", formData.hallLocation);
    data.append("hall_address", formData.hallAddress);
    data.append("hall_price_per_day", formData.hallPricePerDay);
    data.append("maintenance_charge_per_day", formData.maintenanceChargePerDay);
    data.append("cleaning_charge_per_day", formData.cleaningChargePerDay);
    data.append("catering_work_members", formData.cateringWorkMembers);
    data.append("total_hall_capacity", formData.totalHallCapacity);
    data.append("number_of_rooms", formData.numberOfRooms);
    data.append("about_hall", formData.aboutHall);

    try {
      const token = adminData.access_token
      await axios.put(`${BASE_URL}/hall/update/${hallId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Hall updated successfully!")
      navigate("/admin-Dashboard/my-halls", { state: { success: "Hall updated successfully!" } });
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || "Failed to update hall.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sm:px-6 lg:px-8">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-500 to-purple-600 py-12 shadow-lg">
          <h1 className="text-4xl font-bold text-white text-center">Edit Hall Details</h1>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="text-4xl text-indigo-600 animate-spin" />
            </div>
          ) : errorMessage ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg text-center">
              <p className="text-lg text-red-700 font-medium">{errorMessage}</p>
              <button
                onClick={() => navigate("/my-halls")}
                className="mt-4 inline-block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
              >
                Back to Halls
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto space-y-10">
              {/* Basic Information Section */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Basic Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <FaBuilding className="text-indigo-600" />
                      Hall Name
                    </label>
                    <input
                      type="text"
                      name="hallName"
                      value={formData.hallName}
                      onChange={handleInputChange}
                      placeholder="Enter hall name"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <FaMapMarkerAlt className="text-indigo-600" />
                      Hall Location
                    </label>
                    <input
                      type="text"
                      name="hallLocation"
                      value={formData.hallLocation}
                      onChange={handleInputChange}
                      placeholder="Enter location"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <FaMapMarkerAlt className="text-indigo-600" />
                      Hall Address
                    </label>
                    <input
                      type="text"
                      name="hallAddress"
                      value={formData.hallAddress}
                      onChange={handleInputChange}
                      placeholder="Enter full address"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
              </section>

              {/* Pricing Details Section */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Pricing Details</h2>
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <FaDollarSign className="text-indigo-600" />
                      Hall Price Per Day (₹)
                    </label>
                    <input
                      type="number"
                      name="hallPricePerDay"
                      value={formData.hallPricePerDay}
                      onChange={handleInputChange}
                      placeholder="Enter price per day"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <FaDollarSign className="text-indigo-600" />
                      Maintenance Charge Per Day (₹)
                    </label>
                    <input
                      type="number"
                      name="maintenanceChargePerDay"
                      value={formData.maintenanceChargePerDay}
                      onChange={handleInputChange}
                      placeholder="Enter maintenance charge"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <FaBroom className="text-indigo-600" />
                      Cleaning Charge Per Day (₹)
                    </label>
                    <input
                      type="number"
                      name="cleaningChargePerDay"
                      value={formData.cleaningChargePerDay}
                      onChange={handleInputChange}
                      placeholder="Enter cleaning charge"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </section>

              {/* Capacity and Staff Section */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Capacity and Staff</h2>
                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <FaUsers className="text-indigo-600" />
                      Total Hall Capacity
                    </label>
                    <input
                      type="number"
                      name="totalHallCapacity"
                      value={formData.totalHallCapacity}
                      onChange={handleInputChange}
                      placeholder="Enter total capacity"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <FaBed className="text-indigo-600" />
                      Number of Rooms
                    </label>
                    <input
                      type="number"
                      name="numberOfRooms"
                      value={formData.numberOfRooms}
                      onChange={handleInputChange}
                      placeholder="Enter number of rooms"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                      <FaUtensils className="text-indigo-600" />
                      Catering Work Members
                    </label>
                    <input
                      type="number"
                      name="cateringWorkMembers"
                      value={formData.cateringWorkMembers}
                      onChange={handleInputChange}
                      placeholder="Enter catering staff count"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min="0"
                      required
                    />
                  </div>
                </div>
              </section>

              {/* Description Section */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Description</h2>
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                    <FaStickyNote className="text-indigo-600" />
                    About Hall
                  </label>
                  <textarea
                    name="aboutHall"
                    value={formData.aboutHall}
                    onChange={handleInputChange}
                    placeholder="Provide a description of the hall"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows="5"
                  />
                </div>
              </section>

              {/* Actions Section */}
              <section className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/admin-Dashboard/my-halls")}
                  className="px-6 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors duration-200 ${
                    loading
                      ? "bg-indigo-600 text-white cursor-not-allowed opacity-70"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {loading && <FaSpinner className="animate-spin" />}
                  Save Changes
                </button>
              </section>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditHall;