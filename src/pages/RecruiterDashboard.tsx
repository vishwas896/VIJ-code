import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Navigation } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import './RecruiterDashboard.css';

export const RecruiterDashboard: React.FC = () => {
  const [matches, setMatches] = useState([
    { id: 1, name: 'Alice Walker', match: 100, role: 'Senior React Dev' },
    { id: 2, name: 'David Chen', match: 95, role: 'Senior React Dev' }
  ]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-grid">
        
        {/* Left Side: Postings */}
        <div className="left-pane">
          <div className="pane-header">
            <h2>Active Postings</h2>
            <GlassButton variant="secondary" className="small-btn" onClick={() => window.location.href = '/recruiter/post-job'}>
              Post New Job Requirement
            </GlassButton>
          </div>
          
          <div className="postings-list">
            <GlassCard className="posting-card active-posting" onClick={() => window.location.href = '/recruiter/jobs/1'}>
              <h3>Senior React Dev</h3>
              <p>Remote • $120k-$150k</p>
              <div className="posting-stats">
                <span>12 Matches</span>
                <span className="dot">•</span>
                <span className="live-pulse">Live</span>
              </div>
            </GlassCard>
            
            <GlassCard className="posting-card">
              <h3>UX Designer</h3>
              <p>New York • $90k-$110k</p>
              <div className="posting-stats">
                <span>4 Matches</span>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Right Side: Match Feed */}
        <div className="right-pane">
          <div className="pane-header">
            <h2>Live Match Engine</h2>
            <div className="engine-status">Listening... <span className="listening-pulse"></span></div>
          </div>
          
          <div className="match-feed">
            <AnimatePresence>
              {matches.map((match) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  layout
                >
                  <GlassCard 
                    className="match-card" 
                    glowingEdge={match.match === 100 ? 'gold' : 'none'}
                  >
                    <div className="match-header">
                      <div className="candidate-info">
                        <div className="avatar">AW</div>
                        <div>
                          <h3>{match.name}</h3>
                          <div className="pii-shield">
                            <Lock size={12} />
                            <span>Secured by VIJ Mediation</span>
                          </div>
                        </div>
                      </div>
                      <div className="match-score">
                        <span className="score-value">{match.match}%</span>
                        <span className="score-label">Match</span>
                      </div>
                    </div>
                    
                    <div className="match-skills">
                      <span className="tag">React</span>
                      <span className="tag">TypeScript</span>
                      <span className="tag">Framer Motion</span>
                    </div>

                    <div className="match-actions">
                      <GlassButton className="full-width" glowingEdge="azure">
                        Schedule Interview
                      </GlassButton>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
      </div>
    </div>
  );
};
