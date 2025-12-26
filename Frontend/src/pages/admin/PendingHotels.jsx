import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { FaHotel, FaCheck, FaTimes, FaMapMarkerAlt, FaStar } from 'react-icons/fa';

const PendingHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingHotels();
  }, []);

  const fetchPendingHotels = async () => {
    try {
      const response = await apiService.getAllHotels();
      const pending = response.data.filter(hotel => hotel.status === 'pending');
      setHotels(pending);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pending hotels');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await apiService.updateHotelStatus(id, { status: 'approved' });
      alert('Hotel approved successfully!');
      fetchPendingHotels();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve hotel');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Reason for rejection (optional):');
    setProcessingId(id);
    
    try {
      await apiService.updateHotelStatus(id, { status: 'rejected', rejectionReason: reason });
      alert('Hotel rejected!');
      fetchPendingHotels();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject hotel');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading pending hotels...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pending Hotel Approvals</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {hotels.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FaHotel className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No pending hotels</h2>
          <p className="text-gray-500">All hotels have been reviewed</p>
        </div>
      ) : (
        <div className="space-y-6">
          {hotels.map((hotel) => (
            <div key={hotel._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={hotel.images?.[0] || 'https://via.placeholder.com/400x300?text=Hotel'}
                    alt={hotel.name}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>

                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{hotel.name}</h2>
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <FaMapMarkerAlt className="text-orange-600" />
                        <span>{hotel.location.address}, {hotel.location.city}, {hotel.location.state}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaStar className="text-yellow-500" />
                        <span className="font-semibold">{hotel.rating?.toFixed(1) || 'New'}</span>
                      </div>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold border border-yellow-300">
                      Pending
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-3">{hotel.description}</p>

                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <p className="text-sm text-gray-600">Phone: {hotel.contactNumber}</p>
                    <p className="text-sm text-gray-600">Email: {hotel.contactEmail}</p>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities?.map((amenity, index) => (
                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Room Types</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {hotel.roomTypes?.map((room, index) => (
                        <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                          <span className="font-medium">{room.type}:</span> ₹{room.price}/night ({room.available} available)
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(hotel._id)}
                      disabled={processingId === hotel._id}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <FaCheck /> {processingId === hotel._id ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(hotel._id)}
                      disabled={processingId === hotel._id}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <FaTimes /> {processingId === hotel._id ? 'Processing...' : 'Reject'}
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

export default PendingHotels;
