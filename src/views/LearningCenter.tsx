'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Pause, CheckCircle, Clock, ChevronRight, BookOpen, Award } from 'lucide-react';
import { GlassButton } from '../components/common/GlassButton';
import { PageTransition } from '../components/common/PageTransition';
import './LearningCenter.css';

const modules = [
  { title: '1. Introduction to the Core Patterns', active: false, done: true, duration: '32 min' },
  { title: '2. The Render Pipeline', active: true, done: false, duration: '45 min' },
  { title: '3. Advanced State Management', active: false, done: false, duration: '52 min' },
  { title: '4. Error Boundaries and Suspense', active: false, done: false, duration: '38 min' },
  { title: '5. Server Components (RSC)', active: false, done: false, duration: '41 min' },
  { title: '6. Performance Profiling', active: false, done: false, duration: '35 min' },
];

export const LearningCenter: React.FC = () => {
  useParams<{ courseId: string }>();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeModule, setActiveModule] = useState(1);

  const completedCount = modules.filter(m => m.done).length;
  const progress = Math.round((completedCount / modules.length) * 100);

  return (
    <PageTransition>
      <div className="learning-center-root">
        {/* Header bar */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="learning-header"
        >
          <div className="learning-header-left">
            <GlassButton variant="secondary" onClick={() => router.push('/marketplace')} className="learning-back-btn" icon={<ArrowLeft size={14} />}>
              Back
            </GlassButton>
            <div>
              <h1 className="learning-title">Advanced React Architecture Masters</h1>
              <span className="learning-subtitle">Module {activeModule + 1} of {modules.length}</span>
            </div>
          </div>
          <div className="learning-header-right">
            <motion.div className="learning-progress-badge">
              <BookOpen size={14} className="learning-progress-icon" />
              <span className="learning-progress-text">{progress}% Complete</span>
            </motion.div>
            <div className="learning-progress-bar-bg">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="learning-progress-bar-fill"
              />
            </div>
            {completedCount > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="learning-completed-badge"
              >
                <Award size={14} />
                {completedCount} done
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="learning-content-wrapper">
          {/* Sidebar - Modules */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="learning-sidebar"
          >
            <div className="learning-sidebar-inner">
              <h3 className="learning-sidebar-title">
                Course Content
              </h3>
              {modules.map((mod, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  onClick={() => setActiveModule(i)}
                  className={`module-item ${activeModule === i ? 'active' : ''}`}
                >
                  <div className={`module-icon ${mod.done ? 'done' : activeModule === i ? 'active' : 'pending'}`}>
                    {mod.done ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <div className="module-info">
                    <div className={`module-title ${activeModule === i ? 'active' : 'inactive'}`}>
                      {mod.title}
                    </div>
                    <div className="module-duration">
                      <Clock size={10} /> {mod.duration}
                    </div>
                  </div>
                  {activeModule === i && <ChevronRight size={14} className="module-chevron" />}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="learning-main-content">
            {/* Video Player */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="video-player-container"
            >
              {/* Ambient glow */}
              <div className="video-ambient-glow" />
              
              {/* Play Button */}
              <motion.div 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="play-pause-btn"
              >
                {isPlaying ? (
                  <Pause size={32} color="white" />
                ) : (
                  <Play size={32} color="white" style={{ marginLeft: '4px' }} />
                )}
              </motion.div>
              
              {/* Video Timeline */}
              <div className="video-timeline-container">
                <div className="video-timeline">
                  <span className="timeline-time">03:24</span>
                  <div className="timeline-bar-bg">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: isPlaying ? '100%' : '15%' }}
                      transition={{ duration: isPlaying ? 30 : 0.3 }}
                      className="timeline-bar-fill"
                    >
                      <div className="timeline-handle" />
                    </motion.div>
                  </div>
                  <span className="timeline-time">22:30</span>
                </div>
              </div>
            </motion.div>
            
            {/* Module Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="module-details-container"
            >
              <div className="module-details-header">
                <h2 className="module-details-title">Module 2: The Render Pipeline</h2>
                <div className="module-details-actions">
                  <GlassButton variant="secondary" className="module-action-btn">Resources</GlassButton>
                  <GlassButton variant="secondary" className="module-action-btn">Notes</GlassButton>
                </div>
              </div>
              <p className="module-description">
                In this module, we will deep dive into React's render phase vs commit phase. 
                Understanding this pipeline is crucial for identifying performance bottlenecks. 
                We'll look at the fiber tree, how reconciliation determines what to update, and common pitfalls that cause unnecessary re-renders.
              </p>
              <div className="module-meta-info">
                <span className="module-meta-item"><Clock size={14} /> 45 min</span>
                <span className="module-meta-item"><BookOpen size={14} /> 3 exercises</span>
                <span className="module-meta-item"><Award size={14} /> Certificate on completion</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

