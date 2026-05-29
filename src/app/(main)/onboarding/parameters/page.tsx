'use client';
import { Onboarding } from '../../../../views/Onboarding';
import { ProtectedRoute } from '../../../../components/common/ProtectedRoute';

export default function OnboardingParametersPage() {
  return (
    <ProtectedRoute>
      <Onboarding />
    </ProtectedRoute>
  );
}
