import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './GlassCard.css';

interface GlassCardProps extends React.ComponentProps<typeof motion.div> {
  children: React.ReactNode;
  className?: string;
  glowingEdge?: 'azure' | 'gold' | 'none';
  tilt?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  glowingEdge = 'none',
  tilt = false,
  ...props 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const edgeClass = glowingEdge !== 'none' ? `glow-${glowingEdge}` : '';

  // 3D tilt values
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [4, -4]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-4, 4]), { damping: 20, stiffness: 150 });

  // Spotlight gradient position
  const spotlightX = useTransform(mouseX, [0, 1], [0, 100]);
  const spotlightY = useTransform(mouseY, [0, 1], [0, 100]);
  const spotlightBackground = useTransform(
    [spotlightX, spotlightY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || !tilt) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={`glass-card ${edgeClass} ${className}`}
      style={tilt ? { rotateX, rotateY, transformPerspective: 800 } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Spotlight overlay */}
      {tilt && (
        <motion.div
          className="glass-card-spotlight"
          style={{
            background: spotlightBackground,
          }}
        />
      )}
      {children}
    </motion.div>
  );
};
