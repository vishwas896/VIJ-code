import React from 'react';
import { motion } from 'framer-motion';
import './GlassCard.css';

interface GlassCardProps extends React.ComponentProps<typeof motion.div> {
  children: React.ReactNode;
  className?: string;
  glowingEdge?: 'azure' | 'gold' | 'none';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  glowingEdge = 'none',
  ...props 
}) => {
  const edgeClass = glowingEdge !== 'none' ? `glow-${glowingEdge}` : '';
  
  return (
    <motion.div
      className={`glass-card ${edgeClass} ${className}`}
      whileHover={{ 
        y: -4, 
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        boxShadow: '0 12px 40px 0 rgba(14, 165, 233, 0.15)'
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 30 
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
