'use client';
import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './ProfileReels.css';

interface Reel {
  id: string;
  title: string;
  thumbnail: string;
}

const mockReels: Reel[] = [
  { id: '1', title: 'My Projects', thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80' },
  { id: '2', title: 'Case Studies', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80' },
  { id: '3', title: 'Skill Demos', thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80' },
  { id: '4', title: 'Testimonials', thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80' },
];

export const ProfileReels: React.FC = () => {
  const [activeReel, setActiveReel] = useState<Reel | null>(null);

  return (
    <div className="profile-reels-section glass-panel">
      <h3 className="section-title">Professional Highlights</h3>
      <div className="reels-carousel">
        {mockReels.map(reel => (
          <div key={reel.id} className="reel-item" onClick={() => setActiveReel(reel)}>
            <div className="reel-ring">
              <div className="reel-thumbnail">
                <img src={reel.thumbnail} alt={reel.title} />
              </div>
            </div>
            <span className="reel-title">{reel.title}</span>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {activeReel && (
          <motion.div 
            className="reel-viewer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="close-reel-btn" onClick={() => setActiveReel(null)}>
              <X size={24} />
            </button>
            <motion.div 
              className="reel-content"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              <div className="mock-video-player">
                <Play size={48} className="play-icon" />
                <p>Playing: {activeReel.title}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
