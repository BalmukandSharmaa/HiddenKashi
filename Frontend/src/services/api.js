import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL + '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests and validate session
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const lastActivity = localStorage.getItem('lastActivity');
    const sessionActive = sessionStorage.getItem('sessionActive');
    
    // Check if session is still valid before making request
    if (token && sessionActive) {
      const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
      const timeSinceActivity = lastActivity ? Date.now() - parseInt(lastActivity) : 0;
      
      if (timeSinceActivity >= IDLE_TIMEOUT) {
        // Session expired, clear data and redirect
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('lastActivity');
        localStorage.removeItem('loginTime');
        sessionStorage.clear();
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired'));
      }
      
      config.headers.Authorization = `Bearer ${token}`;
      
      // Update last activity on each request
      localStorage.setItem('lastActivity', Date.now().toString());
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh and unauthorized access
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear all session data on 401
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('lastActivity');
      localStorage.removeItem('loginTime');
      sessionStorage.clear();
      
      // Redirect to login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
