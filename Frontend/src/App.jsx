import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Hotels from './pages/Hotels';
import Tours from './pages/Tours';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import HotelDetail from './pages/customer/HotelDetail';
import TourDetail from './pages/customer/TourDetail';
import MyBookings from './pages/customer/MyBookings';
import CustomerSupport from './pages/customer/Support';
import MyTickets from './pages/customer/MyTickets';
import BookingDetail from './pages/customer/BookingDetail';

// Owner Pages
import OwnerDashboard from './pages/owner/Dashboard';
import AddEditHotel from './pages/owner/AddEditHotel';
import AddEditTour from './pages/owner/AddEditTour';
import ManageHotels from './pages/owner/ManageHotels';
import ManageTours from './pages/owner/ManageTours';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import PendingHotels from './pages/admin/PendingHotels';
import PendingTours from './pages/admin/PendingTours';
import AllBookings from './pages/admin/AllBookings';
import PaymentsRefunds from './pages/admin/PaymentsRefunds';
import SupportTickets from './pages/admin/SupportTickets';
import ManageUsers from './pages/admin/ManageUsers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/tours" element={<Tours />} />
              <Route path="/hotels/:id" element={<HotelDetail />} />
              <Route path="/tours/:id" element={<TourDetail />} />

              {/* Customer Routes */}
              <Route
                path="/customer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/bookings"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <MyBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/bookings/:id"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <BookingDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/support"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerSupport />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer/tickets"
                element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <MyTickets />
                  </ProtectedRoute>
                }
              />

              {/* Owner Routes */}
              <Route
                path="/owner/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['hotel_owner']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/hotels"
                element={
                  <ProtectedRoute allowedRoles={['hotel_owner']}>
                    <ManageHotels />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/hotels/add"
                element={
                  <ProtectedRoute allowedRoles={['hotel_owner']}>
                    <AddEditHotel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/hotels/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['hotel_owner']}>
                    <AddEditHotel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/tours"
                element={
                  <ProtectedRoute allowedRoles={['hotel_owner']}>
                    <ManageTours />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/tours/add"
                element={
                  <ProtectedRoute allowedRoles={['hotel_owner']}>
                    <AddEditTour />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/tours/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={['hotel_owner']}>
                    <AddEditTour />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/hotels"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <PendingHotels />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/tours"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <PendingTours />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AllBookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/payments"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <PaymentsRefunds />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/support"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SupportTickets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <ManageUsers />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

