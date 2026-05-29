'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right';
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  className = '',
  direction = 'up' 
}) => {
  const dirMap = {
    up:    { y: 30, x: 0 },
    left:  { x: 60, y: 0 },
    right: { x: -60, y: 0 },
  };

  const offset = dirMap[direction];

  return (
    <motion.div
      className={className}
      initial={{ 
        opacity: 0, 
        ...offset, 
        scale: 0.98
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        x: 0, 
        scale: 1
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.97
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 22, 
        mass: 0.8
      }}
      style={{ width: '100%', minHeight: '100%' }}
    >
      {children}
    </motion.div>
  );
};


