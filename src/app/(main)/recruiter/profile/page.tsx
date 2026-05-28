'use client';
import { RecruiterProfile } from '../../../../views/recruiter/RecruiterProfile';
import { ProtectedRoute } from '../../../../components/ProtectedRoute';

export default function RecruiterProfilePage() {
  return (
    <ProtectedRoute>
      <RecruiterProfile />
    </ProtectedRoute>
  );
}
