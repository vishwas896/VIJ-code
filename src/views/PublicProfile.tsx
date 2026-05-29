'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { motion, type Variants } from 'framer-motion';
import { BookOpen, Code, GitBranch, Star, MessageSquare } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';
import { GlassButton } from '../components/common/GlassButton';
import { PageTransition } from '../components/common/PageTransition';
import './PublicProfile.css';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, type: 'spring' as const, stiffness: 200, damping: 20 }
  })
};

const skills = [
  { name: 'React', level: 95 },
  { name: 'TypeScript', level: 90 },
  { name: 'WebRTC', level: 78 },
  { name: 'Figma', level: 85 },
  { name: 'Node.js', level: 82 },
  { name: 'System Design', level: 75 },
];

const achievements = [
  { icon: '🏆', text: 'WebRTC Architecture Hackathon Winner', date: 'Mar 2024' },
  { icon: '🌟', text: '50+ Accepted Mock Interviews', date: 'Ongoing' },
  { icon: '🎓', text: 'Completed NextJS Advanced Roadmap', date: 'Jan 2024' },
  { icon: '🔥', text: '30-Day Streak on Learning Center', date: 'Feb 2024' },
];

const activities = [
  { icon: <Code size={16} />, text: 'Completed peer interview as Interviewer', time: '2 hours ago', color: 'var(--accent-azure)' },
  { icon: <BookOpen size={16} />, text: 'Published a new article on state management', time: '1 day ago', color: '#a78bfa' },
  { icon: <GitBranch size={16} />, text: 'Started roadmap: Rust for JavaScript Developers', time: '3 days ago', color: '#10b981' },
  { icon: <MessageSquare size={16} />, text: 'Commented on "Framer Motion Best Practices"', time: '4 days ago', color: '#f59e0b' },
  { icon: <Star size={16} />, text: 'Received 5-star review from mock interview', time: '1 week ago', color: '#ef4444' },
];

const contributionData = Array.from({ length: 52 }, (_, week) => 
  Array.from({ length: 7 }, (_, day) => ((week * 7 + day) * 17 % 100) / 100)
);

export const PublicProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();

  return (
    <PageTransition>
      <div className="public-profile-root">
        
        {/* Hero Header */}
        <motion.div custom={0} variants={sectionVariants} initial="hidden" animate="visible">
          <GlassCard className="profile-hero-card">
            {/* Banner */}
            <div className="profile-hero-banner">
              {/* Animated mesh overlay */}
              <motion.div
                className="profile-hero-mesh"
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{ repeat: Infinity, duration: 20, repeatType: 'reverse' }}
              />
            </div>
            
            <div className="profile-hero-content">
              <div className="profile-hero-main">
                <motion.div 
                  className="profile-avatar"
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                >
                  🧑‍🚀
                </motion.div>
                <div className="profile-info">
                  <motion.h1 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    @{username || 'innovator'}
                  </motion.h1>
                  <motion.p 
                    className="profile-role"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Senior Frontend Engineer • Top 5% Contributor
                  </motion.p>
                </div>
                <motion.div
                  className="profile-actions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <GlassButton variant="primary">Connect</GlassButton>
                  <GlassButton variant="secondary" icon={<MessageSquare size={16} />}>Message</GlassButton>
                </motion.div>
              </div>

              {/* Stats Row */}
              <motion.div
                className="profile-stats-row"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {[
                  { label: 'Connections', value: '2.4k' },
                  { label: 'Interviews', value: '156' },
                  { label: 'Roadmaps', value: '12' },
                  { label: 'Endorsements', value: '89' },
                ].map((s) => (
                  <div key={s.label} className="profile-stat-item">
                    <div className="profile-stat-value">{s.value}</div>
                    <div className="profile-stat-label">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>

        <div className="profile-grid">
          {/* Left Column */}
          <div className="profile-column">
            {/* Skills Matrix */}
            <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible">
              <GlassCard>
                <h3 className="section-title">Skills Matrix</h3>
                <div className="skills-list">
                  {skills.map((skill, i) => (
                    <motion.div 
                      key={skill.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.06 }}
                    >
                      <div className="skill-header">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level-text">{skill.level}%</span>
                      </div>
                      <div className="skill-bar-bg">
                        <motion.div 
                          className="skill-bar-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ delay: 0.6 + i * 0.06, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                          style={{ 
                            background: `linear-gradient(90deg, var(--accent-azure), ${skill.level > 85 ? '#6366f1' : '#0ea5e9'})` 
                          }} 
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
            
            {/* Achievements */}
            <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible">
              <GlassCard>
                <h3 className="section-title">Achievements</h3>
                <div className="achievements-list">
                  {achievements.map((ach, i) => (
                    <motion.div 
                      key={i}
                      className="achievement-item"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.08 }}
                    >
                      <span className="achievement-icon">{ach.icon}</span>
                      <div className="achievement-text-container">
                        <div className="achievement-text">{ach.text}</div>
                        <div className="achievement-date">{ach.date}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="profile-column">
            {/* Contribution Graph */}
            <motion.div custom={1} variants={sectionVariants} initial="hidden" animate="visible">
              <GlassCard>
                <div className="heatmap-header">
                  <h3 className="heatmap-title">Activity Heatmap</h3>
                  <span className="heatmap-subtitle">Last 12 months</span>
                </div>
                <div className="heatmap-container">
                  {contributionData.map((week, wi) => (
                    <div key={wi} className="heatmap-col">
                      {week.map((val, di) => (
                        <motion.div
                          key={di}
                          className="heatmap-cell"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + (wi * 7 + di) * 0.001 }}
                          style={{
                            background: val < 0.1 ? 'rgba(0,0,0,0.04)' 
                              : val < 0.3 ? 'rgba(14, 165, 233, 0.2)' 
                              : val < 0.6 ? 'rgba(14, 165, 233, 0.4)' 
                              : val < 0.8 ? 'rgba(14, 165, 233, 0.7)' 
                              : 'var(--accent-azure)'
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Current Roadmap */}
            <motion.div custom={2} variants={sectionVariants} initial="hidden" animate="visible">
              <GlassCard>
                <h3 className="section-title">Current Roadmap Focus</h3>
                <div className="roadmap-focus-container">
                  <div className="roadmap-focus-header">
                    <span className="roadmap-focus-title">Architecting Scalable Frontends</span>
                    <motion.span
                      className="roadmap-focus-percent"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      75%
                    </motion.span>
                  </div>
                  <div className="roadmap-bar-bg">
                    <motion.div 
                      className="roadmap-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ delay: 0.8, duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </div>
                  <div className="roadmap-focus-footer">
                    <span>18/24 modules completed</span>
                    <span>~6h remaining</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Recent Activity */}
            <motion.div custom={3} variants={sectionVariants} initial="hidden" animate="visible">
              <GlassCard>
                <h3 className="section-title">Recent Activity</h3>
                {activities.map((act, i) => (
                  <motion.div 
                    key={i}
                    className="activity-item"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.08 }}
                  >
                    <div className="activity-icon-container" style={{ background: `${act.color}15`, color: act.color }}>
                      {act.icon}
                    </div>
                    <div className="activity-text-container">
                      <span className="activity-text">{act.text}</span>
                    </div>
                    <span className="activity-time">{act.time}</span>
                  </motion.div>
                ))}
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

