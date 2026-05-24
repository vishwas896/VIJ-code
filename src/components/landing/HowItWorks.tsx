'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Fingerprint, Landmark, Navigation2 } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import landingData from '../../data/landing.json';
import './landing.css';

export const HowItWorks: React.FC = () => {
  const icons = [
    <Fingerprint size={22} />,
    <Landmark size={22} />,
    <Navigation2 size={22} />
  ];

  return (
    <section className="ld-section" id="how-it-works-sect">
      <div className="ld-section-header">
        <h2>How VIJ Works</h2>
        <p>Three simple phases designed to navigate career transitions with complete confidence.</p>
      </div>

      <div className="ld-grid-3">
        {landingData.steps.map((step, idx) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <GlassCard className="ld-step-card" style={{ height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="ld-step-icon" style={{ backgroundColor: 'var(--color-teal-light)', color: 'var(--color-teal-primary)' }}>
                  {icons[idx]}
                </div>
                <span className="ld-step-num" style={{ fontSize: '14px', fontWeight: 800 }}>
                  {step.num}
                </span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '8px 0 4px' }}>{step.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                {step.desc}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

