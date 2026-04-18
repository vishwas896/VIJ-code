import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import './WalletMarketplace.css';

export const Marketplace: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="wallet-page" style={{ paddingTop: '16px' }}>
      <div className="marketplace-section">
        <h2 style={{ fontSize: '32px', marginBottom: '24px' }}>Skill Development Marketplace</h2>
        <div className="course-grid">
          {[
            { id: 1, title: 'Advanced React Architecture', duration: '4.5h', rating: 4.8, price: 50 },
            { id: 2, title: 'Framer Motion Masterclass', duration: '2h', rating: 4.9, price: 30 },
            { id: 3, title: 'WebRTC Fundamentals', duration: '3.2h', rating: 4.7, price: 45 },
            { id: 4, title: 'UI/UX with Glassmorphism', duration: '1h', rating: 4.9, price: 15 },
          ].map(course => (
            <GlassCard key={course.id} className="course-card">
              <div className="course-thumb"></div>
              <h3>{course.title}</h3>
              <div className="course-meta">
                <span>⏱ {course.duration}</span>
                <span>★ {course.rating}</span>
              </div>
              <GlassButton 
                variant="primary" 
                className="full-width mt-author"
                onClick={() => navigate(`/learning-center/${course.id}`)}
              >
                Purchase with Wallet (${course.price})
              </GlassButton>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};
