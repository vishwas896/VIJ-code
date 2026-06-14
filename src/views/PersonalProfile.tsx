/* eslint-disable */
'use client';
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, User, BadgeCheck, FileText, Heart, Home, Phone, Calendar, Users } from 'lucide-react';
import './PersonalProfile.css';

export default function PersonalProfile() {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: user?.personalProfile?.fullName || user?.name || '',
    username: user?.personalProfile?.username || '',
    bio: user?.personalProfile?.bio || user?.bio || '',
    dob: user?.personalProfile?.dob || '',
    phone: user?.personalProfile?.phone || '',
    address: user?.personalProfile?.address || '',
    maritalStatus: user?.personalProfile?.maritalStatus || 'single',
    dependency: user?.personalProfile?.dependency || '',
    loanEmi: user?.personalProfile?.loanEmi || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateProfile({
      name: formData.fullName,
      bio: formData.bio,
      personalProfile: {
        ...user?.personalProfile,
        ...formData
      }
    });
    // Visual feedback could be added here
  };

  if (!user) return null;

  return (
    <div className="profile-root">
      
      {/* Header Area */}
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar">
            <User size={40} />
          </div>
          <button className="profile-avatar-upload" title="Upload Photo">
            <Camera size={14} />
          </button>
        </div>
        
        <div className="profile-header-info">
          <h1 className="profile-name">{formData.fullName || 'Complete Your Profile'}</h1>
          <p className="profile-username">@{formData.username || 'username'}</p>
          <div className="profile-vij-id">
            <BadgeCheck size={16} />
            {user.vijId}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="profile-section">
        <h2 className="profile-section-title"><User size={18} color="var(--accent-azure)" /> Basic Information</h2>
        <div className="profile-grid">
          <div className="profile-field">
            <label className="profile-label">Full Name</label>
            <input name="fullName" className="profile-input" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
          </div>
          <div className="profile-field">
            <label className="profile-label">Username</label>
            <input name="username" className="profile-input" value={formData.username} onChange={handleChange} placeholder="johndoe" />
          </div>
          <div className="profile-field">
            <label className="profile-label">Date of Birth</label>
            <input type="date" name="dob" className="profile-input" value={formData.dob} onChange={handleChange} />
          </div>
          <div className="profile-field">
            <label className="profile-label">Phone Number</label>
            <input type="tel" name="phone" className="profile-input" value={formData.phone} onChange={handleChange} placeholder="+91 9876543210" />
          </div>
          <div className="profile-field full">
            <label className="profile-label">Short Bio</label>
            <textarea name="bio" className="profile-input profile-textarea" value={formData.bio} onChange={handleChange} placeholder="Tell us a bit about yourself..." />
          </div>
          <div className="profile-field full">
            <label className="profile-label">Address</label>
            <textarea name="address" className="profile-input" style={{ minHeight: '60px' }} value={formData.address} onChange={handleChange} placeholder="Complete address..." />
          </div>
        </div>
      </div>

      {/* Extended Information */}
      <div className="profile-section">
        <h2 className="profile-section-title"><FileText size={18} color="var(--accent-azure)" /> Extended Details</h2>
        <div className="profile-grid">
          <div className="profile-field">
            <label className="profile-label">Marital Status</label>
            <select name="maritalStatus" className="profile-input" value={formData.maritalStatus} onChange={handleChange}>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
          <div className="profile-field">
            <label className="profile-label">Dependency (e.g. Parents, Children)</label>
            <input name="dependency" className="profile-input" value={formData.dependency} onChange={handleChange} placeholder="2 dependents" />
          </div>
          <div className="profile-field full">
            <label className="profile-label">Active Loans / EMI Details</label>
            <input name="loanEmi" className="profile-input" value={formData.loanEmi} onChange={handleChange} placeholder="e.g. Education Loan, Car EMI..." />
          </div>
        </div>
      </div>

      <button className="profile-save-btn" onClick={handleSave}>
        Save Profile
      </button>

    </div>
  );
}

