import React from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/GlassCard';
import './Networking.css';

export const Roadmaps: React.FC = () => {
  return (
    <div className="networking-page" style={{ alignItems: 'center' }}>
      <div className="roadmap-layout" style={{ width: '100%', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '40px', textAlign: 'center' }}>Talent Roadmaps</h1>
        
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
                <button className="applaud-btn">👏 Applaud Journey</button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
