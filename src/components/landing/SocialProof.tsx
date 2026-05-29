'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, UserCheck2, Landmark } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import landingData from '../../data/landing.json';
import './landing.css';

const CountUp: React.FC<{ target: number; suffix?: string }> = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = target;
    if (end === 0) return;
    const increment = Math.ceil(end / 50);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

export const SocialProof: React.FC = () => {
  const [testIndex, setTestIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestIndex((prev) => (prev + 1) % landingData.testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="ld-section">
      {/* Counters row */}
      <div className="ld-stats-row">
        <div className="ld-stat-card">
          <div className="ld-stat-num">
            <CountUp target={50000} suffix="+" />
          </div>
          <div className="ld-stat-lbl">Roadmaps Generated</div>
        </div>
        <div className="ld-stat-card">
          <div className="ld-stat-num">
            <CountUp target={2400000} suffix="+" />
          </div>
          <div className="ld-stat-lbl">Salary Data Points</div>
        </div>
        <div className="ld-stat-card">
          <div className="ld-stat-num">
            <CountUp target={94} suffix="%" />
          </div>
          <div className="ld-stat-lbl">Success Outcome Rate</div>
        </div>
        <div className="ld-stat-card">
          <div className="ld-stat-num">
            <CountUp target={30000} suffix="+" />
          </div>
          <div className="ld-stat-lbl">Active Mentors</div>
        </div>
      </div>

      <div className="ld-section-header" style={{ marginBottom: '24px' }}>
        <h2>Validated Transitions</h2>
        <p>Real stories from professionals who successfully navigated their next leap.</p>
      </div>

      {/* Testimonial slider */}
      <div className="ld-testimonial-slider">
        <AnimatePresence mode="wait">
          <motion.div
            key={testIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <GlassCard className="ld-testimonial-card">
              <p style={{ fontSize: '14.5px', lineHeight: 1.6, fontStyle: 'italic', color: 'var(--color-text-main)' }}>
                "{landingData.testimonials[testIndex].quote}"
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', margin: '14px 0 8px', fontSize: '11px', fontWeight: 700, color: 'var(--color-teal-primary)', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                <span>Before: {landingData.testimonials[testIndex].before}</span>
                <span>➔</span>
                <span>After: {landingData.testimonials[testIndex].after}</span>
                <span className="txt-coral">Salary Jump: +{landingData.testimonials[testIndex].salaryIncrease}</span>
              </div>

              <div className="ld-testimonial-author">
                — {landingData.testimonials[testIndex].name}
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Compliance Ribbon */}
      <div className="ld-compliance-ribbon" style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginTop: '40px', opacity: 0.85 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 750, color: '#64748b' }}>
          <ShieldCheck size={16} color="#0A6E6E" />
          <span>DATA PRIVACY CERTIFIED</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 750, color: '#64748b' }}>
          <UserCheck2 size={16} color="#0A6E6E" />
          <span>COMMUNITY-DRIVEN</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 750, color: '#64748b' }}>
          <Landmark size={16} color="#0A6E6E" />
          <span>GDPR COMPLIANT</span>
        </div>
      </div>
    </section>
  );
};

