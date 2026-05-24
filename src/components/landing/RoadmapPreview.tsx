'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Compass } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { GlassButton } from '../GlassButton';
import './landing.css';

export const RoadmapPreview: React.FC = () => {
  const router = useRouter();

  return (
    <section className="ld-section">
      <div className="ld-section-header">
        <h2>Interactive Career Explorer</h2>
        <p>Visualize branching options and see exactly where your skills can take you.</p>
      </div>

      <GlassCard className="ld-preview-box">
        <div className="ld-preview-grid">
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            {/* Simple Radial Branching Node Tree Map SVG */}
            <svg viewBox="0 0 400 240" style={{ width: '100%', maxWidth: '400px' }}>
              {/* Connection Vectors */}
              <path d="M 50,120 Q 120,60 200,60" fill="none" stroke="var(--color-teal-primary)" strokeWidth="1.5" strokeDasharray="3" />
              <path d="M 50,120 L 200,120" fill="none" stroke="var(--color-teal-primary)" strokeWidth="1.5" strokeDasharray="3" />
              <path d="M 50,120 Q 120,180 200,180" fill="none" stroke="var(--color-teal-primary)" strokeWidth="1.5" strokeDasharray="3" />

              {/* Sub branches */}
              <path d="M 200,60 L 320,30" fill="none" stroke="var(--color-coral-cta)" strokeWidth="1" strokeDasharray="2" />
              <path d="M 200,120 L 320,120" fill="none" stroke="var(--color-coral-cta)" strokeWidth="1" strokeDasharray="2" />
              <path d="M 200,180 L 320,210" fill="none" stroke="var(--color-coral-cta)" strokeWidth="1" strokeDasharray="2" />

              {/* Root Node */}
              <circle cx="50" cy="120" r="14" fill="var(--color-teal-primary)" />
              <text x="50" y="124" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">YOU</text>

              {/* Intermediate Nodes */}
              <circle cx="200" cy="60" r="10" fill="var(--color-teal-primary)" />
              <circle cx="200" cy="120" r="10" fill="var(--color-teal-primary)" />
              <circle cx="200" cy="180" r="10" fill="var(--color-teal-primary)" />

              {/* Leaf Nodes */}
              <circle cx="320" cy="30" r="8" fill="var(--color-coral-cta)" />
              <circle cx="320" cy="120" r="8" fill="var(--color-coral-cta)" />
              <circle cx="320" cy="210" r="8" fill="var(--color-coral-cta)" />

              {/* Node Labels */}
              <text x="200" y="44" fill="var(--color-text-main)" fontSize="10" fontWeight="bold" textAnchor="middle">Senior Engineer</text>
              <text x="200" y="142" fill="var(--color-text-main)" fontSize="10" fontWeight="bold" textAnchor="middle">Tech Lead</text>
              <text x="200" y="202" fill="var(--color-text-main)" fontSize="10" fontWeight="bold" textAnchor="middle">Product Manager</text>

              <text x="320" y="16" fill="var(--color-text-muted)" fontSize="8" textAnchor="middle">Staff Engineer</text>
              <text x="320" y="138" fill="var(--color-text-muted)" fontSize="8" textAnchor="middle">Engineering Manager</text>
              <text x="320" y="228" fill="var(--color-text-muted)" fontSize="8" textAnchor="middle">Director of Product</text>
            </svg>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="ld-badge" style={{ backgroundColor: 'var(--color-coral-light)', color: 'var(--color-coral-cta)' }}>
              <Compass size={12} />
              <span>Interactive Branching Map</span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: 'var(--color-text-main)' }}>
              Visualize Potential Career Branches
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.6 }}>
              Our dynamic node tree connects your current skills to prospective positions. Hover and interact to view median salaries, transition timeframes, and check off target certifications.
            </p>
            <GlassButton 
              variant="primary"
              onClick={() => router.push('/roadmaps')}
              style={{ width: 'fit-content' }}
            >
              See It In Action
              <ArrowRight size={14} style={{ marginLeft: '6px' }} />
            </GlassButton>
          </div>
        </div>
      </GlassCard>
    </section>
  );
};

