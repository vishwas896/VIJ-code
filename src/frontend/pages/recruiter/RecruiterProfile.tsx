import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../../components/PageTransition';
import { GlassCard } from '../../components/GlassCard';
import { GlassButton } from '../../components/GlassButton';
import { Building2, Image as ImageIcon, Save, ArrowLeft } from 'lucide-react';
import './Recruiter.css';

export const RecruiterProfile: React.FC = () => {
  const navigate = useNavigate();
  const [bio, setBio] = useState('Acme Corp is a leading innovator in cloud-based solutions, empowering businesses to scale seamlessly.');
  const [culture, setCulture] = useState('We believe in a remote-first, inclusive culture where every voice is heard and innovation is celebrated daily.');

  return (
    <PageTransition>
      <div className="recruiter-page-root">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 className="recruiter-title">Company Profile Manager</h1>
            <p className="recruiter-subtitle" style={{ margin: 0 }}>This is exactly what candidates see in the 3-Pane Interview Room.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <GlassButton variant="secondary" onClick={() => navigate('/recruiter/dashboard')}>
              <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Dashboard
            </GlassButton>
            <GlassButton variant="primary" glowingEdge="azure">
              <Save size={16} style={{ marginRight: '8px' }} /> Save Changes
            </GlassButton>
          </div>
        </div>

        <div className="profile-split">
          
          {/* ── Edit Form (Left) ── */}
          <div className="profile-editor">
            <GlassCard className="parameter-card">
              <h2 className="dashboard-section-title"><Building2 size={20} /> Core Identity</h2>
              
              <div className="recruiter-form-group">
                <label className="recruiter-label">Company Bio</label>
                <textarea 
                  className="recruiter-input" 
                  style={{ height: '100px', resize: 'vertical' }}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              <div className="recruiter-form-group">
                <label className="recruiter-label">Culture & Benefits</label>
                <textarea 
                  className="recruiter-input" 
                  style={{ height: '100px', resize: 'vertical' }}
                  value={culture}
                  onChange={(e) => setCulture(e.target.value)}
                />
              </div>
            </GlassCard>

            <GlassCard className="parameter-card">
              <h2 className="dashboard-section-title"><ImageIcon size={20} /> Media Gallery</h2>
              <p className="recruiter-subtitle">Upload photos of your office, team events, or product shots.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ height: '120px', background: 'rgba(255,255,255,0.4)', border: '2px dashed rgba(0,0,0,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--vij-text-muted)', cursor: 'pointer' }}>
                  + Add Image
                </div>
                <div style={{ height: '120px', background: 'rgba(255,255,255,0.4)', border: '2px dashed rgba(0,0,0,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--vij-text-muted)', cursor: 'pointer' }}>
                  + Add Image
                </div>
              </div>
            </GlassCard>
          </div>

          {/* ── Live Preview (Right) ── */}
          <div className="profile-preview">
            <div style={{ position: 'sticky', top: '100px' }}>
              <div className="dashboard-section-title">
                <h2 style={{ fontSize: '14px', color: 'var(--vij-text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Live Interview Preview</h2>
              </div>
              
              <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ height: '140px', background: 'linear-gradient(135deg, var(--accent-azure), #6366f1)' }} />
                <div style={{ padding: '24px', position: 'relative' }}>
                  <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '16px', position: 'absolute', top: '-40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, color: 'var(--vij-text-main)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    AC
                  </div>
                  
                  <div style={{ marginTop: '48px' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px', color: 'var(--vij-text-main)' }}>Acme Corp</h3>
                    <p style={{ margin: '0 0 24px', color: 'var(--vij-text-muted)', fontWeight: 500 }}>SaaS & Cloud Infrastructure • San Francisco</p>
                    
                    <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--vij-text-main)', marginBottom: '8px' }}>About Us</h4>
                    <p style={{ fontSize: '14px', color: 'var(--vij-text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
                      {bio}
                    </p>

                    <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--vij-text-main)', marginBottom: '8px' }}>Culture</h4>
                    <p style={{ fontSize: '14px', color: 'var(--vij-text-muted)', lineHeight: 1.6 }}>
                      {culture}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};
