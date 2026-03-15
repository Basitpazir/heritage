import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Protects routes that require user login
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;