'use client';
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    // If logged in as seeker but onboarding not done, redirect to onboarding
    if (user?.role === 'seeker' && !user.onboardingCompleted && pathname !== '/onboarding/parameters') {
      router.push('/onboarding/parameters');
    }
  }, [isAuthenticated, user, pathname, router]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
};
