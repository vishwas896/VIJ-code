'use client';
import React from 'react';
import { ProfileHero } from './ProfileHero';
import { ProfileReels } from './ProfileReels';
import { PortfolioGrid } from './PortfolioGrid';
import { CredentialBadges } from './CredentialBadges';
import { useAuth } from '../../context/AuthContext';
import './UserProfile.css';

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="user-profile-layout">
      <ProfileHero user={user} />
      
      <div className="profile-bento-layout">
        <div className="main-column">
          <ProfileReels />
          <PortfolioGrid />
        </div>
        
        <div className="sidebar-column">
          <CredentialBadges />
          
          <div className="about-section glass-panel">
            <h3>About</h3>
            <p>
              {user?.bio || 'I am a passionate professional looking for the next big challenge. I love building intuitive user interfaces and architecting scalable frontends. When I am not coding, I am writing case studies.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
