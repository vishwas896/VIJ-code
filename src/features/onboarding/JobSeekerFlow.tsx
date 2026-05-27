'use client';
import React, { useState } from 'react';
import { ArrowLeft, Check, ArrowRight } from 'lucide-react';
import './OnboardingFlow.css';

interface FlowProps {
  onBack: () => void;
}

export const JobSeekerFlow: React.FC<FlowProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);

  return (
    <div className="onboarding-flow-container">
      <button className="back-btn" onClick={step === 1 ? onBack : () => setStep(step - 1)}>
        <ArrowLeft size={20} /> Back
      </button>

      <div className="flow-card glass-panel">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        {step === 1 && (
          <div className="step-content">
            <h2>What's your main goal right now?</h2>
            <p className="step-subtitle">This helps us personalize your AI career roadmap.</p>
            <div className="options-grid">
              {['Get a higher salary', 'Switch industries', 'Find remote work', 'Career growth'].map(goal => (
                <button key={goal} className="goal-btn" onClick={() => setStep(2)}>
                  {goal}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <h2>Let's build your foundation</h2>
            <p className="step-subtitle">Upload your resume to instantly build your profile.</p>
            <div className="upload-box">
              <p>Drag and drop your PDF resume here.</p>
              <button className="secondary-btn" onClick={() => setStep(3)}>Simulate Upload</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h2>Your Instant Roadmap</h2>
            <p className="step-subtitle">We've generated a 3-month plan to reach your goal.</p>
            <div className="roadmap-preview">
              <div className="roadmap-item"><Check size={16} color="var(--accent-azure)" /> Update skills to match Senior level</div>
              <div className="roadmap-item"><Check size={16} color="var(--accent-azure)" /> Complete Advanced System Design Challenge</div>
              <div className="roadmap-item"><Check size={16} color="var(--accent-azure)" /> Start applying to top matches</div>
            </div>
            <button className="primary-btn complete-btn" onClick={() => window.location.href='/seeker/dashboard'}>
              Go to Dashboard <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
