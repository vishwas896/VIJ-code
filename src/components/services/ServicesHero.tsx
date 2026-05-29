'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Map, Globe, Wallet, Video, X 
} from 'lucide-react';
import { useServices, type PersonaType } from '../../context/ServicesContext';
import { GlassButton } from '../common/GlassButton';
import { GlassCard } from '../common/GlassCard';

export const ServicesHero: React.FC = () => {
  const { activePersona, setActivePersona } = useServices();
  const [isTourOpen, setIsTourOpen] = useState(false);

  const personaChips: Array<{ id: PersonaType; label: string }> = [
    { id: 'seeker', label: "I'm a Job Seeker" },
    { id: 'switcher', label: "I'm Switching Careers" },
    { id: 'student', label: "I'm a Student" },
    { id: 'recruiter', label: "I'm a Recruiter" }
  ];

  const handleScrollToServices = () => {
    const element = document.getElementById('services-catalog-start');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleChipClick = (id: PersonaType) => {
    if (activePersona === id) {
      setActivePersona('all'); // toggle off to show all
    } else {
      setActivePersona(id);
    }
  };

  return (
    <section className="services-hero">
      <div className="hero-grid">
        {/* Left: Text & Interactions */}
        <div className="hero-text-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="services-badge">PROJECT VIJ SERVICES</div>
            <h1 className="hero-headline">
              Everything You Need to Build a Career You Love
            </h1>
            <p className="hero-subheadline">
              From AI-powered roadmaps to real‑time salary simulators and a mentor community that actually answers—explore every tool Project VIJ has to offer.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="hero-cta-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <GlassButton 
              variant="primary" 
              onClick={handleScrollToServices}
            >
              Explore All Services
            </GlassButton>
            <GlassButton 
              variant="secondary" 
              onClick={() => setIsTourOpen(true)}
              icon={<Play size={14} fill="currentColor" />}
            >
              Take a Quick Tour
            </GlassButton>
          </motion.div>

          {/* Persona Selection Chips */}
          <motion.div 
            className="hero-persona-selector"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="selector-title">Select Your Goal:</span>
            <div className="persona-chips-container">
              {personaChips.map((chip) => {
                const isActive = activePersona === chip.id;
                return (
                  <motion.button
                    key={chip.id}
                    className={`persona-chip ${isActive ? 'active' : ''}`}
                    onClick={() => handleChipClick(chip.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    layout
                  >
                    <span>{chip.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Right: Floating Glass Illustration */}
        <div className="hero-visual-content">
          <div className="floating-elements-stage">
            {/* Soft background glow */}
            <div className="glow-sphere-bg" />

            {/* Floating Object 1: Roadmap Card */}
            <motion.div
              className="float-object fo-1"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 4, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <GlassCard className="mini-floating-card" glowingEdge="azure" tilt={false}>
                <Map size={24} className="icon-azure" />
                <div>
                  <h5>AI Roadmaps</h5>
                  <span>Step-by-step guides</span>
                </div>
              </GlassCard>
            </motion.div>

            {/* Floating Object 2: Interview Room Card */}
            <motion.div
              className="float-object fo-2"
              animate={{
                y: [0, 18, 0],
                rotate: [0, -6, 0]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.5
              }}
            >
              <GlassCard className="mini-floating-card" glowingEdge="gold" tilt={false}>
                <Video size={24} className="icon-gold" />
                <div>
                  <h5>Interview Prep</h5>
                  <span>Live mock rooms</span>
                </div>
              </GlassCard>
            </motion.div>

            {/* Floating Object 3: Wallet Card */}
            <motion.div
              className="float-object fo-3"
              animate={{
                y: [0, -12, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1
              }}
            >
              <GlassCard className="mini-floating-card" glowingEdge="none" tilt={false}>
                <Wallet size={24} className="icon-emerald" />
                <div>
                  <h5>VIJ Wallet</h5>
                  <span>Token rewards</span>
                </div>
              </GlassCard>
            </motion.div>

            {/* Floating Object 4: Network Globe Card */}
            <motion.div
              className="float-object fo-4"
              animate={{
                y: [0, 14, 0],
                rotate: [0, -4, 0]
              }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1.5
              }}
            >
              <GlassCard className="mini-floating-card" glowingEdge="azure" tilt={false}>
                <Globe size={24} className="icon-azure" />
                <div>
                  <h5>Global Network</h5>
                  <span>Recruiter visibility</span>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tour Modal Overlay */}
      <AnimatePresence>
        {isTourOpen && (
          <motion.div 
            className="tour-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="tour-modal-backdrop" onClick={() => setIsTourOpen(false)} />
            <motion.div 
              className="tour-modal-container"
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            >
              <GlassCard className="tour-modal-card" glowingEdge="azure" tilt={false}>
                <button className="close-tour-btn" onClick={() => setIsTourOpen(false)}>
                  <X size={20} />
                </button>
                <div className="tour-modal-header">
                  <h3>Project VIJ Tour</h3>
                  <p>Explore the ultimate career development ecosystem.</p>
                </div>
                
                {/* Embed a mockup video or interactive slider */}
                <div className="tour-video-mockup">
                  <div className="mockup-play-screen">
                    <Play size={40} className="pulse-icon" />
                    <span>How to use Roadmaps, Job Match & Salary Simulator</span>
                  </div>
                </div>

                <div className="tour-modal-footer">
                  <p>Ready to start? Select your persona to filter the service catalog!</p>
                  <GlassButton variant="primary" onClick={() => setIsTourOpen(false)}>
                    Get Started
                  </GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

