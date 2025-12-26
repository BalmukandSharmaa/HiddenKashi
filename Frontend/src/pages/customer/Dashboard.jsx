import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';
import { FiCalendar, FiCreditCard, FiHelpCircle } from 'react-icons/fi';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await apiService.getMyBookings();
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-fadeIn">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.fullName}! 👋
          </h1>
          <p className="text-gray-600 text-lg mb-8">Ready for your next adventure?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Link to="/hotels" className="group">
            <div className="card card-hover p-8 text-center animate-slideUp">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiCalendar className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">New Booking</h3>
              <p className="text-gray-600">Discover amazing hotels & tours</p>
              <div className="mt-4 inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                Book Now <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link to="/customer/bookings" className="group">
            <div className="card card-hover p-8 text-center animate-slideUp" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiCreditCard className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">My Bookings</h3>
              <p className="text-gray-600">{bookings.length} active bookings</p>
              <div className="mt-4 inline-flex items-center text-green-600 font-semibold group-hover:text-green-700">
                View All <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link to="/customer/tickets" className="group">
            <div className="card card-hover p-8 text-center animate-slideUp" style={{animationDelay: '0.2s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiHelpCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">My Tickets</h3>
              <p className="text-gray-600">Track support requests</p>
              <div className="mt-4 inline-flex items-center text-purple-600 font-semibold group-hover:text-purple-700">
                View Tickets <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          <Link to="/customer/support" className="group">
            <div className="card card-hover p-8 text-center animate-slideUp" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiHelpCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Get Support</h3>
              <p className="text-gray-600">We're here to help you</p>
              <div className="mt-4 inline-flex items-center text-orange-600 font-semibold group-hover:text-orange-700">
                Contact Us <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="card p-8 animate-slideUp" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Recent Bookings
            </h2>
            <Link to="/customer/bookings" className="btn-primary">
              View All Bookings
            </Link>
          </div>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="spinner mb-4"></div>
              <p className="text-gray-600 animate-pulse">Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                <FiCalendar className="text-3xl text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings yet</h3>
              <p className="text-gray-500 mb-6">Start your journey by booking your first trip!</p>
              <Link to="/hotels" className="btn-primary">
                Explore Hotels & Tours
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.bookingType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.hotel?.name || booking.tour?.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{booking.totalAmount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            to={`/customer/bookings/${booking._id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
