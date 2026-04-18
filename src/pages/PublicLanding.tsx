import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import './PublicLanding.css';

export const PublicLanding: React.FC = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            The Intelligent <span className="text-gradient">Junction</span> for Talent
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ marginBottom: '32px' }}
          >
            A 100% Match environment secured by VIJ Mediation.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <a href="/register" style={{ 
              display: 'inline-block',
              textDecoration: 'none',
              padding: '16px 32px',
              background: 'var(--accent-azure)',
              color: 'white',
              borderRadius: '999px',
              fontWeight: 600,
              boxShadow: '0 0 20px var(--accent-azure-glow)'
            }}>View 100% Matches</a>
          </motion.div>
        </div>
        
        {/* Orbiting Stats */}
        <div className="orbit-container">
          <motion.div 
            className="orbit-ring"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <GlassCard className="stat-card stat-1" glowingEdge="azure">
              <h3>142</h3>
              <p>Interviews Today</p>
            </GlassCard>
            <GlassCard className="stat-card stat-2">
              <h3>98%</h3>
              <p>Match Accuracy</p>
            </GlassCard>
            <GlassCard className="stat-card stat-3" glowingEdge="gold">
              <h3>1.2k</h3>
              <p>Active Postings</p>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Trending Carousels */}
      <section className="trending-section">
        <h2 className="section-title">Trending Postings</h2>
        <div className="carousel-container">
          <motion.div 
            className="carousel-track"
            drag="x"
            dragConstraints={{ right: 0, left: -800 }}
          >
            {[1, 2, 3, 4, 5].map((item) => (
              <GlassCard key={item} className="carousel-card">
                <div className="card-header">
                  <div className="company-logo"></div>
                  <h4>Senior Frontend Eng.</h4>
                </div>
                <div className="card-tags">
                  <span>React</span>
                  <span>Framer Motion</span>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};
