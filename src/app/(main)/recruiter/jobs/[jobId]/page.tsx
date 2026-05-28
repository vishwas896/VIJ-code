'use client';
import { RecruiterJobPipeline } from '../../../../../views/recruiter/RecruiterJobPipeline';
import { ProtectedRoute } from '../../../../../components/ProtectedRoute';

export default function RecruiterJobPipelinePage() {
  return (
    <ProtectedRoute>
      <RecruiterJobPipeline />
    </ProtectedRoute>
  );
}
