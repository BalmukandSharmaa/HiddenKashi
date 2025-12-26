import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    try {
      console.log('API Service login called');
      const response = await api.post('/users/login', credentials);
      console.log('API response received:', response);
      if (response.data.success) {
        // Secure token storage
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        localStorage.setItem('loginTime', Date.now().toString());
        localStorage.setItem('lastActivity', Date.now().toString());
        
        // Set session marker
        sessionStorage.setItem('sessionActive', 'true');
      }
      return response.data;
    } catch (error) {
      console.error('API Service login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.log('Server logout failed, continuing with local cleanup');
    } finally {
      // Always clear local storage regardless of server response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('loginTime');
      localStorage.removeItem('lastActivity');
      sessionStorage.clear();
    }
  },

  // Check if session is valid
  isSessionValid: () => {
    const loginTime = localStorage.getItem('loginTime');
    const lastActivity = localStorage.getItem('lastActivity');
    const sessionActive = sessionStorage.getItem('sessionActive');
    
    if (!loginTime || !lastActivity || !sessionActive) {
      return false;
    }
    
    const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    const timeSinceActivity = Date.now() - parseInt(lastActivity);
    
    return timeSinceActivity < IDLE_TIMEOUT;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.patch('/users/update-profile', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.patch('/users/change-password', data);
    return response.data;
  },
};

export const hotelService = {
  getAll: async (params) => {
    const response = await api.get('/hotels', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/hotels/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/hotels', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/hotels/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/hotels/${id}`);
    return response.data;
  },

  getMyHotels: async () => {
    const response = await api.get('/hotels/owner/my-hotels');
    return response.data;
  },

  // Admin
  getAllAdmin: async (params) => {
    const response = await api.get('/hotels/admin/all', { params });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/hotels/admin/${id}/status`, { status });
    return response.data;
  },
};

export const tourService = {
  getAll: async (params) => {
    const response = await api.get('/tours', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/tours/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/tours', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/tours/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/tours/${id}`);
    return response.data;
  },

  getMyTours: async () => {
    const response = await api.get('/tours/owner/my-tours');
    return response.data;
  },

  // Admin
  getAllAdmin: async (params) => {
    const response = await api.get('/tours/admin/all', { params });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/tours/admin/${id}/status`, { status });
    return response.data;
  },
};

export const bookingService = {
  create: async (data) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getMyBookings: async (params) => {
    const response = await api.get('/bookings/my-bookings', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  cancel: async (id, reason) => {
    const response = await api.patch(`/bookings/${id}/cancel`, { cancellationReason: reason });
    return response.data;
  },

  // Owner
  getOwnerBookings: async (params) => {
    const response = await api.get('/bookings/owner/bookings', { params });
    return response.data;
  },

  // Admin
  getAllAdmin: async (params) => {
    const response = await api.get('/bookings/admin/all', { params });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/bookings/admin/${id}/status`, { status });
    return response.data;
  },
};

export const paymentService = {
  create: async (data) => {
    const response = await api.post('/payments', data);
    return response.data;
  },

  getMyPayments: async () => {
    const response = await api.get('/payments/my-payments');
    return response.data;
  },

  getByBooking: async (bookingId) => {
    const response = await api.get(`/payments/booking/${bookingId}`);
    return response.data;
  },

  // Admin
  getAllAdmin: async (params) => {
    const response = await api.get('/payments/admin/all', { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/payments/admin/stats');
    return response.data;
  },

  processRefund: async (paymentId, data) => {
    const response = await api.post(`/payments/admin/${paymentId}/refund`, data);
    return response.data;
  },
};

export const reviewService = {
  create: async (data) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  getByHotel: async (hotelId) => {
    const response = await api.get(`/reviews/hotel/${hotelId}`);
    return response.data;
  },

  getByTour: async (tourId) => {
    const response = await api.get(`/reviews/tour/${tourId}`);
    return response.data;
  },

  getMyReviews: async () => {
    const response = await api.get('/reviews/my-reviews');
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.patch(`/reviews/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  // Admin
  approve: async (id) => {
    const response = await api.patch(`/reviews/admin/${id}/approve`);
    return response.data;
  },

  reject: async (id) => {
    const response = await api.patch(`/reviews/admin/${id}/reject`);
    return response.data;
  },

  getPendingAdmin: async () => {
    const response = await api.get('/reviews/admin/pending');
    return response.data;
  },
};

export const supportService = {
  create: async (data) => {
    const response = await api.post('/support', data);
    return response.data;
  },

  getMyTickets: async () => {
    const response = await api.get('/support/my-tickets');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/support/${id}`);
    return response.data;
  },

  addMessage: async (id, data) => {
    const response = await api.post(`/support/${id}/message`, data);
    return response.data;
  },

  // Admin
  getAllAdmin: async (params) => {
    const response = await api.get('/support/admin/all', { params });
    return response.data;
  },

  assign: async (id, assignedTo) => {
    const response = await api.patch(`/support/admin/${id}/assign`, { assignedTo });
    return response.data;
  },

  resolve: async (id) => {
    const response = await api.patch(`/support/admin/${id}/resolve`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/support/admin/${id}/status`, { status });
    return response.data;
  },
};

// Combined export for convenience
export const apiService = {
  // Auth
  register: authService.register,
  login: authService.login,
  logout: authService.logout,
  getCurrentUser: authService.getCurrentUser,
  updateProfile: authService.updateProfile,
  changePassword: authService.changePassword,
  
  // Hotels
  getAllHotels: hotelService.getAll,
  getHotelById: hotelService.getById,
  createHotel: hotelService.create,
  updateHotel: hotelService.update,
  deleteHotel: hotelService.delete,
  getMyHotels: hotelService.getMyHotels,
  updateHotelStatus: hotelService.updateStatus,
  
  // Tours
  getAllTours: tourService.getAll,
  getTourById: tourService.getById,
  createTour: tourService.create,
  updateTour: tourService.update,
  deleteTour: tourService.delete,
  getMyTours: tourService.getMyTours,
  updateTourStatus: tourService.updateStatus,
  
  // Bookings
  createBooking: bookingService.create,
  getMyBookings: bookingService.getMyBookings,
  getBookingById: bookingService.getById,
  cancelBooking: bookingService.cancel,
  getAllBookings: bookingService.getAllAdmin,
  updateBookingStatus: bookingService.updateStatus,
  
  // Payments
  createPayment: paymentService.create,
  getMyPayments: paymentService.getMyPayments,
  getPaymentById: paymentService.getById,
  getAllPayments: paymentService.getAllAdmin,
  updatePaymentStatus: paymentService.updateStatus,
  processRefund: paymentService.processRefund,
  
  // Reviews
  createReview: reviewService.create,
  getReviewsByHotel: reviewService.getByHotel,
  getReviewsByTour: reviewService.getByTour,
  getMyReviews: reviewService.getMyReviews,
  updateReview: reviewService.update,
  deleteReview: reviewService.delete,
  approveReview: reviewService.approve,
  rejectReview: reviewService.reject,
  getPendingReviews: reviewService.getPendingAdmin,
  
  // Support Tickets
  createSupportTicket: supportService.create,
  getMySupportTickets: supportService.getMyTickets,
  getSupportTicketById: supportService.getById,
  addMessageToTicket: supportService.addMessage,
  getAllSupportTickets: supportService.getAllAdmin,
  assignSupportTicket: supportService.assign,
  resolveSupportTicket: supportService.resolve,
  replyToSupportTicket: supportService.addMessage,
  updateSupportTicketStatus: supportService.updateStatus,
  
  // Admin - Users
  getAllUsers: async () => {
    const response = await api.get('/users/all');
    return response.data;
  },
  updateUserStatus: async (userId, data) => {
    const response = await api.patch(`/users/${userId}/toggle-status`, data);
    return response.data;
  },
  
  // Support ticket status update
  updateSupportTicketStatus: async (ticketId, data) => {
    const response = await api.patch(`/support/admin/${ticketId}/status`, data);
    return response.data;
  },
  
  // Reply to support ticket
  replyToSupportTicket: async (ticketId, data) => {
    const response = await api.post(`/support/${ticketId}/message`, data);
    return response.data;
  },
};
