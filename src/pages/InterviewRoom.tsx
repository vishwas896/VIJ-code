import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, PhoneOff, ChevronLeft, ChevronRight } from 'lucide-react';
import './InterviewRoom.css';
import { GlassButton } from '../components/GlassButton';

export const InterviewRoom: React.FC = () => {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  return (
    <div className="interview-room">
      
      {/* Left Pane: Company Context */}
      <AnimatePresence initial={false}>
        {leftOpen && (
          <motion.div 
            className="side-pane left-pane-glass"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="pane-content">
              <h3>Company Context</h3>
              <div className="context-card">
                <h4>Role Details</h4>
                <p><strong>Position:</strong> Senior Frontend Engineer</p>
                <p><strong>Salary Target:</strong> $130,000</p>
                <p><strong>Location:</strong> Remote (US)</p>
              </div>
              <div className="context-card">
                <h4>Required Core</h4>
                <div className="tags">
                  <span className="tag">React</span>
                  <span className="tag">TypeScript</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center Pane: Video Canvas */}
      <motion.div 
        className="center-video-pane"
        layout
      >
        <div className="video-canvas">
          {/* Mock Video Placeholder */}
          <div className="mock-video participant-view"></div>
          <div className="mock-video self-view"></div>
          
          {/* Panes Toggles */}
          <button 
            className="pane-toggle toggle-left" 
            onClick={() => setLeftOpen(!leftOpen)}
          >
            {leftOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
          <button 
            className="pane-toggle toggle-right" 
            onClick={() => setRightOpen(!rightOpen)}
          >
            {rightOpen ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Pill Dock Controls */}
          <div className="dock-container">
            <div className="controls-dock">
              <button 
                className={`dock-btn ${!micOn ? 'muted' : ''}`}
                onClick={() => setMicOn(!micOn)}
              >
                {micOn ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <button 
                className={`dock-btn ${!cameraOn ? 'muted' : ''}`}
                onClick={() => setCameraOn(!cameraOn)}
              >
                {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
              <button className="dock-btn end-call">
                <PhoneOff size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Pane: Candidate Context */}
      <AnimatePresence initial={false}>
        {rightOpen && (
          <motion.div 
            className="side-pane right-pane-glass"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="pane-content">
              <h3>Candidate Verified</h3>
              <div className="match-stamp">100% Match</div>
              <div className="context-card mt-4">
                <h4>Verified Skills</h4>
                <div className="tags">
                  <span className="tag verified">React (Expert)</span>
                  <span className="tag verified">TypeScript</span>
                </div>
              </div>
              <div className="context-card">
                <h4>Education</h4>
                <p>B.S. Computer Science</p>
                <p className="text-muted">Verified via Institution API</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
