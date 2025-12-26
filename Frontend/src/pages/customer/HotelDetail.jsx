import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaWifi, FaParking, FaSwimmingPool, FaDumbbell } from 'react-icons/fa';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchHotelDetails();
  }, [id]);

  const fetchHotelDetails = async () => {
    try {
      const response = await apiService.getHotelById(id);
      setHotel(response.data);
      if (response.data.roomTypes?.length > 0) {
        setSelectedRoom(response.data.roomTypes[0].type);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load hotel details');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut || !selectedRoom) return 0;
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    const room = hotel.roomTypes.find(r => r.type === selectedRoom);
    return nights * (room?.price || 0);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setError('');

    try {
      const bookingData = {
        bookingType: 'hotel',
        hotel: hotel._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guests,
        roomType: selectedRoom,
        totalAmount: calculateTotalPrice()
      };

      await apiService.createBooking(bookingData);
      alert('Booking created successfully! Redirecting to your bookings...');
      navigate('/customer/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setBookingLoading(false);
    }
  };

  const amenityIcons = {
    wifi: <FaWifi />,
    parking: <FaParking />,
    pool: <FaSwimmingPool />,
    gym: <FaDumbbell />
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl">Loading hotel details...</div>
    </div>;
  }

  if (error && !hotel) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl text-red-600">{error}</div>
    </div>;
  }

  if (!hotel) return null;

  const totalPrice = calculateTotalPrice();
  const nights = checkIn && checkOut ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hotel Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {hotel.images?.slice(0, 4).map((image, index) => (
          <div key={index} className={`${index === 0 ? 'md:col-span-2 md:row-span-2' : ''} overflow-hidden rounded-lg`}>
            <img 
              src={image} 
              alt={`${hotel.name} - ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              style={{ maxHeight: index === 0 ? '500px' : '240px' }}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hotel Info */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-4xl font-bold mb-2">{hotel.name}</h1>
            <div className="flex items-center gap-4 text-gray-600 mb-4">
              <div className="flex items-center">
                <FaStar className="text-yellow-500 mr-1" />
                <span className="font-semibold">{hotel.rating?.toFixed(1) || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="mr-1" />
                <span>{hotel.location.address}, {hotel.location.city}</span>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{hotel.description}</p>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {hotel.amenities?.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-700">
                  {amenityIcons[amenity.toLowerCase()] || <FaStar />}
                  <span className="capitalize">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Room Types */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Room Types</h2>
            <div className="space-y-4">
              {hotel.roomTypes?.map((room, index) => (
                <div key={index} className="border rounded-lg p-4 hover:border-orange-500 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold">{room.type}</h3>
                      <p className="text-gray-600">Available: {room.available} rooms</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">₹{room.price}</p>
                      <p className="text-sm text-gray-600">per night</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaPhone className="text-orange-600" />
                <span>{hotel.contactNumber}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-orange-600" />
                <span>{hotel.contactEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Book Your Stay</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Room Type</label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                >
                  {hotel.roomTypes?.map((room, index) => (
                    <option key={index} value={room.type}>
                      {room.type} - ₹{room.price}/night
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Check-in Date</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Check-out Date</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Number of Guests</label>
                <input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  min="1"
                  max="10"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              {nights > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">{nights} nights</span>
                    <span className="font-semibold">₹{totalPrice}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-orange-600">₹{totalPrice}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={bookingLoading || !checkIn || !checkOut}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {bookingLoading ? 'Processing...' : 'Book Now'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
