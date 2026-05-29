'use client';
import { PaymentGateway } from '../../../../../views/PaymentGateway';
import { ProtectedRoute } from '../../../../../components/common/ProtectedRoute';

export default function PaymentGatewayPage() {
  return (
    <ProtectedRoute>
      <PaymentGateway />
    </ProtectedRoute>
  );
}
