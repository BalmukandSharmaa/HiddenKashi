import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { authService } from '../services/apiService';

const AuthContext = createContext(null);

const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const WARNING_TIME = 5 * 60 * 1000;  // Show warning 5 minutes before logout

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIdleWarning, setShowIdleWarning] = useState(false);
  const idleTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // Security: Clear any existing session on app start
  useEffect(() => {
    // Clear all session data on initial load for security
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    sessionStorage.clear();
    
    // Only check for stored user if it was saved within the last session
    const sessionStart = sessionStorage.getItem('sessionStart');
    if (!sessionStart) {
      // New session - start fresh
      setUser(null);
      setLoading(false);
      return;
    }
    
    // If session exists, validate it's not expired
    const storedUser = localStorage.getItem('user');
    const lastActivity = localStorage.getItem('lastActivity');
    
    if (storedUser && lastActivity) {
      const timeSinceActivity = Date.now() - parseInt(lastActivity);
      if (timeSinceActivity < IDLE_TIMEOUT) {
        setUser(JSON.parse(storedUser));
        startIdleTimer();
      } else {
        // Session expired
        performLogout();
      }
    }
    setLoading(false);
  }, []);

  // Activity tracking for idle timeout
  const resetIdleTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    localStorage.setItem('lastActivity', Date.now().toString());
    
    // Clear existing timers
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    
    // Hide warning if showing
    setShowIdleWarning(false);
    
    // Only start timers if user is logged in
    if (user) {
      startIdleTimer();
    }
  }, [user]);

  const startIdleTimer = useCallback(() => {
    // Show warning before auto-logout
    warningTimerRef.current = setTimeout(() => {
      setShowIdleWarning(true);
    }, IDLE_TIMEOUT - WARNING_TIME);

    // Auto-logout after idle timeout
    idleTimerRef.current = setTimeout(() => {
      performLogout();
      alert('You have been logged out due to inactivity for security reasons.');
    }, IDLE_TIMEOUT);
  }, []);

  const performLogout = useCallback(() => {
    setUser(null);
    setShowIdleWarning(false);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('lastActivity');
    sessionStorage.clear();
    
    // Clear timers
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
  }, []);

  // Track user activity
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      if (user) {
        resetIdleTimer();
      }
    };

    // Add event listeners for activity tracking
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      // Cleanup event listeners
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [user, resetIdleTimer]);

  const login = async (credentials) => {
    try {
      console.log('AuthContext login called with:', credentials.email);
      const response = await authService.login(credentials);
      console.log('AuthService response:', response);
      
      // Set session markers
      sessionStorage.setItem('sessionStart', Date.now().toString());
      localStorage.setItem('lastActivity', Date.now().toString());
      
      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Start idle timer after successful login
      startIdleTimer();
      
      return response;
    } catch (error) {
      console.error('AuthContext login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    return response;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      performLogout();
    }
  };

  const extendSession = () => {
    setShowIdleWarning(false);
    resetIdleTimer();
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // Reset activity timer when user data is updated
    resetIdleTimer();
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isCustomer: user?.role === 'customer',
    isHotelOwner: user?.role === 'hotel_owner',
    isAdmin: user?.role === 'admin',
    showIdleWarning,
    extendSession,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      {/* Idle Warning Modal */}
      {showIdleWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-slideUp">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Session Expiring Soon</h3>
              <p className="text-gray-600 mb-6">
                You'll be logged out in 5 minutes due to inactivity. Do you want to extend your session?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={extendSession}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Extend Session
                </button>
                <button
                  onClick={logout}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Logout Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
