import React from 'react';
import { GlassCard } from '../components/GlassCard';
import './SocialHub.css'; // Reuse masonry styling

export const Explore: React.FC = () => {
  return (
    <div className="social-hub-page">
      <h1 style={{ fontSize: '32px', marginBottom: '32px' }}>Discovery Engine</h1>
      <div className="hub-layout">
        <div className="hub-left">
          <GlassCard>
            <h3 style={{ marginBottom: '16px' }}>Trending Tags</h3>
            <div className="tags" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['#NextJS', '#React19', '#FramerMotion', '#WebRTC', '#Glassmorphism'].map(tag => (
                <span key={tag} style={{ padding: '6px 12px', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-azure)', borderRadius: '16px', fontSize: '13px', cursor: 'pointer' }}>
                  {tag}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
        
        <div className="hub-center">
          <div className="course-grid">
            {[1, 2, 3, 4].map(item => (
              <GlassCard key={item}>
                <div style={{ height: '140px', background: 'var(--mesh-grad-2)', borderRadius: '12px', marginBottom: '16px' }}></div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Top Innovator {item}</h3>
                <p style={{ color: 'var(--vij-text-muted)', fontSize: '14px' }}>Leading the way in UI development.</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
