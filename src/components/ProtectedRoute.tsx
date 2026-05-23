import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in as seeker but onboarding not done, redirect to onboarding
  if (user?.role === 'seeker' && !user.onboardingCompleted && location.pathname !== '/onboarding/parameters') {
    return <Navigate to="/onboarding/parameters" replace />;
  }

  return <>{children}</>;
};
