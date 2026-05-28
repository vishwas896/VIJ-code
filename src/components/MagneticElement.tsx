'use client';
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface MagneticElementProps {
  children: React.ReactNode;
  strength?: number;     // 0.1 (subtle) to 0.5 (strong)
  className?: string;
  as?: 'div' | 'span' | 'button';
}

export const MagneticElement: React.FC<MagneticElementProps> = ({
  children,
  strength = 0.2,
  className = '',
  as = 'div',
}) => {
  const ref = useRef<HTMLDivElement | HTMLSpanElement | HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = (e.clientX - centerX) * strength;
    const distY = (e.clientY - centerY) * strength;
    x.set(distX);
    y.set(distY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const sharedProps = {
    className,
    style: { x: smoothX, y: smoothY },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  };

  if (as === 'button') {
    return (
      <motion.button ref={ref as React.Ref<HTMLButtonElement>} type="button" {...sharedProps}>
        {children}
      </motion.button>
    );
  }

  if (as === 'span') {
    return (
      <motion.span ref={ref as React.Ref<HTMLSpanElement>} {...sharedProps}>
        {children}
      </motion.span>
    );
  }

  return (
    <motion.div ref={ref as React.Ref<HTMLDivElement>} {...sharedProps}>
      {children}
    </motion.div>
  );
};

