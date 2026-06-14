'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  React.useEffect(() => {
    if (!user) return;
    
    // Route to role-specific dashboard
    switch (user.role) {
      case 'student':
        router.replace('/student/dashboard');
        break;
      case 'job_seeker':
        router.replace('/seeker/dashboard');
        break;
      case 'recruiter':
        router.replace('/recruiter/dashboard');
        break;
      default:
        router.replace('/home');
    }
  }, [user, router]);
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--vij-bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="auth-spinner" style={{ width: '40px', height: '40px', borderTopColor: 'var(--accent-azure)', margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--vij-text-muted)', fontSize: '14px' }}>Routing to your dashboard…</p>
      </div>
    </div>
  );
}
