'use client';
import { NetworkChat } from '../../../../views/NetworkChat';
import { ProtectedRoute } from '../../../../components/common/ProtectedRoute';

export default function NetworkConnectionsPage() {
  return (
    <ProtectedRoute>
      <NetworkChat />
    </ProtectedRoute>
  );
}
