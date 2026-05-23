import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Send } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { PageTransition } from '../components/PageTransition';
import './Networking.css';

export const Networking: React.FC = () => {
  const [view, setView] = useState<'chat' | 'roadmap'>('chat');

  return (
    <PageTransition>
      <div className="networking-page">
      <div className="view-toggle">
        <button className={view === 'chat' ? 'active' : ''} onClick={() => setView('chat')}>Protected Chat</button>
        <button className={view === 'roadmap' ? 'active' : ''} onClick={() => setView('roadmap')}>Talent Roadmap</button>
      </div>

      {view === 'chat' ? (
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
      ) : (
        <div className="roadmap-layout">
          <div className="timeline-container">
            {[
              { year: '2020', title: 'Self-Taught Beginnings', desc: 'Started learning HTML/CSS late at night.' },
              { year: '2022', title: 'The Struggle', desc: 'Built 50 failed projects before landing the first freelance gig.' },
              { year: '2024', title: 'Senior Position', desc: 'Led frontend architecture for a major tech firm.' }
            ].map((node, i) => (
              <motion.div 
                key={i}
                className="timeline-node"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="node-marker">
                  <div className="glow-dot"></div>
                  <div className="vector-line"></div>
                </div>
                <GlassCard className="node-content">
                  <span className="node-year">{node.year}</span>
                  <h3>{node.title}</h3>
                  <p>{node.desc}</p>
                  <button className="applaud-btn">👏 Applaud</button>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}
      </div>
    </PageTransition>
  );
};
