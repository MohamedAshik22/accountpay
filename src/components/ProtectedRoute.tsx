import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('token');
  
  // If no token exists, redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;