import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Tag, Zap, AlertCircle, CheckCircle, X } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { PageTransition } from '../components/PageTransition';
import './RecruiterPostJob.css';

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, type: 'spring' as const, stiffness: 300, damping: 24 }
  })
};

export const RecruiterPostJob: React.FC = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript']);
  const [skillInput, setSkillInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills(prev => [...prev, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => navigate('/recruiter/dashboard'), 1500);
    }, 2000);
  };

  if (submitted) {
    return (
      <PageTransition>
        <div className="recruiter-post-success">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <GlassCard>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
              >
                <CheckCircle size={64} className="recruiter-post-success-icon" />
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="recruiter-post-success-title"
              >
                Requirement Activated!
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="recruiter-post-success-desc"
              >
                The VIJ Match Engine is now scanning for candidates. You'll receive real-time alerts.
              </motion.p>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.6, duration: 1.5 }}
                className="recruiter-post-success-bar"
              />
            </GlassCard>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="recruiter-post-root">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="recruiter-post-header">
            <motion.div
              className="recruiter-post-icon-wrapper"
              whileHover={{ rotate: 5, scale: 1.05 }}
            >
              <Briefcase size={24} color="white" />
            </motion.div>
            <div>
              <h1 className="recruiter-post-title">Post New Requirement</h1>
              <p className="recruiter-post-subtitle">Configure strict parameter matching for the VIJ engine</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ margin: '24px 0' }}
        >
          <GlassCard className="recruiter-post-alert-card">
            <AlertCircle size={18} className="recruiter-post-alert-icon" />
            <span className="recruiter-post-alert-text">
              All candidates are matched using VIJ's proprietary algorithm. PII remains protected until payment.
            </span>
          </GlassCard>
        </motion.div>

        {/* Form */}
        <GlassCard className="recruiter-post-form-card">
          {/* Processing overlay */}
          <AnimatePresence>
            {submitting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="recruiter-post-overlay"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="recruiter-post-spinner"
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="recruiter-post-overlay-text"
                >
                  Activating Match Engine...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="recruiter-post-form">
            {/* Job Title */}
            <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
              <label className="recruiter-post-label">
                <Briefcase size={14} /> Job Title
              </label>
              <input 
                type="text" 
                className="recruiter-post-input"
                placeholder="e.g. Senior Frontend Engineer" 
              />
            </motion.div>
            
            {/* Location + Salary Row */}
            <div className="recruiter-post-row">
              <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible" className="recruiter-post-col">
                <label className="recruiter-post-label">
                  <MapPin size={14} /> Location Scope
                </label>
                <select className="recruiter-post-select">
                  <option value="remote">🌐 Fully Remote</option>
                  <option value="hybrid">🏢 Hybrid</option>
                  <option value="onsite">📍 On Site</option>
                </select>
              </motion.div>
              <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible" className="recruiter-post-col">
                <label className="recruiter-post-label">
                  <DollarSign size={14} /> Salary Target
                </label>
                <input 
                  type="text" 
                  className="recruiter-post-input"
                  placeholder="$120,000 - $180,000"
                />
              </motion.div>
            </div>

            {/* Skills */}
            <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
              <label className="recruiter-post-label">
                <Tag size={14} /> Core Skills Required
              </label>
              <div className="recruiter-post-skills-container">
                <AnimatePresence>
                  {skills.map(skill => (
                    <motion.span
                      key={skill}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                      className="recruiter-post-skill-pill"
                    >
                      {skill}
                      <X 
                        size={14} 
                        className="recruiter-post-skill-remove"
                        onClick={() => removeSkill(skill)}
                      />
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <div className="recruiter-post-skill-input-container">
                <input 
                  type="text" 
                  className="recruiter-post-input recruiter-post-skill-input"
                  placeholder="Type a skill and press Enter..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                />
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
              <GlassButton 
                type="submit" 
                variant="primary"
                icon={<Zap size={18} />}
                className="recruiter-post-submit-btn"
                disabled={submitting}
              >
                Activate Match Engine
              </GlassButton>
            </motion.div>
          </form>
        </GlassCard>
      </div>
    </PageTransition>
  );
};
