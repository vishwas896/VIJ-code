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
        scale: 0.98,
        filter: 'blur(6px)' 
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        x: 0, 
        scale: 1,
        filter: 'blur(0px)' 
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.97,
        filter: 'blur(4px)' 
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 22, 
        mass: 0.8,
        filter: { duration: 0.3 }
      }}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};
