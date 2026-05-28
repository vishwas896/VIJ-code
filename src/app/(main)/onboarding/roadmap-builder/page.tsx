'use client';
import { RoadmapBuilder } from '../../../../views/RoadmapBuilder';
import { ProtectedRoute } from '../../../../components/ProtectedRoute';

export default function RoadmapBuilderPage() {
  return (
    <ProtectedRoute>
      <RoadmapBuilder />
    </ProtectedRoute>
  );
}
