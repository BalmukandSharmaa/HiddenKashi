import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { FaArrowLeft } from 'react-icons/fa';

const AddEditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      pincode: ''
    },
    contactNumber: '',
    contactEmail: '',
    amenities: [],
    roomTypes: [{ type: 'Standard', price: 0, capacity: 2, available: 1 }],
    images: [],
    location: {
      type: 'Point',
      coordinates: [77.1025, 28.7041] // Default to Delhi coordinates
    }
  });

  const amenitiesList = ['WiFi', 'Parking', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Room Service', 'Bar', 'Laundry'];

  useEffect(() => {
    if (isEditMode) {
      fetchHotelDetails();
    }
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.getHotelById(id);
      setFormData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load hotel details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleRoomTypeChange = (index, field, value) => {
    const newRoomTypes = [...formData.roomTypes];
    newRoomTypes[index] = {
      ...newRoomTypes[index],
      [field]: field === 'type' ? value : Number(value)
    };
    setFormData(prev => ({ ...prev, roomTypes: newRoomTypes }));
  };

  const addRoomType = () => {
    setFormData(prev => ({
      ...prev,
      roomTypes: [...prev.roomTypes, { type: '', price: 0, capacity: 2, available: 1 }]
    }));
  };

  const removeRoomType = (index) => {
    if (formData.roomTypes.length > 1) {
      setFormData(prev => ({
        ...prev,
        roomTypes: prev.roomTypes.filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageUrlAdd = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, url]
      }));
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await apiService.updateHotel(id, formData);
        alert('Hotel updated successfully!');
      } else {
        await apiService.createHotel(formData);
        alert('Hotel created successfully!');
      }
      navigate('/owner/hotels');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} hotel`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading hotel details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/owner/hotels')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <FaArrowLeft /> Back to Hotels
      </button>

      <h1 className="text-3xl font-bold mb-8">
        {isEditMode ? 'Edit Hotel' : 'Add New Hotel'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hotel Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Contact Number *</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contact Email *</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Address</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Street Address *</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State *</label>
                <input
                  type="text"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Country *</label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">PIN Code *</label>
                <input
                  type="text"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {amenitiesList.map(amenity => (
              <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Room Types */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Room Types</h2>
            <button
              type="button"
              onClick={addRoomType}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Add Room Type
            </button>
          </div>

          <div className="space-y-4">
            {formData.roomTypes.map((room, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Room Type *</label>
                    <input
                      type="text"
                      value={room.type}
                      onChange={(e) => handleRoomTypeChange(index, 'type', e.target.value)}
                      placeholder="e.g., Deluxe, Suite"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Price per Night *</label>
                    <input
                      type="number"
                      value={room.price}
                      onChange={(e) => handleRoomTypeChange(index, 'price', e.target.value)}
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Room Capacity *</label>
                    <input
                      type="number"
                      value={room.capacity}
                      onChange={(e) => handleRoomTypeChange(index, 'capacity', e.target.value)}
                      min="1"
                      placeholder="Max people"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Available Rooms *</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={room.available}
                        onChange={(e) => handleRoomTypeChange(index, 'available', e.target.value)}
                        min="1"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                      {formData.roomTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRoomType(index)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Images</h2>
            <button
              type="button"
              onClick={handleImageUrlAdd}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Add Image URL
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((url, index) => (
              <div key={index} className="relative group">
                <img src={url} alt={`Hotel ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/owner/hotels')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update Hotel' : 'Create Hotel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditHotel;
