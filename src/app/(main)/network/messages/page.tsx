'use client';
import { NetworkChat } from '../../../../views/NetworkChat';
import { ProtectedRoute } from '../../../../components/ProtectedRoute';

export default function NetworkMessagesPage() {
  return (
    <ProtectedRoute>
      <NetworkChat />
    </ProtectedRoute>
  );
}
