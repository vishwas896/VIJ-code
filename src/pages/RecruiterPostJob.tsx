import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';

export const RecruiterPostJob: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/recruiter/dashboard');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Post New Requirement</h1>
      <p style={{ color: 'var(--vij-text-muted)', marginBottom: '32px' }}>Enforcing Strict Parameter Matching</p>
      
      <GlassCard>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--vij-text-muted)' }}>Job Title</label>
            <input type="text" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white' }} placeholder="e.g. Senior Frontend Engineer" />
          </div>
          
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--vij-text-muted)' }}>Location Scope</label>
              <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white' }}>
                <option value="remote">Fully Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On Site</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--vij-text-muted)' }}>Salary Target</label>
              <input type="text" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white' }} placeholder="$120,000" />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--vij-text-muted)' }}>Core Skills Required (Press Enter to add)</label>
            <input type="text" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white' }} placeholder="React, TypeScript..." />
          </div>

          <GlassButton type="submit" glowingEdge="azure" style={{ marginTop: '16px' }}>
            Activate Match Engine
          </GlassButton>
        </form>
      </GlassCard>
    </div>
  );
};
