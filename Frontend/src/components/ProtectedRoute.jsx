import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Additional security check: validate session on route access
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity) {
      const timeSinceActivity = Date.now() - parseInt(lastActivity);
      const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
      
      if (timeSinceActivity >= IDLE_TIMEOUT) {
        // Session expired, force logout
        logout();
        return;
      }
    }
  }, [logout]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Additional security: check if user object is valid
  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
