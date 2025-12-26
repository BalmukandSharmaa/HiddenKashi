import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { FaArrowLeft } from 'react-icons/fa';

const AddEditTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    duration: {
      days: 1,
      nights: 1
    },
    price: {
      perPerson: 0,
      child: 0
    },
    maxGroupSize: 1,
    difficulty: 'moderate',
    inclusions: [],
    exclusions: [],
    itinerary: [{ day: 1, title: '', description: '', activities: [] }],
    availableDates: [],
    images: []
  });

  const [newInclude, setNewInclude] = useState('');
  const [newExclude, setNewExclude] = useState('');
  const [newDate, setNewDate] = useState('');

  useEffect(() => {
    if (isEditMode) {
      fetchTourDetails();
    }
  }, [id]);

  const fetchTourDetails = async () => {
    try {
      setLoading(true);
      const response = await apiService.getTourById(id);
      setFormData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tour details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index] = {
      ...newItinerary[index],
      [field]: field === 'day' ? Number(value) : value
    };
    setFormData(prev => ({ ...prev, itinerary: newItinerary }));
  };

  const addItineraryDay = () => {
    const nextDay = formData.itinerary.length + 1;
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, { day: nextDay, title: '', description: '' }]
    }));
  };

  const removeItineraryDay = (index) => {
    if (formData.itinerary.length > 1) {
      setFormData(prev => ({
        ...prev,
        itinerary: prev.itinerary.filter((_, i) => i !== index)
      }));
    }
  };

  const addInclude = () => {
    if (newInclude.trim()) {
      setFormData(prev => ({
        ...prev,
        inclusions: [...prev.inclusions, newInclude.trim()]
      }));
      setNewInclude('');
    }
  };

  const removeInclude = (index) => {
    setFormData(prev => ({
      ...prev,
      inclusions: prev.inclusions.filter((_, i) => i !== index)
    }));
  };

  const addExclude = () => {
    if (newExclude.trim()) {
      setFormData(prev => ({
        ...prev,
        exclusions: [...prev.exclusions, newExclude.trim()]
      }));
      setNewExclude('');
    }
  };

  const removeExclude = (index) => {
    setFormData(prev => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== index)
    }));
  };

  const addAvailableDate = () => {
    if (newDate) {
      setFormData(prev => ({
        ...prev,
        availableDates: [...prev.availableDates, newDate]
      }));
      setNewDate('');
    }
  };

  const removeAvailableDate = (index) => {
    setFormData(prev => ({
      ...prev,
      availableDates: prev.availableDates.filter((_, i) => i !== index)
    }));
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
        await apiService.updateTour(id, formData);
        alert('Tour updated successfully!');
      } else {
        await apiService.createTour(formData);
        alert('Tour created successfully!');
      }
      navigate('/owner/tours');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} tour`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading tour details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/owner/tours')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <FaArrowLeft /> Back to Tours
      </button>

      <h1 className="text-3xl font-bold mb-8">
        {isEditMode ? 'Edit Tour' : 'Add New Tour'}
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
              <label className="block text-sm font-medium mb-2">Tour Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
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
                <label className="block text-sm font-medium mb-2">Destination *</label>
                <input
                  type="text"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration (Days) *</label>
                <input
                  type="number"
                  name="duration.days"
                  value={formData.duration.days}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration (Nights) *</label>
                <input
                  type="number"
                  name="duration.nights"
                  value={formData.duration.nights}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price per Person *</label>
                <input
                  type="number"
                  name="price.perPerson"
                  value={formData.price.perPerson}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price for Child</label>
                <input
                  type="number"
                  name="price.child"
                  value={formData.price.child || ''}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max Group Size *</label>
                <input
                  type="number"
                  name="maxGroupSize"
                  value={formData.maxGroupSize}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Difficulty *</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="difficult">Difficult</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Itinerary</h2>
            <button
              type="button"
              onClick={addItineraryDay}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Add Day
            </button>
          </div>

          <div className="space-y-4">
            {formData.itinerary.map((day, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex gap-4 items-center">
                    <div className="w-20">
                      <label className="block text-sm font-medium mb-2">Day</label>
                      <input
                        type="number"
                        value={day.day}
                        onChange={(e) => handleItineraryChange(index, 'day', e.target.value)}
                        min="1"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">Title *</label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        required
                      />
                    </div>
                    {formData.itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItineraryDay(index)}
                        className="mt-6 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <textarea
                      value={day.description}
                      onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                      rows="2"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Includes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">What's Included</h2>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newInclude}
              onChange={(e) => setNewInclude(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInclude())}
              placeholder="Add included item"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
            />
            <button
              type="button"
              onClick={addInclude}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {formData.inclusions.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded">
                <span>✓ {item}</span>
                <button
                  type="button"
                  onClick={() => removeInclude(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Excludes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">What's Not Included</h2>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newExclude}
              onChange={(e) => setNewExclude(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExclude())}
              placeholder="Add excluded item"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
            />
            <button
              type="button"
              onClick={addExclude}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {formData.exclusions.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded">
                <span>✗ {item}</span>
                <button
                  type="button"
                  onClick={() => removeExclude(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Available Dates */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Available Dates</h2>
          
          <div className="flex gap-2 mb-4">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
            />
            <button
              type="button"
              onClick={addAvailableDate}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Add Date
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {formData.availableDates.map((date, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                <span className="text-sm">{new Date(date).toLocaleDateString()}</span>
                <button
                  type="button"
                  onClick={() => removeAvailableDate(index)}
                  className="text-red-600 hover:text-red-800 text-xl"
                >
                  ×
                </button>
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
                <img src={url} alt={`Tour ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
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
            onClick={() => navigate('/owner/tours')}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update Tour' : 'Create Tour')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditTour;
