'use client';
import React from 'react';
import { Building2, Users, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function MyCompanyDashboard() {
  const { user } = useAuth();

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', fontFamily: '"Outfit", sans-serif' }}>
      
      {/* Header Banner */}
      <div style={{ 
        height: '200px', 
        borderRadius: '24px', 
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1))',
        border: '1px solid rgba(0,0,0,0.05)',
        position: 'relative',
        marginBottom: '60px'
      }}>
        <div style={{ 
          position: 'absolute', 
          bottom: '-40px', 
          left: '40px',
          width: '100px', 
          height: '100px', 
          borderRadius: '20px',
          background: '#fff',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Building2 size={40} style={{ color: '#3b82f6' }} />
        </div>
      </div>

      <div style={{ padding: '0 40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px', color: '#1e293b' }}>
          {user?.currentCompany || 'Your Company'}
          <CheckCircle2 size={24} style={{ color: '#22c55e', marginLeft: '12px', display: 'inline-block', verticalAlign: 'middle' }} />
        </h1>
        <p style={{ fontSize: '16px', color: '#64748b', margin: '0 0 40px' }}>
          Managed by {user?.name || 'Recruiter'} ({user?.roleTitle || 'HR'})
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Active Jobs */}
          <div style={{ padding: '30px', background: '#fff', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '12px' }}><FileText size={24} style={{ color: '#3b82f6' }} /></div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Active Job Postings</h3>
            </div>
            <p style={{ color: '#64748b', margin: '0 0 20px' }}>You have 0 active job postings.</p>
            <button style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', borderRadius: '99px', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Create Listing</button>
          </div>

          {/* Candidate Pipeline */}
          <div style={{ padding: '30px', background: '#fff', borderRadius: '20px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '12px' }}><Users size={24} style={{ color: '#22c55e' }} /></div>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Candidate Pipeline</h3>
            </div>
            <p style={{ color: '#64748b', margin: '0 0 20px' }}>Your talent pipeline is empty.</p>
            <button style={{ padding: '10px 20px', background: 'transparent', color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: '99px', fontWeight: 600, cursor: 'pointer' }}>Discover Talent</button>
          </div>
        </div>

      </div>

    </div>
  );
}
