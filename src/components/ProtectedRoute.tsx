'use client';
import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    // If logged in as seeker but onboarding not done, redirect to onboarding (allow all /onboarding/* paths)
    if (user?.role === 'seeker' && !user.onboardingCompleted && !pathname.startsWith('/onboarding/')) {
      router.push('/onboarding/parameters');
    }
  }, [isAuthenticated, user, pathname, router, loading]);

  if (loading || !isAuthenticated) return null;

  return <>{children}</>;
};
