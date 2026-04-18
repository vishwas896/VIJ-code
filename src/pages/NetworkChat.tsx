import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Send } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import './Networking.css';

export const NetworkChat: React.FC = () => {
  return (
    <div className="networking-page">
      <div className="chat-layout">
        <div className="connections-list">
          <GlassCard className="connection-card active">
            <div className="conn-avatar"></div>
            <div className="conn-info">
              <h4>Hiring Manager • Google</h4>
              <span>Active 2m ago</span>
            </div>
          </GlassCard>
          <GlassCard className="connection-card">
            <div className="conn-avatar"></div>
            <div className="conn-info">
              <h4>Talent Scout • Apple</h4>
              <span>Active 1hr ago</span>
            </div>
          </GlassCard>
        </div>
        
        <div className="chat-window">
          <div className="chat-header">
            <div className="identity-shield">
              <Shield size={16} />
              <span>Identity Protected</span>
            </div>
          </div>
          <div className="chat-messages">
            <div className="message received">
              <div className="bubble">Hi! Your profile is a 100% match for our Sr. React open position. I noticed your work with Framer Motion.</div>
            </div>
            <motion.div 
              className="message sent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="bubble">Thank you! Yes, I love building fluid interfaces.</div>
            </motion.div>
          </div>
          <div className="chat-input-area">
            <input type="text" placeholder="Send a secure message..." />
            <button className="send-btn"><Send size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};
