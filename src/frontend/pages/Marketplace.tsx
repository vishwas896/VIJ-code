import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Clock, Users, Play, Award, Search, Filter } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { PageTransition } from '../components/PageTransition';
import './WalletMarketplace.css';
import './Marketplace.css';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 }
  }
};

const courses = [
  { id: 1, title: 'Advanced React Architecture', duration: '4.5h', rating: 4.8, price: 50, learners: '3.2k', lessons: 24, level: 'Advanced', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', icon: '⚛️' },
  { id: 2, title: 'Framer Motion Masterclass', duration: '2h', rating: 4.9, price: 30, learners: '5.1k', lessons: 16, level: 'Intermediate', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', icon: '🎭' },
  { id: 3, title: 'WebRTC Fundamentals', duration: '3.2h', rating: 4.7, price: 45, learners: '1.8k', lessons: 20, level: 'Advanced', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', icon: '📡' },
  { id: 4, title: 'UI/UX with Glassmorphism', duration: '1h', rating: 4.9, price: 15, learners: '8.4k', lessons: 8, level: 'Beginner', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', icon: '✨' },
  { id: 5, title: 'TypeScript Deep Dive', duration: '5h', rating: 4.8, price: 55, learners: '4.6k', lessons: 32, level: 'Advanced', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', icon: '📘' },
  { id: 6, title: 'Next.js 15 Complete Guide', duration: '6h', rating: 4.9, price: 65, learners: '2.9k', lessons: 28, level: 'Intermediate', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', icon: '🚀' },
];

export const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState<number | null>(null);
  const [purchased, setPurchased] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const handlePurchase = (id: number) => {
    setProcessing(id);
    setTimeout(() => {
      setProcessing(null);
      setPurchased(prev => [...prev, id]);
      setTimeout(() => navigate(`/learning-center/${id}`), 800);
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="wallet-page marketplace-page-root">
        <div className="marketplace-section">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="marketplace-header-container"
          >
            <div className="marketplace-header-flex">
              <motion.div
                className="marketplace-icon-wrapper"
                whileHover={{ rotate: 5, scale: 1.05 }}
              >
                <ShoppingBag size={24} color="white" />
              </motion.div>
              <div>
                <h2 className="marketplace-title">Skill Development Marketplace</h2>
                <p className="marketplace-subtitle">Premium courses curated by industry experts</p>
              </div>
            </div>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="marketplace-search-filter"
          >
            <div className="marketplace-search-container">
              <Search size={18} className="marketplace-search-icon" />
              <input 
                type="text"
                placeholder="Search courses..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="marketplace-search-input"
              />
            </div>
            <GlassButton variant="secondary" icon={<Filter size={16} />} className="marketplace-filter-btn">
              Filters
            </GlassButton>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="marketplace-stats-bar"
          >
            {[
              { icon: <ShoppingBag size={16} />, label: '48 Courses', color: 'var(--accent-azure)' },
              { icon: <Users size={16} />, label: '32k+ Learners', color: '#10b981' },
              { icon: <Star size={16} />, label: '4.8 Avg Rating', color: 'var(--accent-gold)' },
              { icon: <Award size={16} />, label: 'Certificates', color: '#a78bfa' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="marketplace-stat-badge"
                style={{ 
                  background: `${stat.color}10`, color: stat.color,
                }}
              >
                {stat.icon} {stat.label}
              </motion.div>
            ))}
          </motion.div>

          {/* Course Grid */}
          <motion.div 
            className="course-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {courses
              .filter(c => c.title.toLowerCase().includes(searchValue.toLowerCase()))
              .map(course => (
              <motion.div key={course.id} variants={cardVariants}>
                <GlassCard className="course-card marketplace-course-card">
                  {/* Course Thumbnail */}
                  <div className="marketplace-course-thumb" style={{ background: course.gradient }}>
                    <div className="marketplace-course-level">
                      {course.level}
                    </div>
                    <div className="marketplace-course-emoji">
                      {course.icon}
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="marketplace-course-play"
                    >
                      <Play size={16} color="white" className="marketplace-course-play-icon" />
                    </motion.div>
                  </div>
                  
                  <div className="marketplace-course-content">
                    <h3 className="marketplace-course-title">{course.title}</h3>
                    <div className="marketplace-course-meta">
                      <span className="marketplace-course-meta-item">
                        <Clock size={12} /> {course.duration}
                      </span>
                      <span className="marketplace-course-meta-item">
                        <Star size={12} className="marketplace-course-star" /> {course.rating}
                      </span>
                      <span className="marketplace-course-meta-item">
                        <Users size={12} /> {course.learners}
                      </span>
                    </div>
                    
                    <div className="marketplace-course-footer">
                      <span className="marketplace-course-lessons">{course.lessons} lessons</span>
                      <span className="marketplace-course-price">${course.price}</span>
                    </div>
                    
                    <GlassButton 
                      variant="primary" 
                      className="marketplace-course-buy-btn"
                      onClick={() => handlePurchase(course.id)}
                      disabled={processing === course.id || purchased.includes(course.id)}
                    >
                      <AnimatePresence mode="wait">
                        {processing === course.id ? (
                          <motion.span 
                            key="processing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="marketplace-processing-state"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                              className="marketplace-processing-spinner"
                            />
                            Processing...
                          </motion.span>
                        ) : purchased.includes(course.id) ? (
                          <motion.span 
                            key="purchased"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="marketplace-purchased-state"
                          >
                            ✓ Purchased — Open
                          </motion.span>
                        ) : (
                          <motion.span key="buy" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            Purchase with Wallet
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </GlassButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};
