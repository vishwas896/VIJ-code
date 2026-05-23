import React from 'react';
import { motion } from 'framer-motion';
import './LiquidBackground.css';

export const LiquidBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="liquid-bg-container">
      <div className="liquid-bg-mesh">
        <motion.div 
          className="mesh-orb orb-1"
          initial={{ scale: 1.1, x: '5%', y: '5%' }}
        />
        <motion.div 
          className="mesh-orb orb-2"
          initial={{ scale: 0.9, x: '-10%', y: '10%' }}
        />
        <motion.div 
          className="mesh-orb orb-3"
          initial={{ scale: 1.05, x: '15%', y: '-5%' }}
        />
        <motion.div 
          className="mesh-orb orb-4"
          initial={{ scale: 0.95, x: '-5%', y: '-10%' }}
        />
      </div>
      <div className="liquid-bg-content">
        {children}
      </div>
    </div>
  );
};
