import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { hotelService, tourService, bookingService, paymentService } from '../../services/apiService';
import { FiHome, FiMap, FiCalendar, FiDollarSign, FiUsers, FiHelpCircle } from 'react-icons/fi';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    pendingHotels: 0,
    pendingTours: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [hotelsRes, toursRes, bookingsRes, paymentsRes] = await Promise.all([
        hotelService.getAllAdmin({ status: 'pending' }),
        tourService.getAllAdmin({ status: 'pending' }),
        bookingService.getAllAdmin(),
        paymentService.getStats(),
      ]);

      setStats({
        pendingHotels: hotelsRes.data?.length || 0,
        pendingTours: toursRes.data?.length || 0,
        totalBookings: bookingsRes.data?.length || 0,
        totalRevenue: paymentsRes.data?.totalRevenue || 0,
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
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Manage your platform with powerful admin tools
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {[
            { label: 'Pending Hotels', value: stats.pendingHotels, icon: FiHome, gradient: 'from-yellow-500 to-orange-500' },
            { label: 'Pending Tours', value: stats.pendingTours, icon: FiMap, gradient: 'from-green-500 to-green-600' },
            { label: 'Total Bookings', value: stats.totalBookings, icon: FiCalendar, gradient: 'from-gray-600 to-gray-700' },
            { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: FiDollarSign, gradient: 'from-green-500 to-green-600' }
          ].map((stat, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 hover:scale-105 transition-all duration-300 animate-slideUp shadow-lg" style={{animationDelay: `${index * 0.1}s`}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{loading ? '...' : stat.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-4 shadow-lg`}>
                  <stat.icon className="text-white text-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="animate-slideUp" style={{animationDelay: '0.4s'}}>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { to: '/admin/hotels', title: 'Manage Hotels', desc: 'Approve & reject hotel listings', icon: FiHome, gradient: 'from-green-500 to-green-600' },
              { to: '/admin/tours', title: 'Manage Tours', desc: 'Approve & reject tour packages', icon: FiMap, gradient: 'from-gray-600 to-gray-700' },
              { to: '/admin/bookings', title: 'View Bookings', desc: 'Monitor all platform bookings', icon: FiCalendar, gradient: 'from-green-500 to-green-600' },
              { to: '/admin/payments', title: 'Payments & Refunds', desc: 'Process payments & refunds', icon: FiDollarSign, gradient: 'from-gray-600 to-gray-700' },
              { to: '/admin/users', title: 'User Management', desc: 'Manage platform users', icon: FiUsers, gradient: 'from-green-500 to-green-600' },
              { to: '/admin/support', title: 'Support Tickets', desc: 'Help customers resolve issues', icon: FiHelpCircle, gradient: 'from-gray-600 to-gray-700' }
            ].map((action, index) => (
              <Link 
                key={index} 
                to={action.to} 
                className="bg-white border border-gray-200 rounded-xl p-8 hover:scale-105 hover:shadow-xl transition-all duration-300 group animate-slideUp shadow-lg"
                style={{animationDelay: `${0.5 + index * 0.1}s`}}
              >
                <div className="flex items-start space-x-4">
                  <div className={`bg-gradient-to-br ${action.gradient} rounded-xl p-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="text-white text-2xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-200">{action.title}</h3>
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

export default AdminDashboard;
