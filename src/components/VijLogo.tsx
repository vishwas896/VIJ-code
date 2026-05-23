import React from 'react';
import { motion, type Variants } from 'framer-motion';
import './VijLogo.css';

// Use the VIJ animated GIF logo from public folder
const logoSrc = '/vij-logo.gif';

interface VijLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  theme?: 'light' | 'dark' | 'alt';
}

const logoEase = [0.22, 1, 0.36, 1] as const;

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: 0.6 + i * 0.06,
      duration: 0.5,
      ease: logoEase,
    },
  }),
};

const separatorVariants: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.4,
      ease: logoEase,
    },
  },
};

const logoVariants: Variants = {
  hidden: { scale: 0.7, opacity: 0, rotate: -10 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      delay: 0.1,
    },
  },
};

const brandName = 'Virtual Intelligent Junction';

export const VijLogo: React.FC<VijLogoProps> = ({ 
  size = 'md', 
  showText = true,
  theme = 'light' 
}) => {
  const sizeMap = {
    sm: { icon: 32, fontSize: '11px' },
    md: { icon: 54, fontSize: '12.5px' },
    lg: { icon: 84, fontSize: '16px' },
  };

  const s = sizeMap[size];

  return (
    <div className={`vij-logo-wrapper vij-logo-${size} theme-${theme}`}>
      {/* SVG Logo (transparent background) */}
      <motion.div
        className="vij-logo-icon"
        style={{ width: s.icon, height: s.icon }}
        variants={logoVariants}
        initial="hidden"
        animate="visible"
      >
        <img 
          src={logoSrc} 
          alt="VIJ Logo" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain',
            display: 'block',
            filter: theme === 'dark' ? 'invert(1) brightness(1.5)' : 'none'
          }} 
        />
      </motion.div>

      {/* Animated Brand Text */}
      {showText && (
        <>
          <motion.div
            className="vij-logo-separator"
            variants={separatorVariants}
            initial="hidden"
            animate="visible"
          />
          <div className="vij-logo-text" style={{ fontSize: s.fontSize }}>
            {brandName.split('').map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                className={`vij-logo-char ${char === ' ' ? 'vij-space' : ''} ${
                  i >= 8 && i <= 18 ? 'vij-highlight' : ''
                }`}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                custom={i}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
