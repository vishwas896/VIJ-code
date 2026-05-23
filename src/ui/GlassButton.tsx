import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './GlassButton.css';

interface GlassButtonProps extends React.ComponentProps<typeof motion.button> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  icon?: React.ReactNode;
  glowingEdge?: 'azure' | 'gold' | 'none';
  loading?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  icon,
  glowingEdge,
  loading = false,
  onClick,
  ...props 
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const edgeClass = glowingEdge && glowingEdge !== 'none' ? `glow-${glowingEdge}` : '';

  // Magnetic hover
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { damping: 15, stiffness: 200 });
  const springY = useSpring(my, { damping: 15, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mx.set((e.clientX - cx) * 0.15);
    my.set((e.clientY - cy) * 0.15);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  // Ripple effect
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.left = `${rippleX}px`;
    ripple.style.top = `${rippleY}px`;
    btnRef.current.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    onClick?.(e);
  }, [onClick]);

  return (
    <motion.button
      ref={btnRef}
      className={`glass-button variant-${variant} ${edgeClass} ${loading ? 'is-loading' : ''} ${className}`}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96, rotate: -0.5 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" />
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          <span className="btn-text">{children}</span>
        </>
      )}
    </motion.button>
  );
};
