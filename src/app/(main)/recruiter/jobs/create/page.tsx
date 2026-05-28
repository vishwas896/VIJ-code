'use client';
import { RecruiterJobsCreate } from '../../../../../views/recruiter/RecruiterJobsCreate';
import { ProtectedRoute } from '../../../../../components/ProtectedRoute';

export default function RecruiterJobsCreatePage() {
  return (
    <ProtectedRoute>
      <RecruiterJobsCreate />
    </ProtectedRoute>
  );
}
