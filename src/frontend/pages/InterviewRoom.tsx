import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, Lock, Unlock, ArrowLeft, Compass } from 'lucide-react';
import { VijLogo } from '../components/VijLogo';
import { PageTransition } from '../components/PageTransition';
import './InterviewRoom.css';

// --- MOCK DATA ---
const JOB_DATA = {
  title: 'Senior Next.js Developer',
  company: 'Garrison Infra & Security Pvt. Ltd.',
  rating: 4.8,
  salary: '$120k - $150k',
  requirements: ['Next.js App Router', 'TypeScript', 'Microservices', 'Tailwind CSS'],
  reviews: ['"Great culture, highly technical team." - Current SDE', '"Fast-paced, great benefits." - PM']
};

const CANDIDATE_DATA = {
  name: 'Alex Developer',
  role: 'Full-Stack Engineer',
  education: 'IGNOU - Distance Learning (B.Tech)',
  projects: ['Virtual Intelligent Junction', 'Quess Corp Clone'],
  skills: ['React', 'Next.js', 'PostgreSQL', 'WebRTC'],
  experience: '3 Years (B2B & B2C Operations)',
};

export const InterviewRoom: React.FC = () => {
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [userRole, setUserRole] = useState<'recruiter' | 'jobseeker'>('jobseeker'); 
  
  // Call Controls
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  // Recruiter Decision State
  const [selectionStatus, setSelectionStatus] = useState<'pending' | 'selected' | 'rejected'>('pending');
  // Mock premium check
  const [hasPremium] = useState(true); 

  return (
    <PageTransition>
      {/* ── Floating Navigation Header ── */}
      <motion.div
        className="ir-floating-nav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <motion.button
          className="ir-nav-btn"
          onClick={() => navigate(-1)}
          whileHover={{ x: -2, scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </motion.button>

        <Link to="/" className="ir-nav-logo">
          <VijLogo size="sm" showText={false} theme="dark" />
        </Link>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}>
          <Link to="/explore" className="ir-nav-btn ir-nav-explore">
            <Compass size={15} />
            <span>Explore</span>
          </Link>
        </motion.div>
      </motion.div>

      <div className="interview-room-wrapper">
        
        {/* --- DEV TOGGLE (Remove in Production) --- */}
        <div className="dev-toggle-bar">
          <span>View As:</span>
          <button 
            onClick={() => setUserRole('jobseeker')} 
            className={userRole === 'jobseeker' ? 'active-role' : ''}
          >
            Jobseeker
          </button>
          <button 
            onClick={() => setUserRole('recruiter')} 
            className={userRole === 'recruiter' ? 'active-role' : ''}
          >
            Recruiter
          </button>
        </div>

        {/* --- MAIN 3-PANE LAYOUT --- */}
        <div className="ir-main-container">
          
          {/* ========================================== */}
          {/* LEFT PANE: COMPANY & JOB CONTEXT           */}
          {/* ========================================== */}
          <div className="ir-side-pane">
            <div className="ir-pane-header">
              <h2>{JOB_DATA.title}</h2>
              <p>{JOB_DATA.company}</p>
            </div>
            
            <div className="ir-pane-content">
              {/* Job Details */}
              <section className="ir-section">
                <h3>Job Parameters</h3>
                <div className="ir-tag-container">
                  <span className="ir-tag green">{JOB_DATA.salary}</span>
                  <span className="ir-tag gray">Remote</span>
                </div>
              </section>

              {/* 100% Match Requirements */}
              <section className="ir-section">
                <h3>Required Skills</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {JOB_DATA.requirements.map((req, i) => (
                    <div key={i} className="ir-list-item">
                      <div className="ir-dot" /> {req}
                    </div>
                  ))}
                </div>
              </section>

              {/* Employee Reviews */}
              <section className="ir-section" style={{ marginTop: 'auto' }}>
                <h3>Company Insights ★ {JOB_DATA.rating}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {JOB_DATA.reviews.map((review, i) => (
                    <div key={i} className="ir-review-card">
                      {review}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* ========================================== */}
          {/* MIDDLE PANE: VIDEO & ACTIONS               */}
          {/* ========================================== */}
          <div className="ir-middle-pane">
            
            {/* Top Bar inside Video Pane */}
            <div className="ir-video-topbar">
              <span className="ir-live-badge">
                <div className="ir-pulse-dot" /> LIVE INTERVIEW
              </span>
              <span className="ir-timer">45:12</span>
            </div>

            {/* WebRTC Video Grid (Mocked) */}
            <div className="ir-video-grid">
               {/* Main Speaker (Other Person) */}
               <div className="ir-main-speaker">
                 <div className="ir-avatar-placeholder">
                   {userRole === 'jobseeker' ? '🏢' : '👤'}
                 </div>
                 <span className="ir-speaker-name">
                   {userRole === 'jobseeker' ? JOB_DATA.company : CANDIDATE_DATA.name}
                 </span>
               </div>
               
               {/* Self View (Picture in Picture) */}
               <div className="ir-self-view">
                 <div className="ir-self-view-inner">
                   <span>Self View</span>
                 </div>
               </div>
            </div>

            {/* Call Controls Dock */}
            <div className="ir-dock">
              {/* Standard Controls (Visible to Both) */}
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className={`ir-control-btn ${isMuted ? 'danger' : 'standard'}`}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button 
                onClick={() => setIsVideoOff(!isVideoOff)} 
                className={`ir-control-btn ${isVideoOff ? 'danger' : 'standard'}`}
              >
                {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
              </button>
              <button className="ir-control-btn standard">
                <MonitorUp size={20} />
              </button>

              {/* Recruiter ONLY Actions */}
              {userRole === 'recruiter' && (
                <>
                  <div className="ir-dock-divider" />
                  <button 
                    onClick={() => setSelectionStatus('selected')}
                    disabled={selectionStatus !== 'pending'}
                    className="ir-action-btn ir-btn-select"
                  >
                    {selectionStatus === 'selected' ? '✓ SELECTED' : 'SELECT'}
                  </button>
                  <button 
                    onClick={() => setSelectionStatus('rejected')}
                    disabled={selectionStatus !== 'pending'}
                    className="ir-action-btn ir-btn-reject"
                  >
                     REJECT
                  </button>
                </>
              )}

              <button 
                className="ir-control-btn danger ir-btn-end" 
                onClick={() => navigate('/network')}
              >
                <PhoneOff size={20} />
              </button>
            </div>
          </div>

          {/* ========================================== */}
          {/* RIGHT PANE: CANDIDATE PROFILE & PRIVACY    */}
          {/* ========================================== */}
          <div className="ir-side-pane">
            
            {/* Identity & Privacy Header */}
            <div className="ir-pane-header">
              <h2>{CANDIDATE_DATA.name}</h2>
              <p>{CANDIDATE_DATA.role}</p>
              
              {/* Security Badge */}
              <div className="ir-security-badge">
                <Lock size={12} /> ID Verified
              </div>
            </div>

            <div className="ir-pane-content">
              
              {/* The Contact Info Paywall / Privacy Mask */}
              <AnimatePresence mode="wait">
                {selectionStatus === 'selected' && hasPremium && userRole === 'recruiter' ? (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="ir-paywall-unlocked"
                  >
                    <h3><Unlock size={12} style={{ display: 'inline', marginRight: '4px' }} /> Contact Unlocked</h3>
                    <p>📧 alex.dev@example.com</p>
                    <p>📱 +91 98765 43210</p>
                    <button className="ir-chat-btn">
                      Open Direct Chat
                    </button>
                  </motion.div>
                ) : (
                  <motion.div className="ir-paywall-locked">
                    <div className="ir-paywall-overlay">
                      <span role="img" aria-label="shield">🛡️</span>
                      <span>Contact Hidden <br/> Select candidate to unlock</span>
                    </div>
                    <div className="ir-paywall-blurred-content">
                      <p>📧 hidden@email.com</p>
                      <p>📱 +00 00000 00000</p>
                      <p>🔗 linkedin.com/in/hidden</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Profile Content (Always visible) */}
              <section className="ir-section">
                <h3>Verified Experience</h3>
                <p className="ir-info-card">{CANDIDATE_DATA.experience}</p>
              </section>

              <section className="ir-section">
                <h3>Education & Courses</h3>
                <p className="ir-info-card">{CANDIDATE_DATA.education}</p>
              </section>

              <section className="ir-section">
                <h3>100% Match Skills</h3>
                <div className="ir-tag-container">
                  {CANDIDATE_DATA.skills.map((skill, i) => (
                    <span key={i} className="ir-tag blue">{skill}</span>
                  ))}
                </div>
              </section>
              
              <section className="ir-section">
                 <h3>Platform Projects</h3>
                 <div style={{ display: 'flex', flexDirection: 'column' }}>
                   {CANDIDATE_DATA.projects.map((project, i) => (
                     <div key={i} className="ir-project-card">
                       <span style={{ color: '#3b82f6' }}>📁</span> {project}
                     </div>
                   ))}
                 </div>
              </section>

            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};
