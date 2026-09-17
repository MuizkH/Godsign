import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  // Show a premium loading indicator while checking JWT status
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#2C7BE5] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-sans text-sm font-semibold text-[#0B3D62] tracking-wide animate-pulse">
            Sensing Auth Credentials...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated? Redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but role not allowed? Redirect accordingly
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'citizen') {
      // Citizens are restricted from dashboard/reports; redirect them to learning
      return <Navigate to="/learning" replace />;
    } else {
      // Fallback for other unauthorized transitions
      return <Navigate to="/" replace />;
    }
  }

  // Authorized; render the requested component
  return children;
}
