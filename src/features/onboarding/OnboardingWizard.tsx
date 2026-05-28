'use client';
import React, { useState } from 'react';
import { JobSeekerFlow } from './JobSeekerFlow';
import { RecruiterFlow } from './RecruiterFlow';
import './OnboardingWizard.css';
import { Briefcase, Building } from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'seeker' | 'recruiter' | null>(null);

  if (selectedRole === 'seeker') {
    return <JobSeekerFlow onBack={() => setSelectedRole(null)} />;
  }

  if (selectedRole === 'recruiter') {
    return <RecruiterFlow onBack={() => setSelectedRole(null)} />;
  }

  return (
    <div className="onboarding-wizard-container">
      <div className="onboarding-card glass-panel">
        <h1>Welcome to Project VIJ</h1>
        <p className="subtitle">Let's get your profile set up. What brings you here today?</p>
        
        <div className="role-selection-grid">
          <button className="role-card" onClick={() => setSelectedRole('seeker')}>
            <div className="icon-wrapper"><Briefcase size={32} /></div>
            <h3>I'm looking for a job</h3>
            <p>Build your social profile, track applications, and find your dream role.</p>
          </button>

          <button className="role-card" onClick={() => setSelectedRole('recruiter')}>
            <div className="icon-wrapper"><Building size={32} /></div>
            <h3>I'm hiring</h3>
            <p>Create a company profile, post jobs, and search for top talent.</p>
          </button>
        </div>
      </div>
    </div>
  );
};
