'use client';
import { SeekerDashboard } from '../../../../views/SeekerDashboard';
import { ProtectedRoute } from '../../../../components/common/ProtectedRoute';

export default function SeekerDashboardPage() {
  return (
    <ProtectedRoute>
      <SeekerDashboard />
    </ProtectedRoute>
  );
}
