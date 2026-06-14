'use client';
import React, { useState } from 'react';
import { Briefcase, Code, FileText, Target, MapPin, Building, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './JobSeekerProfile.css';

export default function JobSeekerProfile() {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    currentCompany: user?.currentCompany || '',
    yearsExperience: user?.experience?.toString() || '',
    skills: user?.skills?.join(', ') || '',
    managementSkills: '',
    domainKnowledge: '',
    resumeLink: '',
    portfolioLink: '',
    expectedSalary: '',
    noticePeriod: '30',
    preferredLocation: '',
    remotePreference: 'hybrid'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateProfile({
      currentCompany: formData.currentCompany,
      experience: parseInt(formData.yearsExperience) || 0,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      hasPortfolio: !!formData.portfolioLink,
      // more fields can be added to User type
    });
  };

  if (!user || user.role !== 'job_seeker') return null;

  return (
    <div className="seeker-profile-root">
      
      <div className="jsp-banner">
        <div className="jsp-banner-text">
          <h1>Job Seeker Profile</h1>
          <p>Detail your professional experience, skills, and next career move.</p>
        </div>
        <Briefcase size={48} color="var(--accent-azure)" style={{ opacity: 0.8 }} />
      </div>

      <div className="jsp-section">
        <h2 className="jsp-section-title"><Building size={18} color="var(--accent-azure)" /> Professional Experience</h2>
        <div className="jsp-grid">
          <div className="jsp-field">
            <label className="jsp-label">Current / Most Recent Company</label>
            <input name="currentCompany" className="jsp-input" value={formData.currentCompany} onChange={handleChange} placeholder="Google, Freelance..." />
          </div>
          <div className="jsp-field">
            <label className="jsp-label">Total Years of Experience</label>
            <input type="number" name="yearsExperience" className="jsp-input" value={formData.yearsExperience} onChange={handleChange} placeholder="5" />
          </div>
        </div>
      </div>

      <div className="jsp-section">
        <h2 className="jsp-section-title"><Code size={18} color="var(--accent-azure)" /> Skills & Expertise</h2>
        <div className="jsp-grid">
          <div className="jsp-field full">
            <label className="sp-label">Technical Skills (comma separated)</label>
            <input name="skills" className="jsp-input" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, AWS..." />
          </div>
          <div className="jsp-field">
            <label className="jsp-label">Management / Soft Skills</label>
            <input name="managementSkills" className="jsp-input" value={formData.managementSkills} onChange={handleChange} placeholder="Agile, Team Lead..." />
          </div>
          <div className="jsp-field">
            <label className="jsp-label">Domain Knowledge</label>
            <input name="domainKnowledge" className="jsp-input" value={formData.domainKnowledge} onChange={handleChange} placeholder="Fintech, E-commerce..." />
          </div>
        </div>
      </div>

      <div className="jsp-section">
        <h2 className="jsp-section-title"><FileText size={18} color="var(--accent-azure)" /> Documents & Links</h2>
        <div className="jsp-grid">
          <div className="jsp-field">
            <label className="jsp-label"><LinkIcon size={14} style={{ display: 'inline', marginRight: '4px' }} /> Resume Link (Drive/Dropbox)</label>
            <input name="resumeLink" className="jsp-input" value={formData.resumeLink} onChange={handleChange} placeholder="https://..." />
          </div>
          <div className="jsp-field">
            <label className="jsp-label"><LinkIcon size={14} style={{ display: 'inline', marginRight: '4px' }} /> Portfolio / GitHub Link</label>
            <input name="portfolioLink" className="jsp-input" value={formData.portfolioLink} onChange={handleChange} placeholder="https://..." />
          </div>
        </div>
      </div>

      <div className="jsp-section">
        <h2 className="jsp-section-title"><Target size={18} color="var(--accent-azure)" /> Career Preferences</h2>
        <div className="jsp-grid">
          <div className="jsp-field">
            <label className="jsp-label">Expected Salary (LPA / Annual)</label>
            <input name="expectedSalary" className="jsp-input" value={formData.expectedSalary} onChange={handleChange} placeholder="₹20L - ₹25L" />
          </div>
          <div className="jsp-field">
            <label className="jsp-label">Notice Period</label>
            <select name="noticePeriod" className="jsp-input" value={formData.noticePeriod} onChange={handleChange}>
              <option value="0">Immediate Joiner</option>
              <option value="15">15 Days</option>
              <option value="30">30 Days</option>
              <option value="60">60 Days</option>
              <option value="90">90 Days</option>
            </select>
          </div>
          <div className="jsp-field">
            <label className="jsp-label"><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> Preferred Location</label>
            <input name="preferredLocation" className="jsp-input" value={formData.preferredLocation} onChange={handleChange} placeholder="Bangalore, Pune, Remote..." />
          </div>
          <div className="jsp-field">
            <label className="jsp-label">Work Mode Preference</label>
            <select name="remotePreference" className="jsp-input" value={formData.remotePreference} onChange={handleChange}>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
        </div>
      </div>

      <button className="jsp-save-btn" onClick={handleSave}>
        Save Professional Profile
      </button>

    </div>
  );
}
