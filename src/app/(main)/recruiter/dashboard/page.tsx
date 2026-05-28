'use client';
import { RecruiterDashboard } from '../../../../views/recruiter/RecruiterDashboard';
import { ProtectedRoute } from '../../../../components/ProtectedRoute';

export default function RecruiterDashboardPage() {
  return (
    <ProtectedRoute>
      <RecruiterDashboard />
    </ProtectedRoute>
  );
}
