'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Hash, Users, BookOpen, Award, ArrowLeft, Star, Clock, TrendingUp } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { PageTransition } from '../components/PageTransition';
import './TagExplorer.css';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, type: 'spring' as const, stiffness: 300, damping: 24 }
  })
};

const roadmaps = [
  { id: 1, title: 'Fundamentals', desc: 'Build a rock-solid foundation with core concepts and best practices.', level: 'Beginner', duration: '4h', learners: '3.2k', rating: 4.8, gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { id: 2, title: 'Intermediate Patterns', desc: 'Master design patterns, state management, and architecture principles.', level: 'Intermediate', duration: '6h', learners: '2.1k', rating: 4.9, gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { id: 3, title: 'Advanced Techniques', desc: 'Push boundaries with advanced optimizations and performance tuning.', level: 'Advanced', duration: '8h', learners: '1.5k', rating: 4.7, gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  { id: 4, title: 'Real-World Projects', desc: 'Apply your skills to production-grade, industry-standard projects.', level: 'Expert', duration: '12h', learners: '890', rating: 4.9, gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  { id: 5, title: 'Interview Prep', desc: 'Ace technical interviews with curated problems and mock sessions.', level: 'All Levels', duration: '5h', learners: '5.4k', rating: 4.8, gradient: 'linear-gradient(135deg, #fa709a, #fee140)' },
  { id: 6, title: 'Expert Masterclass', desc: 'Deep video content from top industry professionals and thought leaders.', level: 'Expert', duration: '10h', learners: '720', rating: 5.0, gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
];

const stats = [
  { icon: <Users size={20} />, label: 'Learners', value: '12.4k' },
  { icon: <BookOpen size={20} />, label: 'Roadmaps', value: '340' },
  { icon: <Award size={20} />, label: 'Experts', value: '56' },
  { icon: <TrendingUp size={20} />, label: 'Growth', value: '+24%' },
];

export const TagExplorer: React.FC = () => {
  const { tagId } = useParams<{ tagId: string }>();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <PageTransition>
      <div className="tag-explorer-root">
        
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <GlassButton 
            variant="secondary" 
            onClick={() => router.back()}
            className="tag-explorer-back"
            icon={<ArrowLeft size={16} />}
          >
            Back to Jobs
          </GlassButton>
        </motion.div>

        {/* Tag Hero */}
        <motion.div 
          className="tag-explorer-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <motion.div 
            className="tag-explorer-icon-box"
            whileHover={{ scale: 1.02 }}
          >
            <Hash size={36} color="white" />
          </motion.div>
          <div>
            <h1 className="tag-explorer-title">
              {tagId || 'Tag'}
            </h1>
            <p className="tag-explorer-subtitle">
              Explore curated roadmaps, experts, and learning paths
            </p>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          className="tag-explorer-stats-bar"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={itemVariants}>
              <GlassCard className="tag-explorer-stat-card">
                <div className="tag-explorer-stat-icon">{s.icon}</div>
                <div>
                  <div className="tag-explorer-stat-value">{s.value}</div>
                  <div className="tag-explorer-stat-label">{s.label}</div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter Tabs */}
        <motion.div 
          className="tag-explorer-filter-tabs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map((f) => (
            <motion.button
              key={f}
              onClick={() => setActiveFilter(f)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`tag-explorer-filter-btn ${activeFilter === f ? 'active' : 'inactive'}`}
            >
              {f}
            </motion.button>
          ))}
        </motion.div>

        {/* Roadmap Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeFilter}
            className="tag-explorer-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {roadmaps
              .filter(r => activeFilter === 'All' || r.level === activeFilter)
              .map((roadmap) => (
              <motion.div key={roadmap.id} variants={itemVariants}>
                <GlassCard className="tag-explorer-card">
                  <div className="tag-explorer-card-header" style={{ background: roadmap.gradient }}>
                    <div className="tag-explorer-card-level">
                      {roadmap.level}
                    </div>
                  </div>
                  <div className="tag-explorer-card-body">
                    <h3 className="tag-explorer-card-title">
                      Mastering {tagId} — {roadmap.title}
                    </h3>
                    <p className="tag-explorer-card-desc">
                      {roadmap.desc}
                    </p>
                    <div className="tag-explorer-card-meta">
                      <span className="tag-explorer-card-meta-item">
                        <Clock size={14} /> {roadmap.duration}
                      </span>
                      <span className="tag-explorer-card-meta-item">
                        <Users size={14} /> {roadmap.learners}
                      </span>
                      <span className="tag-explorer-card-meta-item">
                        <Star size={14} className="tag-explorer-card-star" /> {roadmap.rating}
                      </span>
                    </div>
                    <GlassButton variant="primary" className="tag-explorer-card-action">View Roadmap</GlassButton>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};


