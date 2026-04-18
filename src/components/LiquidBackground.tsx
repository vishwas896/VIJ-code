import React from 'react';
import { motion } from 'framer-motion';
import './LiquidBackground.css';

export const LiquidBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="liquid-bg-container">
      <div className="liquid-bg-mesh">
        <motion.div 
          className="mesh-orb orb-1"
          animate={{
            transform: ['translate(0%, 0%)', 'translate(10%, 10%)', 'translate(-10%, -5%)', 'translate(0%, 0%)'],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="mesh-orb orb-2"
          animate={{
            transform: ['translate(0%, 0%)', 'translate(-15%, 15%)', 'translate(5%, -15%)', 'translate(0%, 0%)'],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="mesh-orb orb-3"
          animate={{
            transform: ['translate(0%, 0%)', 'translate(20%, -10%)', 'translate(-10%, 20%)', 'translate(0%, 0%)'],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="liquid-bg-content">
        {children}
      </div>
    </div>
  );
};
