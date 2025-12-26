import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { FaHotel, FaMapMarkedAlt, FaCalendarAlt, FaUsers, FaMoneyBillWave, FaFilter } from 'react-icons/fa';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchAllBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterStatus, filterType, bookings]);

  const fetchAllBookings = async () => {
    try {
      const response = await apiService.getAllBookings();
      setBookings(response.data);
      setFilteredBookings(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(b => b.status === filterStatus);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(b => b.bookingType === filterType);
    }

    setFilteredBookings(filtered);
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      return;
    }

    try {
      await apiService.updateBookingStatus(bookingId, { status: newStatus });
      alert('Booking status updated successfully!');
      fetchAllBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status');
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
        <div className="text-xl">Loading all bookings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Bookings</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center gap-4">
          <FaFilter className="text-gray-600" />
          <div className="flex gap-4 flex-wrap">
            <div>
              <label className="text-sm font-medium mr-2">Status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mr-2">Type:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1"
              >
                <option value="all">All</option>
                <option value="hotel">Hotel</option>
                <option value="tour">Tour</option>
              </select>
            </div>

            <div className="ml-auto text-sm text-gray-600">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No bookings found</h2>
          <p className="text-gray-500">Try adjusting the filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
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
                        <p className="text-sm text-gray-500">
                          Booking ID: {booking._id.slice(-8)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-medium text-gray-800">Customer</p>
                        <p>{booking.customer?.name || 'N/A'}</p>
                        <p>{booking.customer?.email || ''}</p>
                      </div>

                      {booking.bookingType === 'hotel' ? (
                        <>
                          <div>
                            <p className="font-medium text-gray-800">Check-in / Check-out</p>
                            <p>{new Date(booking.checkInDate).toLocaleDateString()}</p>
                            <p>{new Date(booking.checkOutDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Details</p>
                            <p>Room: {booking.roomType}</p>
                            <p>Guests: {booking.numberOfGuests}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="font-medium text-gray-800">Tour Start Date</p>
                            <p>{new Date(booking.tourStartDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Details</p>
                            <p>People: {booking.numberOfPeople}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-orange-600">₹{booking.totalAmount}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>

                {booking.payment && (
                  <div className="mb-4 pt-4 border-t flex items-center gap-2 text-sm text-gray-600">
                    <FaMoneyBillWave className="text-green-600" />
                    <span>
                      Payment: <span className="font-semibold capitalize">{booking.payment.status}</span>
                      {booking.payment.method && <> | Method: {booking.payment.method}</>}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusUpdate(booking._id, 'completed')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}

                  <div className="ml-auto text-sm text-gray-500">
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
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

export default AllBookings;
