import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase } from 'lucide-react';
import './BackJobsBar.css';

export const BackJobsBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on home or jobs pages (top-level nav destinations)
  if (location.pathname === '/' || location.pathname === '/jobs') return null;

  const isJobsPage = location.pathname.startsWith('/jobs');

  return (
    <motion.div
      className="back-explore-bar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.1 }}
    >
      {/* Back Button */}
      <motion.button
        className="back-btn"
        onClick={() => navigate(-1)}
        whileHover={{ x: -3, scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <motion.span
          className="back-icon"
          initial={{ x: 0 }}
          whileHover={{ x: -2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          <ArrowLeft size={16} />
        </motion.span>
        <span>Back</span>
      </motion.button>

      {/* Jobs Button — only show if not already on jobs */}
      {!isJobsPage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
        >
          <Link to="/jobs" className="explore-btn">
            <motion.span
              className="explore-icon"
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
            >
              <Briefcase size={15} />
            </motion.span>
            <span>Jobs</span>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};
