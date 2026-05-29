'use client';
import { MyActivity } from '../../../views/MyActivity';
import { ProtectedRoute } from '../../../components/common/ProtectedRoute';

export default function ActivityPage() {
  return (
    <ProtectedRoute>
      <MyActivity />
    </ProtectedRoute>
  );
}
