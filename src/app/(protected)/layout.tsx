'use client';

import React from 'react';
import { ProtectedRoute } from '../../components/common/ProtectedRoute';
import { MainLayout } from '../../layouts/MainLayout';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}
