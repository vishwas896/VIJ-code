'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { MailX, Shuffle, HelpCircle } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import landingData from '../../data/landing.json';
import './landing.css';

export const ProblemStatement: React.FC = () => {
  const icons = [
    <MailX size={24} color="#FF6B6B" />,
    <Shuffle size={24} color="#FF6B6B" />,
    <HelpCircle size={24} color="#FF6B6B" />
  ];

  return (
    <section className="ld-section">
      <div className="ld-section-header">
        <h2>Legacy Job Sites Are Broken</h2>
        <p>Outdated layouts, hidden algorithms, and endless waiting times have failed modern seekers.</p>
      </div>

      <div className="ld-grid-3">
        {landingData.painPoints.map((pain, idx) => (
          <motion.div
            key={pain.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
          >
            <GlassCard className="ld-step-card" style={{ height: '100%' }}>
              <div className="ld-step-icon" style={{ backgroundColor: 'var(--color-coral-light)', color: 'var(--color-coral-cta)' }}>
                {icons[idx]}
              </div>
              <p style={{ fontStyle: 'italic', fontSize: '13.5px', color: 'var(--color-text-main)', marginTop: '8px' }}>
                "{pain.quote}"
              </p>
              <strong style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: 'auto' }}>
                — {pain.author}
              </strong>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '36px', fontSize: '14px', fontWeight: 600, color: 'var(--color-teal-primary)' }}>
        We built Project VIJ to turn career confusion into clarity. Here is how we fix it.
      </div>
    </section>
  );
};

