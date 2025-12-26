import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch booking details by ID
    // For now, showing a placeholder
    setTimeout(() => {
      setBooking({
        _id: id,
        bookingType: 'hotel',
        hotel: {
          name: 'Sample Hotel',
          address: 'Sample Address'
        },
        checkIn: '2025-12-20',
        checkOut: '2025-12-22',
        guests: 2,
        totalAmount: 5000,
        status: 'confirmed',
        bookingDate: '2025-12-19'
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/customer/bookings')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <FiArrowLeft /> Back to Bookings
          </button>
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
            <p className="text-gray-600">The booking you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/customer/bookings')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <FiArrowLeft /> Back to Bookings
        </button>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="bg-orange-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Booking Details</h1>
                <p className="text-orange-100">ID: {booking._id}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FiMapPin className="text-gray-500" />
                    <div>
                      <p className="font-medium">{booking.hotel?.name}</p>
                      <p className="text-sm text-gray-600">{booking.hotel?.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <FiCalendar className="text-gray-500" />
                    <div>
                      <p className="font-medium">Check-in: {booking.checkIn}</p>
                      <p className="text-sm text-gray-600">Check-out: {booking.checkOut}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <FiUsers className="text-gray-500" />
                    <div>
                      <p className="font-medium">{booking.guests} Guests</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="text-2xl font-bold text-orange-600">₹{booking.totalAmount}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Booking Date:</span>
                    <span>{booking.bookingDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="flex gap-4">
                {booking.status === 'confirmed' && (
                  <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                    Cancel Booking
                  </button>
                )}
                <button
                  onClick={() => navigate('/customer/support')}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                  Get Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;