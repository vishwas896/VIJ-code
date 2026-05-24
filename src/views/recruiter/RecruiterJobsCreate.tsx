'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PageTransition } from '../../components/PageTransition';
import { GlassCard } from '../../components/GlassCard';
import { GlassButton } from '../../components/GlassButton';
import { Plus, Trash2, ShieldAlert } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import './Recruiter.css';

export const RecruiterJobsCreate: React.FC = () => {
  const router = useRouter();
  const { formatCurrency } = useCurrency();
  const [isScanning, setIsScanning] = useState(false);
  const [parameters, setParameters] = useState([{ id: 1, skill: '', years: '' }]);

  const handleAddParam = () => {
    setParameters([...parameters, { id: Date.now(), skill: '', years: '' }]);
  };

  const handleRemoveParam = (id: number) => {
    setParameters(parameters.filter(p => p.id !== id));
  };

  const handleLaunch = () => {
    setIsScanning(true);
    setTimeout(() => {
      // Show success toast (in a real app, use a toast library)
      router.push('/recruiter/dashboard');
    }, 2000);
  };

  return (
    <PageTransition>
      <div className="recruiter-page-root configurator-layout">
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 className="recruiter-title">Match Engine Configurator</h1>
          <p className="recruiter-subtitle">Define strict parameters. VIJ will only return 100% matches.</p>
        </div>

        {/* 1. Core Details */}
        <GlassCard className="parameter-card">
          <h2 className="dashboard-section-title">1. Core Details</h2>
          <div className="recruiter-form-group">
            <label className="recruiter-label">Job Title</label>
            <input type="text" className="recruiter-input" placeholder="e.g. Senior Frontend Developer" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="recruiter-form-group">
              <label className="recruiter-label">Location</label>
              <input type="text" className="recruiter-input" placeholder="e.g. San Francisco, CA" />
            </div>
            <div className="recruiter-form-group">
              <label className="recruiter-label">Work Model</label>
              <select className="recruiter-input" defaultValue="">
                <option value="" disabled>Select Model</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">On-site</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* 2. Parameter Matrix */}
        <GlassCard className="parameter-card">
          <div className="dashboard-section-title">
            <h2>2. The Parameter Matrix</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 12px', borderRadius: '12px' }}>
              <ShieldAlert size={14} /> Strict Matching Enforced
            </div>
          </div>
          <p className="recruiter-subtitle">Candidates missing ANY of these parameters will be instantly filtered out.</p>

          {parameters.map((param, index) => (
            <motion.div 
              key={param.id} 
              className="parameter-row"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="recruiter-form-group" style={{ margin: 0, flex: 2 }}>
                {index === 0 && <label className="recruiter-label">Required Skill</label>}
                <input type="text" className="recruiter-input" placeholder="e.g. React.js" />
              </div>
              <div className="recruiter-form-group" style={{ margin: 0, flex: 1 }}>
                {index === 0 && <label className="recruiter-label">Min. Years</label>}
                <input type="number" className="recruiter-input" placeholder="e.g. 3" min="0" />
              </div>
              <button 
                onClick={() => handleRemoveParam(param.id)}
                style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '14px', borderRadius: '12px', cursor: 'pointer', height: '51px', display: 'flex', alignItems: 'center' }}
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}

          <GlassButton variant="secondary" onClick={handleAddParam} style={{ marginTop: '16px' }}>
            <Plus size={16} style={{ marginRight: '8px' }} /> Add Parameter
          </GlassButton>
        </GlassCard>

        {/* 3. Compensation & Interview */}
        <GlassCard className="parameter-card" style={{ marginBottom: '100px' }}>
          <h2 className="dashboard-section-title">3. Compensation & Availability</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="recruiter-form-group">
              <label className="recruiter-label">Salary Range</label>
              <input type="text" className="recruiter-input" placeholder={`${formatCurrency(120000, true)} - ${formatCurrency(150000, true)}`} />
            </div>
            <div className="recruiter-form-group">
              <label className="recruiter-label">Interview Time Slots (Comma separated)</label>
              <input type="text" className="recruiter-input" placeholder="Mon 10am, Tue 2pm" />
            </div>
          </div>
        </GlassCard>

        {/* Bottom Action Bar */}
        <div className="bottom-action-bar">
          <div>
            <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: 'var(--vij-text-main)' }}>Ready to Scan the Junction?</h4>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--vij-text-muted)' }}>Wallet balance will only be deducted upon successful hire.</p>
          </div>
          <GlassButton variant="primary" onClick={handleLaunch} disabled={isScanning} glowingEdge="azure">
            {isScanning ? 'Scanning Data...' : 'Launch Match Engine'}
          </GlassButton>
        </div>

      </div>
    </PageTransition>
  );
};

