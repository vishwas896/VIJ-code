import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import './GuestBanner.css';

export const GuestBanner: React.FC = () => {
  const [visible, setVisible] = useState(true);

  // Auto-dismiss after 5 seconds (longer to let users read)
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="guest-banner-fixed"
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <div className="guest-banner-glass">
            {/* Breathing glow border */}
            <div className="banner-breathing-glow" />

            {/* Progress bar that counts down */}
            <motion.div 
              className="banner-timer-bar"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
            />

            <div className="banner-context">
              <motion.div 
                className="banner-icon-ring"
                animate={{ 
                  boxShadow: [
                    '0 4px 12px rgba(14, 165, 233, 0.15)',
                    '0 4px 20px rgba(14, 165, 233, 0.35)',
                    '0 4px 12px rgba(14, 165, 233, 0.15)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles size={18} className="banner-sparkle" />
                </motion.div>
              </motion.div>
              <div className="banner-text">
                <h3>Experience the 100% Match Engine</h3>
                <p>Unlock private networking, salary insights, and secure career roadmaps.</p>
              </div>
            </div>
            
            <div className="banner-actions">
              <Link to="/login" className="banner-btn-secondary">
                Log In
              </Link>
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Link to="/register" className="banner-btn-primary">
                  Join the Junction <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
