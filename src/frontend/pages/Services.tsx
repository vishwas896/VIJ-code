import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Star, Clock, Users, 
  Search, BookOpen, 
  Target, Zap, Sparkles
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { PageTransition } from '../components/PageTransition';
import { useAuth } from '../context/AuthContext';
import './Services.css';

const categories = [
  { id: 'courses', label: 'Online Courses', icon: <BookOpen size={16} /> },
  { id: 'skills', label: 'Skill Assessments', icon: <Target size={16} /> },
  { id: 'services', label: 'Premium Services', icon: <Sparkles size={16} /> },
];

const items = [
  // COURSES
  { id: 'c1', type: 'courses', title: 'Advanced React Architecture', duration: '4.5h', rating: 4.8, price: 50, learners: '3.2k', level: 'Advanced', gradient: 'linear-gradient(135deg, #6366f1, #a855f7)', icon: '⚛️' },
  { id: 'c2', type: 'courses', title: 'Next.js 15 Deep Dive', duration: '6h', rating: 4.9, price: 65, learners: '2.9k', level: 'Intermediate', gradient: 'linear-gradient(135deg, #0ea5e9, #22c55e)', icon: '🚀' },
  { id: 'c3', type: 'courses', title: 'Framer Motion 101', duration: '2h', rating: 4.9, price: 30, learners: '5.1k', level: 'Beginner', gradient: 'linear-gradient(135deg, #f43f5e, #fb923c)', icon: '🎭' },
  
  // SKILLS
  { id: 's1', type: 'skills', title: 'AWS Cloud Practitioner Prep', duration: 'Self-paced', rating: 4.7, price: 40, learners: '1.2k', level: 'Professional', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', icon: '☁️' },
  { id: 's2', type: 'skills', title: 'Cybersecurity Assessment', duration: '90 min', rating: 4.6, price: 25, learners: '800+', level: 'Critical', gradient: 'linear-gradient(135deg, #ef4444, #991b1b)', icon: '🛡️' },
  { id: 's3', type: 'skills', title: 'Data Structures Mastery', duration: '3 weeks', rating: 4.8, price: 55, learners: '2.2k', level: 'Advanced', gradient: 'linear-gradient(135deg, #8b5cf6, #4c1d95)', icon: '📊' },

  // SERVICES
  { id: 'v1', type: 'services', title: 'Expert CV Review', duration: '24h Delivery', rating: 5.0, price: 75, learners: '500+', level: 'Premium', gradient: 'linear-gradient(135deg, #ec4899, #be185d)', icon: '📝' },
  { id: 'v2', type: 'services', title: '1-on-1 Career Mentoring', duration: '60 min session', rating: 4.9, price: 120, learners: '300+', level: 'Expert', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)', icon: '🤝' },
  { id: 'v3', type: 'services', title: 'LinkedIn Profile Audit', duration: '48h Delivery', rating: 4.7, price: 50, learners: '1.5k+', level: 'Essential', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', icon: '🔗' },
];

export const Services: React.FC = () => {
  const navigate = useNavigate();
  const { user, purchaseItem, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [searchValue, setSearchValue] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  const handlePurchase = (id: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setProcessing(id);
    setTimeout(() => {
      purchaseItem(id);
      setProcessing(null);
      // Optional: redirect to dashboard after purchase
    }, 1500);
  };

  const filteredItems = items.filter(item => 
    item.type === activeTab && 
    item.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const isPurchased = (id: string) => user?.purchasedItems?.includes(id);

  return (
    <PageTransition>
      <div className="services-page">
        <header className="services-header">
          <div className="header-content">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="services-badge">VIJ MARKETPLACE</div>
              <h1>Ecosystem Services</h1>
              <p>Premium courses, skill validations, and professional services tailored for your growth.</p>
            </motion.div>
            
            <div className="search-box">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search services, skills, or courses..." 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          <div className="services-tabs">
            {categories.map((cat) => (
              <button 
                key={cat.id}
                className={`tab-btn ${activeTab === cat.id ? 'active' : ''}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.icon}
                <span>{cat.label}</span>
                {activeTab === cat.id && <motion.div layoutId="tab-underline" className="tab-underline" />}
              </button>
            ))}
          </div>
        </header>

        <main className="services-grid">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              className="items-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {filteredItems.map((item) => (
                <GlassCard key={item.id} className="service-card" style={{ padding: 0 }}>
                  <div className="item-preview" style={{ background: item.gradient }}>
                    <div className="item-icon-large">{item.icon}</div>
                    <div className="item-level-tag">{item.level}</div>
                  </div>
                  
                  <div className="item-details">
                    <h3>{item.title}</h3>
                    <div className="item-meta">
                      <span><Clock size={12} /> {item.duration}</span>
                      <span><Star size={12} style={{ color: '#f59e0b' }} /> {item.rating}</span>
                      <span><Users size={12} /> {item.learners}</span>
                    </div>
                    
                    <div className="item-footer">
                      <div className="item-price">${item.price}</div>
                      <GlassButton 
                        variant={isPurchased(item.id) ? 'secondary' : 'primary'}
                        className="buy-btn"
                        disabled={processing === item.id}
                        onClick={() => handlePurchase(item.id)}
                      >
                        {processing === item.id ? (
                          <div className="spinner-small" />
                        ) : isPurchased(item.id) ? (
                          'Already Owned'
                        ) : (
                          'Purchase Now'
                        )}
                      </GlassButton>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="services-footer">
          <GlassCard className="help-card" glowingEdge="azure">
            <div className="help-content">
              <Zap size={24} className="help-icon" />
              <div>
                <h4>Need a custom package?</h4>
                <p>Enterprise training and team certifications are available. Contact our support team for a dedicated roadmap.</p>
              </div>
              <GlassButton variant="secondary">Contact Support</GlassButton>
            </div>
          </GlassCard>
        </footer>
      </div>
    </PageTransition>
  );
};
