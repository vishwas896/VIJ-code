'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Building2, User, Image as ImageIcon, Briefcase, 
  CheckCircle2, TrendingUp, ArrowRight, ArrowLeft, UploadCloud, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import './RecruiterOnboarding.css';

const steps = [
  { id: 1, title: 'Role', icon: User },
  { id: 2, title: 'Personal', icon: User },
  { id: 3, title: 'Company', icon: Building2 },
  { id: 4, title: 'Branding', icon: ImageIcon },
  { id: 5, title: 'Operations', icon: Briefcase },
  { id: 6, title: 'Review', icon: CheckCircle2 },
  { id: 7, title: 'Projections', icon: TrendingUp },
];

export default function RecruiterOnboarding() {
  const router = useRouter();
  const { updateProfile, completeOnboarding } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    personalName: '',
    personalTitle: '',
    companyName: '',
    workEmail: '',
    companyWebsite: '',
    companySize: '',
    hqLocation: '',
    logoUploaded: false,
    bannerUploaded: false,
    hrContact: '',
    policiesUrl: '',
    hiringEstimate: '',
    hiringLevels: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(curr => curr + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const handleComplete = () => {
    setLoading(true);
    // Simulate API call to save all data
    setTimeout(() => {
      // Mark as recruiter
      updateProfile({ role: 'recruiter', currentCompany: formData.companyName, roleTitle: formData.personalTitle });
      completeOnboarding();
      router.push('/home');
    }, 1500);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="ro-title">Welcome to VIJ Recruiter Access</h2>
            <p className="ro-subtitle">You are signing up to build your company's talent pipeline. Let's get you verified and set up.</p>
            <div className="ro-form-group" style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <ShieldCheck size={28} style={{ color: '#3b82f6', flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: '0 0 8px', color: '#1e293b' }}>Verified Recruiter Account</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
                    This workflow will establish your personal recruiter profile and register your company on the VIJ platform. You will be able to manage candidate pools, set hiring projections, and maintain your company brand page.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="ro-title">Personal Profile</h2>
            <p className="ro-subtitle">Let candidates know who they are talking to.</p>
            <div className="ro-form-group">
              <label className="ro-label">Full Name</label>
              <input type="text" name="personalName" className="ro-input" placeholder="e.g. Sarah Chen" value={formData.personalName} onChange={handleChange} />
            </div>
            <div className="ro-form-group">
              <label className="ro-label">Job Title / Role</label>
              <input type="text" name="personalTitle" className="ro-input" placeholder="e.g. Senior Technical Recruiter" value={formData.personalTitle} onChange={handleChange} />
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="ro-title">Company Verification</h2>
            <p className="ro-subtitle">Register your organization on VIJ.</p>
            <div className="ro-form-group">
              <label className="ro-label">Company Name</label>
              <input type="text" name="companyName" className="ro-input" placeholder="e.g. Acme Corp" value={formData.companyName} onChange={handleChange} />
            </div>
            <div className="ro-form-group">
              <label className="ro-label">Official Work Email</label>
              <input type="email" name="workEmail" className="ro-input" placeholder="sarah@acmecorp.com" value={formData.workEmail} onChange={handleChange} />
            </div>
            <div className="ro-form-group">
              <label className="ro-label">Company Website</label>
              <input type="url" name="companyWebsite" className="ro-input" placeholder="https://acmecorp.com" value={formData.companyWebsite} onChange={handleChange} />
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="ro-title">Brand Identity</h2>
            <p className="ro-subtitle">Personalize your company page aesthetics.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="ro-form-group">
                <label className="ro-label">Company Logo</label>
                <div 
                  className="ro-upload-area" 
                  onClick={() => setFormData(f => ({ ...f, logoUploaded: true }))}
                  style={formData.logoUploaded ? { borderColor: '#22c55e', background: 'rgba(34, 197, 94, 0.05)' } : {}}
                >
                  {formData.logoUploaded ? <CheckCircle2 className="ro-upload-icon" style={{ color: '#22c55e' }} /> : <UploadCloud className="ro-upload-icon" />}
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{formData.logoUploaded ? 'Logo Uploaded' : 'Upload Logo'}</span>
                </div>
              </div>
              <div className="ro-form-group">
                <label className="ro-label">Cover Banner</label>
                <div 
                  className="ro-upload-area"
                  onClick={() => setFormData(f => ({ ...f, bannerUploaded: true }))}
                  style={formData.bannerUploaded ? { borderColor: '#22c55e', background: 'rgba(34, 197, 94, 0.05)' } : {}}
                >
                  {formData.bannerUploaded ? <CheckCircle2 className="ro-upload-icon" style={{ color: '#22c55e' }} /> : <UploadCloud className="ro-upload-icon" />}
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>{formData.bannerUploaded ? 'Banner Uploaded' : 'Upload Banner'}</span>
                </div>
              </div>
            </div>
            <div className="ro-form-group">
              <label className="ro-label">HQ Location / Branches</label>
              <input type="text" name="hqLocation" className="ro-input" placeholder="e.g. San Francisco, CA (HQ), London, UK" value={formData.hqLocation} onChange={handleChange} />
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="ro-title">Operational Details</h2>
            <p className="ro-subtitle">Give candidates insight into your company structure.</p>
            <div className="ro-form-group">
              <label className="ro-label">Total Employees</label>
              <select name="companySize" className="ro-select" value={formData.companySize} onChange={handleChange}>
                <option value="">Select size</option>
                <option value="1-10">1-10 (Startup)</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-1000">201-1000</option>
                <option value="1000+">1000+ (Enterprise)</option>
              </select>
            </div>
            <div className="ro-form-group">
              <label className="ro-label">HR / Third Party Contact</label>
              <input type="text" name="hrContact" className="ro-input" placeholder="hr@acmecorp.com or Agency Name" value={formData.hrContact} onChange={handleChange} />
            </div>
            <div className="ro-form-group">
              <label className="ro-label">HR Policies & T&C Link</label>
              <input type="url" name="policiesUrl" className="ro-input" placeholder="https://acmecorp.com/careers/policies" value={formData.policiesUrl} onChange={handleChange} />
            </div>
          </motion.div>
        );
      case 6:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="ro-title">Review & Confirm</h2>
            <p className="ro-subtitle">Verify your details before proceeding to hiring projections.</p>
            <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '16px', display: 'grid', gap: '16px', fontSize: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                <strong style={{ color: 'var(--text-tertiary)' }}>Recruiter:</strong>
                <span>{formData.personalName || 'N/A'} ({formData.personalTitle || 'N/A'})</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                <strong style={{ color: 'var(--text-tertiary)' }}>Company:</strong>
                <span>{formData.companyName || 'N/A'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                <strong style={{ color: 'var(--text-tertiary)' }}>Email:</strong>
                <span>{formData.workEmail || 'N/A'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                <strong style={{ color: 'var(--text-tertiary)' }}>Location:</strong>
                <span>{formData.hqLocation || 'N/A'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                <strong style={{ color: 'var(--text-tertiary)' }}>Size:</strong>
                <span>{formData.companySize || 'N/A'}</span>
              </div>
            </div>
          </motion.div>
        );
      case 7:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="ro-title">Hiring Projections</h2>
            <p className="ro-subtitle">Help VIJ algorithms route the right talent to your dashboard.</p>
            <div className="ro-form-group">
              <label className="ro-label">Estimated Candidates Required (Next 6 Months)</label>
              <input type="number" name="hiringEstimate" className="ro-input" placeholder="e.g. 15" value={formData.hiringEstimate} onChange={handleChange} />
            </div>
            <div className="ro-form-group">
              <label className="ro-label">Target Levels & Ranks (Optional)</label>
              <textarea name="hiringLevels" className="ro-textarea" placeholder="e.g. Mid-Level Engineers (L3/L4), 2 Senior Designers" value={formData.hiringLevels} onChange={handleChange} />
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ro-page">
      <div className="ro-container">
        
        {/* Stepper Header */}
        <div className="ro-stepper">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={`ro-step-item ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
            >
              <div className="ro-step-circle">
                {currentStep > step.id ? <CheckCircle2 size={16} /> : step.id}
              </div>
              <div className="ro-step-label">{step.title}</div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="ro-content">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="ro-footer">
          <button 
            className="ro-btn outline" 
            onClick={handleBack} 
            disabled={currentStep === 1 || loading}
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <button 
            className="ro-btn primary" 
            onClick={handleNext}
            disabled={loading}
          >
            {loading ? 'Processing...' : currentStep === 7 ? 'Complete Setup' : 'Continue'}
            {!loading && currentStep < 7 && <ArrowRight size={16} />}
          </button>
        </div>

      </div>
    </div>
  );
}
