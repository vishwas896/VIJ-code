import React from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';
import { LiquidBackground } from './LiquidBackground';

export const Placeholder: React.FC<{ title?: string }> = ({ title }) => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <LiquidBackground>
      <div style={{ padding: '120px 40px', maxWidth: '800px', margin: '0 auto', minHeight: '100vh' }}>
        <GlassCard>
          <h2>{title || 'Under Development'}</h2>
          <p style={{ marginTop: '16px', color: 'var(--vij-text-muted)' }}>
            This parameterized route is being modeled.
          </p>
          <div style={{ margin: '24px 0', padding: '16px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
            <p><strong>Path:</strong> {location.pathname}</p>
            <p><strong>Parameters:</strong> {JSON.stringify(params)}</p>
          </div>
          <GlassButton onClick={() => navigate(-1)} variant="secondary">Go Back</GlassButton>
        </GlassCard>
      </div>
    </LiquidBackground>
  );
};
