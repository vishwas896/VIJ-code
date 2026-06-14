'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageTransition } from '../../components/common/PageTransition';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';
import { Building2, Save, ArrowLeft, Mail, Phone, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Recruiter.css';

export const RecruiterProfile: React.FC = () => {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    designation: user?.roleTitle || '',
    department: '',
    company: user?.currentCompany || '',
    workEmail: user?.email || '',
    businessContact: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateProfile({
      roleTitle: formData.designation,
      currentCompany: formData.company,
      email: formData.workEmail,
    });
  };

  if (!user || user.role !== 'recruiter') return null;

  return (
    <PageTransition>
      <div className="recruiter-page-root">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 className="recruiter-title">Recruiter Professional Profile</h1>
            <p className="recruiter-subtitle" style={{ margin: 0 }}>Your professional identity and verified company affiliation.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <GlassButton variant="secondary" onClick={() => router.push('/recruiter/dashboard')}>
              <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Dashboard
            </GlassButton>
            <GlassButton variant="primary" glowingEdge="azure" onClick={handleSave}>
              <Save size={16} style={{ marginRight: '8px' }} /> Save Changes
            </GlassButton>
          </div>
        </div>

        <div className="profile-split" style={{ gridTemplateColumns: '1fr', maxWidth: '800px', margin: '0 auto' }}>
          
          <GlassCard className="parameter-card">
            <h2 className="dashboard-section-title"><Building2 size={20} /> Professional Details</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="recruiter-form-group">
                <label className="recruiter-label">Current Company</label>
                <input 
                  name="company"
                  className="recruiter-input" 
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme Corp"
                />
              </div>

              <div className="recruiter-form-group">
                <label className="recruiter-label">Designation / Title</label>
                <input 
                  name="designation"
                  className="recruiter-input" 
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="Senior Talent Acquisition"
                />
              </div>

              <div className="recruiter-form-group">
                <label className="recruiter-label">Department</label>
                <input 
                  name="department"
                  className="recruiter-input" 
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Human Resources"
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="parameter-card" style={{ marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="dashboard-section-title" style={{ margin: 0 }}><Shield size={20} /> Business Contact & Verification</h2>
              <span style={{ fontSize: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '99px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Shield size={12} /> Level {user.verificationLevel || 0} Verified
              </span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="recruiter-form-group">
                <label className="recruiter-label"><Mail size={14} style={{ display: 'inline', marginRight: '4px' }}/> Work Email (must match company domain)</label>
                <input 
                  name="workEmail"
                  type="email"
                  className="recruiter-input" 
                  value={formData.workEmail}
                  onChange={handleChange}
                  placeholder="name@company.com"
                />
              </div>

              <div className="recruiter-form-group">
                <label className="recruiter-label"><Phone size={14} style={{ display: 'inline', marginRight: '4px' }}/> Business Contact Number</label>
                <input 
                  name="businessContact"
                  type="tel"
                  className="recruiter-input" 
                  value={formData.businessContact}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </GlassCard>

        </div>
      </div>
    </PageTransition>
  );
};
