'use client';
import { Settings } from '../../../../views/Settings';
import { ProtectedRoute } from '../../../../components/ProtectedRoute';

export default function SettingsTabPage() {
  return (
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  );
}
