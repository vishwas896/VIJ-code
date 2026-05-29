'use client';
import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Target, Zap, Shield, Globe, ArrowRight } from 'lucide-react';
import { PageTransition } from '../components/common/PageTransition';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { useRouter } from 'next/navigation';
import './About.css';

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const globeNodes = Array.from({ length: 12 }, (_, i) => ({
  top: `${(i * 37 + 13) % 100}%`,
  left: `${(i * 53 + 29) % 100}%`,
  duration: 2 + (i % 5) * 0.35,
  delay: (i % 6) * 0.25,
}));

// 3D Node Globe Animation Placeholder component
const NodeGlobeAnimation = () => {
  return (
    <div className="globe-container">
      <motion.div 
        className="globe-sphere"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
      >
        <div className="globe-orbit" style={{ transform: 'rotateX(60deg)' }} />
        <div className="globe-orbit" style={{ transform: 'rotateY(60deg)' }} />
        <div className="globe-orbit" style={{ transform: 'rotateZ(60deg) rotateX(45deg)' }} />
        
        {/* Nodes */}
        {globeNodes.map((node, i) => (
          <motion.div 
            key={i}
            className="globe-node"
            style={{
              top: node.top,
              left: node.left,
            }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              repeat: Infinity,
              duration: node.duration,
              delay: node.delay
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export const About: React.FC = () => {
  const router = useRouter();

  return (
    <PageTransition>
      <div className="about-page-root">
        
        {/* HERO SECTION */}
        <section className="about-hero">
          <div className="about-hero-bg" />
          <NodeGlobeAnimation />
          
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' as const, bounce: 0.4 }}
            style={{ position: 'relative', zIndex: 10 }}
          >
            <h1 className="about-hero-title">
              Redefining How the World Connects to Opportunity.
            </h1>
            <p className="about-hero-subtitle">
              VIJ (Virtual Intelligent Junction) is not just a job platform — it's a precision-driven ecosystem where talent meets opportunity with zero noise and maximum intent.
            </p>
            <div className="about-hero-ctas">
              <GlassButton variant="primary" icon={<ArrowRight size={18} />} onClick={() => router.push('/network')}>
                Explore VIJ
              </GlassButton>
              <GlassButton variant="secondary" onClick={() => router.push('/register')}>
                Join the Network
              </GlassButton>
            </div>
          </motion.div>
        </section>

        {/* WHO WE ARE */}
        <section className="about-section">
          <div className="about-section-header">
            <h2 className="about-section-title">Who We Are</h2>
            <div className="about-section-divider" />
          </div>
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            <GlassCard className="about-content-card">
              <p>VIJ is built for a world that has outgrown traditional job portals.</p>
              <p>
                Where others rely on volume, we operate on <span className="about-highlight-text">precision</span>.<br/>
                Where others flood users with irrelevant listings, we <span className="about-highlight-text">engineer relevance</span>.
              </p>
              <p>
                We are a technology-first platform designed to eliminate friction in hiring — for both talent and organizations.
                At our core, VIJ is a system that understands people before it connects them.
              </p>
            </GlassCard>
          </motion.div>
        </section>

        {/* THE PROBLEM */}
        <section className="about-section">
          <div className="about-section-header">
            <h2 className="about-section-title">The Broken Hiring Reality</h2>
            <div className="about-section-divider" style={{ background: 'linear-gradient(90deg, #ef4444, #f59e0b)' }} />
          </div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            <GlassCard className="about-content-card" style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <p>Today's hiring ecosystem is inefficient, noisy, and outdated.</p>
              <div style={{ display: 'inline-block', textAlign: 'left', margin: '24px 0' }}>
                <p style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Shield size={20} color="#ef4444" /> Job seekers apply endlessly without response
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Shield size={20} color="#ef4444" /> Recruiters filter through irrelevant profiles
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Shield size={20} color="#ef4444" /> Platforms prioritize quantity over quality
                </p>
              </div>
              <p>This results in wasted time, missed opportunities, and broken trust.</p>
              <div className="about-power-line" style={{ color: '#ef4444' }}>
                The system isn't just inefficient — it's fundamentally flawed.
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* THE VIJ SOLUTION */}
        <section className="about-section">
          <div className="about-section-header">
            <h2 className="about-section-title">What Makes VIJ Different</h2>
            <div className="about-section-divider" style={{ background: 'linear-gradient(90deg, #10b981, var(--accent-azure))' }} />
            <p className="about-hero-subtitle" style={{ margin: '0 auto' }}>
              We don't just list jobs. We match intent, capability, and opportunity with surgical precision.
            </p>
          </div>

          <motion.div 
            className="about-solution-grid"
            variants={staggerContainer}
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { icon: <Target size={32} />, title: '100% Match Engine', desc: 'Only relevant opportunities reach users.' },
              { icon: <Shield size={32} />, title: 'Seamless Experience', desc: 'No repeated forms, no redirections.' },
              { icon: <Globe size={32} />, title: 'Live Network Layer', desc: 'Discover people, not just jobs.' },
              { icon: <Zap size={32} />, title: 'Real-Time Interaction', desc: 'Faster decisions, faster outcomes.' }
            ].map((sol, i) => (
              <motion.div key={i} variants={fadeUpVariants}>
                <GlassCard className="solution-card">
                  <div className="solution-icon-wrapper">{sol.icon}</div>
                  <h3 className="solution-title">{sol.title}</h3>
                  <p className="solution-desc">{sol.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }}
            className="about-power-line" style={{ color: '#10b981' }}
          >
            VIJ doesn't increase applications — it increases accuracy.
          </motion.div>
        </section>

        {/* HOW WE WORK */}
        <section className="about-section">
          <div className="about-section-header">
            <h2 className="about-section-title">How VIJ Works</h2>
            <div className="about-section-divider" />
          </div>

          <motion.div 
            className="pipeline-container"
            variants={staggerContainer}
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
          >
            {[
              "Users onboard once with an intelligent setup",
              "Profiles are deeply structured and verified",
              "System understands skills + true intent",
              "Matches are generated with surgical precision",
              "Direct interaction occurs between recruiter & candidate"
            ].map((step, i) => (
              <motion.div key={i} variants={fadeUpVariants}>
                <GlassCard className="pipeline-step">
                  <div className="pipeline-number">{i + 1}</div>
                  <div className="pipeline-content">{step}</div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* FOUNDERS SECTION */}
        <section className="about-section">
          <div className="about-section-header">
            <h2 className="about-section-title">The Minds Behind VIJ</h2>
            <div className="about-section-divider" />
          </div>

          <div className="founders-grid">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <GlassCard className="founder-card">
                <div className="founder-avatar">VS</div>
                <h3 className="founder-name">Vishwas Shandilya</h3>
                <div className="founder-role">Founder | Vision Architect</div>
                <p className="founder-bio">
                  A builder at heart, Vishwas combines technology, systems thinking, and real-world problem solving.
                  With a strong foundation in AI, engineering, and human behavior, he envisioned VIJ as more than a platform — a correction to a broken system.
                </p>
                <div className="founder-quote">
                  "The future isn't about more options. It's about the right ones."
                </div>
              </GlassCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <GlassCard className="founder-card">
                <div className="founder-avatar">RP</div>
                <h3 className="founder-name">Ranveer Pandey</h3>
                <div className="founder-role">Co-Founder | Strategy & Execution</div>
                <p className="founder-bio">
                  Ranveer brings execution discipline and strategic clarity to VIJ.
                  Focused on scalability, operations, and user-centric growth, he ensures that the vision translates into a real-world, usable system.
                </p>
                <div className="founder-quote">
                  "A great idea is nothing without precise execution."
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* VISION & MISSION */}
        <section className="about-section">
          <div className="vm-grid">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <GlassCard className="vm-card" style={{ height: '100%' }}>
                <Globe size={48} className="vm-icon" />
                <h2 className="vm-title">Our Vision</h2>
                <p style={{ fontSize: '18px', color: 'var(--vij-text-muted)', lineHeight: 1.6 }}>
                  To build the world's most intelligent opportunity network —<br/>
                  where every individual is connected to the right opportunity at the right time.
                </p>
              </GlassCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
              <GlassCard className="vm-card" style={{ height: '100%' }}>
                <Target size={48} className="vm-icon" />
                <h2 className="vm-title">Our Mission</h2>
                <ul className="vm-list">
                  <li>Eliminate inefficiency in hiring</li>
                  <li>Reduce noise in job discovery</li>
                  <li>Build meaningful professional connections</li>
                  <li>Create a system that respects time and talent</li>
                </ul>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* WHY VIJ MATTERS */}
        <section className="about-section">
          <div className="about-section-header">
            <h2 className="about-section-title">Why VIJ Matters Now</h2>
            <div className="about-section-divider" style={{ background: 'linear-gradient(90deg, #a855f7, var(--accent-azure))' }} />
          </div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariants}
          >
            <GlassCard className="about-content-card">
              <p>The world is shifting.</p>
              <p>Skills are evolving faster than systems can keep up.<br/>Traditional platforms are not built for this speed.</p>
              <p className="about-highlight-text" style={{ fontSize: '24px', margin: '32px 0' }}>VIJ fills that gap.</p>
              <p>We are not competing with job portals.<br/>We are replacing outdated thinking.</p>
              <div className="about-power-line" style={{ color: '#a855f7', marginTop: '40px' }}>
                VIJ is not an upgrade. It's a reset.
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* CLOSING & CTA */}
        <section className="about-closing">
          <div className="about-closing-bg" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="about-closing-text">
              We believe that opportunities should not be searched endlessly.<br/>
              <span className="about-highlight-text">They should find you — accurately, instantly, meaningfully.</span>
              <br/><br/>
              That is what VIJ is building.
            </div>
            
            <div className="about-hero-ctas">
              <GlassButton variant="primary" style={{ padding: '16px 32px', fontSize: '18px' }} onClick={() => router.push('/register')}>
                Join VIJ
              </GlassButton>
              <GlassButton variant="secondary" style={{ padding: '16px 32px', fontSize: '18px' }} onClick={() => router.push('/onboarding/parameters')}>
                Build Your Future
              </GlassButton>
            </div>
            
            <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'center' }}>
              <a 
                href="https://www.linkedin.com/company/virtual-intelligent-junction" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  color: 'var(--vij-text-muted)', 
                  textDecoration: 'none',
                  fontSize: '16px',
                  transition: 'color 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#0077b5'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--vij-text-muted)'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
                Follow VIJ on LinkedIn
              </a>
            </div>
          </motion.div>
        </section>

      </div>
    </PageTransition>
  );
};

