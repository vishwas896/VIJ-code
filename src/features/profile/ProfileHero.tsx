'use client';
import React from 'react';
import { Camera, CheckCircle } from 'lucide-react';
import './ProfileHero.css';

interface ProfileHeroProps {
  user: any;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ user }) => {
  return (
    <div className="profile-hero-container glass-panel">
      <div className="profile-banner">
        <img src={user?.bannerUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop'} alt="Profile Banner" />
        <button className="edit-banner-btn"><Camera size={16} /></button>
      </div>
      <div className="profile-hero-content">
        <div className="avatar-section">
          <div className="avatar-wrapper">
            <img src={user?.avatarUrl || 'https://i.pravatar.cc/150?img=68'} alt={user?.name || 'User Avatar'} />
            <div className="status-ring online"></div>
          </div>
        </div>
        <div className="profile-info">
          <h1>{user?.name || 'Alex Rivera'} <CheckCircle size={20} className="verified-badge" /></h1>
          <p className="headline">{user?.headline || 'Senior Frontend Engineer | UI/UX Enthusiast'}</p>
          <p className="location">{user?.location || 'San Francisco, CA'}</p>
          
          <div className="career-progress">
            <div className="progress-labels">
              <span>Career Progress</span>
              <span>80% to Staff Engineer</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
