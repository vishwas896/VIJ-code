'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ArrowLeft, MapPin, DollarSign, Clock, Users, Bookmark, Share2, CheckCircle, AlertCircle, Building2, ExternalLink } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { PageTransition } from '../components/PageTransition';
import './JobDetails.css';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, type: 'spring' as const, stiffness: 200, damping: 20 }
  })
};

export const JobDetails: React.FC = () => {
  useParams<{ jobId: string }>();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplied(true);
  };

  return (
    <PageTransition>
      <div className="job-details-root">
        
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <GlassButton variant="secondary" onClick={() => router.back()} className="job-back-btn" icon={<ArrowLeft size={16} />}>
            Back to Jobs
          </GlassButton>
        </motion.div>

        <div className="job-layout">
          {/* Main Content */}
          <div className="job-main-column">
            {/* Job Header Card */}
            <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible">
              <GlassCard className="job-header-card">
                {/* Gradient accent strip */}
                <div className="job-gradient-strip" />
                
                <div className="job-header-top">
                  <div>
                    <h1 className="job-title">Senior Frontend Engineer</h1>
                    <div className="job-meta-info">
                      <Building2 size={16} />
                      <span className="job-company-name">TechNova Solutions Inc.</span>
                      <span>•</span>
                      <MapPin size={14} />
                      <span>San Francisco, CA (Hybrid)</span>
                    </div>
                  </div>
                  <motion.div 
                    className="job-company-logo"
                    whileHover={{ scale: 1.05, rotate: 3 }}
                  >
                    TN
                  </motion.div>
                </div>
                
                <motion.div 
                  className="job-badges"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {[
                    { icon: <DollarSign size={14} />, text: '$150k - $180k', color: '#10b981' },
                    { icon: <Clock size={14} />, text: 'Full-Time', color: 'var(--accent-azure)' },
                    { icon: <Users size={14} />, text: '85% Match Rate', color: 'var(--accent-gold)' },
                  ].map((badge, i) => (
                    <motion.span 
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + i * 0.08 }}
                      className="job-badge"
                    >
                      <span style={{ color: badge.color }}>{badge.icon}</span>
                      {badge.text}
                    </motion.span>
                  ))}
                </motion.div>
              </GlassCard>
            </motion.div>

            {/* About & Requirements */}
            <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible">
              <GlassCard>
                <h3 className="section-title">About the Role</h3>
                <p className="job-description">
                  We are looking for an experienced Senior Frontend Engineer to lead our architecture efforts for our next-generation web platforms. 
                  The ideal candidate will have deep expertise in React, TypeScript, and modern CSS strategies.
                  You will be responsible for building highly performant, accessible, and responsive user interfaces that wow our users.
                </p>

                <h3 className="section-title mt">Requirements</h3>
                <div className="requirements-list">
                  {[
                    '5+ years of experience with modern JavaScript frameworks (React preferred).',
                    'Strong understanding of web performance optimization techniques.',
                    'Experience with state management libraries (Redux, Zustand) and complex data flows.',
                    'Passion for crafting pixel-perfect, liquid-smooth animations.',
                  ].map((req, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.08 }}
                      className="requirement-item"
                    >
                      <div className="requirement-bullet" />
                      {req}
                    </motion.div>
                  ))}
                </div>

                <h3 className="section-title mt">Perks & Benefits</h3>
                <div className="perks-list">
                  {['🏥 Health Insurance', '🏠 Remote Flexibility', '📚 Learning Budget', '🏋️ Gym Membership', '🌴 Unlimited PTO', '💻 Equipment Stipend'].map((perk, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.05 }}
                      className="perk-badge"
                    >
                      {perk}
                    </motion.span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div 
            className="job-sidebar"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Actions Card */}
            <GlassCard>
              <AnimatePresence mode="wait">
                {applied ? (
                  <motion.div
                    key="applied"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="applied-state"
                  >
                    <CheckCircle size={40} className="applied-icon" />
                    <h3 className="applied-title">Application Submitted!</h3>
                    <p className="applied-subtitle">We'll notify you of any updates.</p>
                  </motion.div>
                ) : (
                  <motion.div key="actions">
                    <GlassButton variant="primary" onClick={handleApply} className="action-btn-primary">
                      Apply Now
                    </GlassButton>
                    <GlassButton 
                      variant="secondary" 
                      onClick={() => setSaved(!saved)}
                      className="action-btn-secondary"
                      icon={<Bookmark size={16} fill={saved ? 'var(--accent-azure)' : 'none'} />}
                    >
                      {saved ? 'Saved!' : 'Save Job'}
                    </GlassButton>
                    <GlassButton variant="secondary" className="action-btn-share" icon={<Share2 size={16} />}>
                      Share
                    </GlassButton>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="insights-section">
                <h4 className="sidebar-title">Job Insights</h4>
                {[
                  { label: 'Applicants', value: '142', color: 'var(--accent-azure)' },
                  { label: 'Posted', value: '3 days ago', color: 'var(--vij-text-muted)' },
                  { label: 'Avg. Response', value: '24 hours', color: '#10b981' },
                ].map((stat, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className="insight-row"
                  >
                    <span className="insight-label">{stat.label}</span>
                    <span className="insight-value" style={{ color: stat.color }}>{stat.value}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
            
            {/* Match Insights */}
            <GlassCard>
              <h4 className="sidebar-title mb">Match Insights</h4>
              <p className="match-text">
                Based on your profile analysis, you are a strong match for this role.
              </p>
              
              {/* Match Score Ring */}
              <div className="match-ring-container">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                  className="match-ring"
                >
                  <div className="match-ring-inner">
                    85%
                  </div>
                </motion.div>
              </div>

              <div className="match-skills-list">
                {[
                  { skill: 'React', matched: true },
                  { skill: 'TypeScript', matched: true },
                  { skill: 'Framer Motion', matched: true },
                  { skill: 'GraphQL', matched: false },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    className={`match-skill-item ${item.matched ? 'matched' : 'missing'}`}
                  >
                    {item.matched ? (
                      <CheckCircle size={16} style={{ color: '#10b981' }} />
                    ) : (
                      <AlertCircle size={16} style={{ color: '#ef4444' }} />
                    )}
                    <span className="match-skill-name">{item.skill}</span>
                    {!item.matched && (
                      <motion.span 
                        className="match-learn-link"
                        whileHover={{ x: 2 }}
                      >
                        Learn <ExternalLink size={10} />
                      </motion.span>
                    )}
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};


