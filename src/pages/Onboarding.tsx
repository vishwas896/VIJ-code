import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import './Onboarding.css';

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  return (
    <div className="onboarding-page">
      <div className="wizard-container">
        
        {/* Progress Ring / Bar */}
        <div className="progress-section">
          <div className="progress-text">Step {step} of 3</div>
          <div className="progress-track">
            <motion.div 
              className="progress-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
              transition={{ duration: 0.5, type: 'spring' }}
            />
          </div>
        </div>

        <div className="wizard-pane-container">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="wizard-pane"
              >
                <h2>Configure Your Identity</h2>
                <p className="pane-subtitle">Let's set up your core profile parameters.</p>
                
                <div className="input-group">
                  <input type="text" className="fluid-input" placeholder="Full Name" />
                </div>
                
                <div className="phone-group">
                  <input type="text" className="fluid-input country-code" placeholder="+1" />
                  <input type="tel" className="fluid-input phone-number" placeholder="Mobile Number" />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="wizard-pane"
              >
                <h2>Define Your Parameters</h2>
                <p className="pane-subtitle">Add exact skills to feed the Match Engine.</p>
                
                <div className="input-group" style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                  <input 
                    type="text" 
                    className="fluid-input" 
                    placeholder="Type a skill..." 
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkill}
                    style={{ flex: 1 }}
                  />
                  <GlassButton variant="secondary" onClick={() => handleAddSkill({ key: 'Enter' } as any)}>Add Skill</GlassButton>
                </div>
                
                <div className="skill-cloud">
                  <AnimatePresence>
                    {skills.map((skill, idx) => (
                      <motion.span 
                        key={`${skill}-${idx}`}
                        className="floating-tag"
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        whileHover={{ y: -2 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="wizard-pane"
              >
                <h2>100% Ready</h2>
                <p className="pane-subtitle">Your parameters are synchronized.</p>
                <GlassCard className="success-card" glowingEdge="azure">
                  <div className="success-icon">✓</div>
                  <h3>Profile Activated</h3>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="wizard-controls">
          {step > 1 && (
            <GlassButton variant="secondary" onClick={() => setStep(s => s - 1)}>
              Back
            </GlassButton>
          )}
          {step < 3 ? (
            <GlassButton onClick={() => setStep(s => s + 1)} className="ml-auto">
              Next Step
            </GlassButton>
          ) : (
            <GlassButton onClick={() => window.location.href = '/recruiter/dashboard'} className="ml-auto" glowingEdge="azure">
              Complete Profile
            </GlassButton>
          )}
        </div>
      </div>
    </div>
  );
};
