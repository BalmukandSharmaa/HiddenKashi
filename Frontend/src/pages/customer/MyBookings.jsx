import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { FaHotel, FaMapMarkedAlt, FaCalendarAlt, FaUsers, FaMoneyBillWave, FaInfoCircle } from 'react-icons/fa';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const response = await apiService.getMyBookings();
      setBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await apiService.cancelBooking(bookingId);
      alert('Booking cancelled successfully!');
      fetchMyBookings(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <FaInfoCircle className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No bookings yet</h2>
          <p className="text-gray-500 mb-6">Start exploring and book your first adventure!</p>
          <div className="space-x-4">
            <Link
              to="/hotels"
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Browse Hotels
            </Link>
            <Link
              to="/tours"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Tours
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {booking.bookingType === 'hotel' ? (
                        <FaHotel className="text-2xl text-orange-600" />
                      ) : (
                        <FaMapMarkedAlt className="text-2xl text-blue-600" />
                      )}
                      <div>
                        <h2 className="text-xl font-bold">
                          {booking.bookingType === 'hotel' 
                            ? booking.hotel?.name || 'Hotel Booking'
                            : booking.tour?.title || 'Tour Booking'}
                        </h2>
                        <span className="text-sm text-gray-500 capitalize">
                          {booking.bookingType} Booking
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                      {booking.bookingType === 'hotel' ? (
                        <>
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" />
                            <div>
                              <p className="text-sm">Check-in</p>
                              <p className="font-semibold text-gray-800">
                                {new Date(booking.checkInDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" />
                            <div>
                              <p className="text-sm">Check-out</p>
                              <p className="font-semibold text-gray-800">
                                {new Date(booking.checkOutDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaUsers className="text-gray-400" />
                            <div>
                              <p className="text-sm">Guests</p>
                              <p className="font-semibold text-gray-800">{booking.numberOfGuests}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaHotel className="text-gray-400" />
                            <div>
                              <p className="text-sm">Room Type</p>
                              <p className="font-semibold text-gray-800">{booking.roomType}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" />
                            <div>
                              <p className="text-sm">Tour Start Date</p>
                              <p className="font-semibold text-gray-800">
                                {new Date(booking.tourStartDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaUsers className="text-gray-400" />
                            <div>
                              <p className="text-sm">Number of People</p>
                              <p className="font-semibold text-gray-800">{booking.numberOfPeople}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-orange-600">₹{booking.totalAmount}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                  
                  {booking.status === 'pending' || booking.status === 'confirmed' ? (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      disabled={cancellingId === booking._id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                    </button>
                  ) : null}
                </div>

                {booking.payment && (
                  <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm text-gray-600">
                    <FaMoneyBillWave className="text-green-600" />
                    <span>
                      Payment Status: <span className="font-semibold capitalize">{booking.payment.status}</span>
                      {booking.payment.transactionId && (
                        <> | Transaction ID: {booking.payment.transactionId}</>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
