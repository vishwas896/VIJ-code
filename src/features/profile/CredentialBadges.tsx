'use client';
import React from 'react';
import { Award, Star, Shield, ChevronRight } from 'lucide-react';
import './CredentialBadges.css';

const badges = [
  { id: 1, name: 'Top 5% Frontend', icon: <Star size={16} />, color: '#f59e0b', earned: true },
  { id: 2, name: 'Verified Identity', icon: <Shield size={16} />, color: '#10b981', earned: true },
  { id: 3, name: 'System Design Pro', icon: <Award size={16} />, color: '#8b5cf6', earned: false },
];

export const CredentialBadges: React.FC = () => {
  return (
    <div className="credential-badges-section glass-panel">
      <div className="section-header">
        <h3 className="section-title">Endorsements & Badges</h3>
        <button className="view-all-btn">Verify & Earn <ChevronRight size={14}/></button>
      </div>

      <div className="badges-container">
        {badges.map(badge => (
          <div key={badge.id} className={`badge-card ${badge.earned ? 'earned' : 'locked'}`}>
            <div 
              className="badge-icon-wrapper" 
              style={{ 
                backgroundColor: badge.earned ? `${badge.color}15` : 'rgba(0,0,0,0.05)', 
                color: badge.earned ? badge.color : '#999',
                borderColor: badge.earned ? `${badge.color}30` : 'transparent'
              }}
            >
              {badge.icon}
            </div>
            <div className="badge-info">
              <h4>{badge.name}</h4>
              <span>{badge.earned ? 'Verified' : 'Complete Challenge'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
