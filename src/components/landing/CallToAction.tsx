import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../GlassCard';
import { GlassButton } from '../GlassButton';
import './landing.css';

export const CallToAction: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="ld-section" style={{ marginBottom: '60px' }}>
      <GlassCard className="ld-cta-box" glowingEdge="azure">
        <h3>Ready to map a career you actually love?</h3>
        <p>
          Join the community that’s turning career confusion into clarity — no credit card required.
        </p>
        <GlassButton 
          variant="primary"
          onClick={() => navigate('/register')}
          style={{ padding: '14px 32px', fontSize: '15px' }}
        >
          Start My Free Roadmap
        </GlassButton>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
          🔒 No subscription required. Instantly synchronized.
        </span>
      </GlassCard>
    </section>
  );
};
