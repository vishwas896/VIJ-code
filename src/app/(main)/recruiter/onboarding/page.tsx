'use client';
import { RecruiterOnboarding } from '../../../../views/recruiter/RecruiterOnboarding';
import { ProtectedRoute } from '../../../../components/ProtectedRoute';

export default function RecruiterOnboardingPage() {
  return (
    <ProtectedRoute>
      <RecruiterOnboarding />
    </ProtectedRoute>
  );
}
