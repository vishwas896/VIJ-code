'use client';
import { Notifications } from '../../../views/Notifications';
import { ProtectedRoute } from '../../../components/common/ProtectedRoute';

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
  );
}
