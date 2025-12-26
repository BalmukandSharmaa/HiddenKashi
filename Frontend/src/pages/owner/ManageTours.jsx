import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { FaEdit, FaTrash, FaPlus, FaMapMarkedAlt, FaStar, FaClock } from 'react-icons/fa';

const ManageTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMyTours();
  }, []);

  const fetchMyTours = async () => {
    try {
      const response = await apiService.getMyTours();
      setTours(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tours');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tour?')) {
      return;
    }

    setDeletingId(id);
    try {
      await apiService.deleteTour(id);
      alert('Tour deleted successfully!');
      fetchMyTours();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete tour');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      difficult: 'bg-red-100 text-red-800'
    };
    return colors[difficulty?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading your tours...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Tours</h1>
        <Link
          to="/owner/tours/add"
          className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
        >
          <FaPlus /> Add New Tour
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {tours.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FaMapMarkedAlt className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No tours yet</h2>
          <p className="text-gray-500 mb-6">Start by adding your first tour package</p>
          <Link
            to="/owner/tours/add"
            className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            <FaPlus /> Add New Tour
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div key={tour._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <img
                  src={tour.images?.[0] || 'https://via.placeholder.com/400x300?text=Tour'}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusBadge(tour.status)}`}>
                  {tour.status}
                </span>
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(tour.difficulty)}`}>
                  {tour.difficulty}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 truncate">{tour.title}</h3>
                
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <FaMapMarkedAlt className="text-orange-600" />
                  <span className="text-sm truncate">{tour.location}</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-500" />
                    <span className="font-semibold">{tour.rating?.toFixed(1) || 'N/A'}</span>
                    <span className="text-gray-500 text-sm">({tour.reviewCount || 0} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <FaClock />
                    <span className="text-sm">{tour.duration} days</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">₹{tour.price}</span>
                    <span className="text-sm text-gray-600">per person</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Max {tour.maxGroupSize} people</p>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/owner/tours/edit/${tour._id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaEdit /> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(tour._id)}
                    disabled={deletingId === tour._id}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    <FaTrash /> {deletingId === tour._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTours;
