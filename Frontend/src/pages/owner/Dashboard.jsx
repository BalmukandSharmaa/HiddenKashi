import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { hotelService, tourService, bookingService } from '../../services/apiService';
import { FiHome, FiMap, FiCalendar, FiPlus } from 'react-icons/fi';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    hotels: 0,
    tours: 0,
    bookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [hotelsRes, toursRes, bookingsRes] = await Promise.all([
        hotelService.getMyHotels(),
        tourService.getMyTours(),
        bookingService.getOwnerBookings(),
      ]);
      setStats({
        hotels: hotelsRes.data?.length || 0,
        tours: toursRes.data?.length || 0,
        bookings: bookingsRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-slideUp">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome, {user?.fullName}!
          </h1>
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-500 text-white px-6 py-2 rounded-full text-lg font-semibold shadow-lg">
              🏢 {user?.businessName}
            </div>
          </div>
          <p className="text-xl text-gray-600">
            Manage your business with our powerful owner tools
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { label: 'Total Hotels', value: stats.hotels, icon: FiHome, gradient: 'from-emerald-500 to-teal-500' },
            { label: 'Total Tours', value: stats.tours, icon: FiMap, gradient: 'from-blue-500 to-indigo-500' },
            { label: 'Total Bookings', value: stats.bookings, icon: FiCalendar, gradient: 'from-purple-500 to-pink-500' }
          ].map((stat, index) => (
            <div key={index} className="glass-card rounded-2xl p-8 hover:scale-105 transition-all duration-300 animate-slideUp" style={{animationDelay: `${0.2 + index * 0.1}s`}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stat.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-4 shadow-lg`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="animate-slideUp" style={{animationDelay: '0.5s'}}>
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { to: '/owner/hotels/add', title: 'Add New Hotel', desc: 'List a new property on the platform', icon: FiPlus, gradient: 'from-emerald-500 to-teal-500', emoji: '🏨' },
              { to: '/owner/tours/add', title: 'Add New Tour', desc: 'Create an amazing tour package', icon: FiPlus, gradient: 'from-blue-500 to-indigo-500', emoji: '🗺️' },
              { to: '/owner/hotels', title: 'Manage Hotels', desc: 'View, edit, and update your hotels', icon: FiHome, gradient: 'from-purple-500 to-pink-500', emoji: '🏢' },
              { to: '/owner/tours', title: 'Manage Tours', desc: 'View, edit, and update your tours', icon: FiMap, gradient: 'from-orange-500 to-red-500', emoji: '✈️' }
            ].map((action, index) => (
              <Link 
                key={index} 
                to={action.to} 
                className="glass-card rounded-2xl p-8 hover:scale-105 hover:shadow-2xl transition-all duration-300 group animate-slideUp"
                style={{animationDelay: `${0.6 + index * 0.1}s`}}
              >
                <div className="flex items-start space-x-4">
                  <div className={`bg-gradient-to-br ${action.gradient} rounded-2xl p-4 shadow-lg group-hover:scale-110 transition-transform duration-200 flex items-center justify-center`}>
                    <span className="text-2xl">{action.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-200">{action.title}</h3>
                    <p className="text-gray-600">{action.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
