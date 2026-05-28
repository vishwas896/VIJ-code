'use client';
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Building2, MapPin } from 'lucide-react';
import './OnboardingFlow.css';

interface FlowProps {
  onBack: () => void;
}

export const RecruiterFlow: React.FC<FlowProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);

  return (
    <div className="onboarding-flow-container">
      <button className="back-btn" onClick={step === 1 ? onBack : () => setStep(step - 1)}>
        <ArrowLeft size={20} /> Back
      </button>

      <div className="flow-card glass-panel">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 2) * 100}%` }}></div>
        </div>

        {step === 1 && (
          <div className="step-content">
            <h2>Company & Role Setup</h2>
            <p className="step-subtitle">Let's set up your company profile to start attracting talent.</p>
            
            <div className="form-group">
              <label>Company Name</label>
              <div className="input-with-icon">
                <Building2 size={16} />
                <input type="text" placeholder="e.g. Acme Corp" />
              </div>
            </div>
            
            <div className="form-group">
              <label>Headquarters Location</label>
              <div className="input-with-icon">
                <MapPin size={16} />
                <input type="text" placeholder="e.g. San Francisco, CA" />
              </div>
            </div>

            <button className="primary-btn" onClick={() => setStep(2)}>
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h2>Dashboard Walkthrough</h2>
            <p className="step-subtitle">You are all set! Here is what you can do on your new dashboard.</p>
            
            <div className="walkthrough-features">
              <div className="feature-item">
                <span className="number-badge">1</span>
                <div>
                  <h4>Manage Jobs</h4>
                  <p>Create and edit your open positions.</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="number-badge">2</span>
                <div>
                  <h4>View Candidates</h4>
                  <p>Track applicants in your Kanban pipeline.</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="number-badge">3</span>
                <div>
                  <h4>Search Talent</h4>
                  <p>Use the Radar Map to headhunt top candidates.</p>
                </div>
              </div>
            </div>

            <button className="primary-btn complete-btn" onClick={() => window.location.href='/recruiter/dashboard'}>
              Enter Dashboard <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
