import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { FaMapMarkedAlt, FaCheck, FaTimes, FaStar, FaClock } from 'react-icons/fa';

const PendingTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingTours();
  }, []);

  const fetchPendingTours = async () => {
    try {
      const response = await apiService.getAllTours();
      const pending = response.data.filter(tour => tour.status === 'pending');
      setTours(pending);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pending tours');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await apiService.updateTourStatus(id, { status: 'approved' });
      alert('Tour approved successfully!');
      fetchPendingTours();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve tour');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Reason for rejection (optional):');
    setProcessingId(id);
    
    try {
      await apiService.updateTourStatus(id, { status: 'rejected', rejectionReason: reason });
      alert('Tour rejected!');
      fetchPendingTours();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject tour');
    } finally {
      setProcessingId(null);
    }
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
        <div className="text-xl">Loading pending tours...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pending Tour Approvals</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {tours.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FaMapMarkedAlt className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No pending tours</h2>
          <p className="text-gray-500">All tours have been reviewed</p>
        </div>
      ) : (
        <div className="space-y-6">
          {tours.map((tour) => (
            <div key={tour._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={tour.images?.[0] || 'https://via.placeholder.com/400x300?text=Tour'}
                    alt={tour.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>

                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{tour.title}</h2>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaMapMarkedAlt className="text-orange-600" />
                          <span>{tour.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaClock />
                          <span>{tour.duration} days</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <FaStar className="text-yellow-500" />
                          <span className="font-semibold">{tour.rating?.toFixed(1) || 'New'}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(tour.difficulty)}`}>
                          {tour.difficulty}
                        </span>
                      </div>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold border border-yellow-300">
                      Pending
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">{tour.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold mb-2">Tour Details</h3>
                      <p className="text-sm text-gray-600">Price: ₹{tour.price} per person</p>
                      <p className="text-sm text-gray-600">Max Group Size: {tour.maxGroupSize} people</p>
                    </div>

                    {tour.includes && tour.includes.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Includes</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {tour.includes.slice(0, 3).map((item, index) => (
                            <li key={index}>✓ {item}</li>
                          ))}
                          {tour.includes.length > 3 && (
                            <li className="text-gray-500">+{tour.includes.length - 3} more items</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {tour.itinerary && tour.itinerary.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Itinerary Preview</h3>
                      <div className="space-y-2">
                        {tour.itinerary.slice(0, 2).map((day, index) => (
                          <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                            <span className="font-medium">Day {day.day}: {day.title}</span>
                          </div>
                        ))}
                        {tour.itinerary.length > 2 && (
                          <p className="text-sm text-gray-500">+{tour.itinerary.length - 2} more days</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(tour._id)}
                      disabled={processingId === tour._id}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <FaCheck /> {processingId === tour._id ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(tour._id)}
                      disabled={processingId === tour._id}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <FaTimes /> {processingId === tour._id ? 'Processing...' : 'Reject'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingTours;
