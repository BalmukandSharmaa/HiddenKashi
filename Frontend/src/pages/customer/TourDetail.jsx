import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { FaStar, FaMapMarkerAlt, FaClock, FaUsers, FaCalendarAlt } from 'react-icons/fa';

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchTourDetails();
  }, [id]);

  const fetchTourDetails = async () => {
    try {
      const response = await apiService.getTourById(id);
      setTour(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tour details');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    return (tour?.price || 0) * numberOfPeople;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setError('');

    try {
      const bookingData = {
        bookingType: 'tour',
        tour: tour._id,
        tourStartDate: startDate,
        numberOfPeople: numberOfPeople,
        totalAmount: calculateTotalPrice()
      };

      await apiService.createBooking(bookingData);
      alert('Tour booking created successfully! Redirecting to your bookings...');
      navigate('/customer/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
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
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl">Loading tour details...</div>
    </div>;
  }

  if (error && !tour) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl text-red-600">{error}</div>
    </div>;
  }

  if (!tour) return null;

  const totalPrice = calculateTotalPrice();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Tour Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {tour.images?.slice(0, 4).map((image, index) => (
          <div key={index} className={`${index === 0 ? 'md:col-span-2 md:row-span-2' : ''} overflow-hidden rounded-lg`}>
            <img 
              src={image} 
              alt={`${tour.title} - ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              style={{ maxHeight: index === 0 ? '500px' : '240px' }}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tour Info */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-4">{tour.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <FaClock className="mr-2" />
                <span>{tour.duration} days</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                <span>{tour.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaUsers className="mr-2" />
                <span>Max {tour.maxGroupSize} people</span>
              </div>
              <div className="flex items-center">
                <FaStar className="text-yellow-500 mr-1" />
                <span className="font-semibold">{tour.rating?.toFixed(1) || 'N/A'}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(tour.difficulty)}`}>
                {tour.difficulty}
              </span>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">{tour.description}</p>
          </div>

          {/* Itinerary */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Tour Itinerary</h2>
              <div className="space-y-4">
                {tour.itinerary.map((item, index) => (
                  <div key={index} className="border-l-4 border-orange-500 pl-4 py-2">
                    <h3 className="font-semibold text-lg">Day {item.day}: {item.title}</h3>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Includes */}
          {tour.includes && tour.includes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tour.includes.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Excludes */}
          {tour.excludes && tour.excludes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">What's Not Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tour.excludes.map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Dates */}
          {tour.availableDates && tour.availableDates.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Available Dates</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {tour.availableDates.map((date, index) => (
                  <div key={index} className="flex items-center gap-2 text-gray-700">
                    <FaCalendarAlt className="text-orange-600" />
                    <span>{new Date(date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sticky top-24">
            <div className="mb-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                ₹{tour.price}
              </div>
              <p className="text-gray-600">per person</p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tour Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Number of People</label>
                <input
                  type="number"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                  min="1"
                  max={tour.maxGroupSize}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Max {tour.maxGroupSize} people per group
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">₹{tour.price} × {numberOfPeople} person{numberOfPeople > 1 ? 's' : ''}</span>
                  <span className="font-semibold">₹{totalPrice}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading || !startDate}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {bookingLoading ? 'Processing...' : 'Book Tour'}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Free cancellation up to 24 hours before tour</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
