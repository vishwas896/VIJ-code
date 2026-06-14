'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building, ShieldCheck, ArrowRight, Building2, CheckCircle2, Upload, FileText, UserCheck } from 'lucide-react';
import '../Onboarding.css';
import { useAuth, VerificationLevel } from '../../../../context/AuthContext';

export default function CompanySetupWizard() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  
  const [mode, setMode] = useState<'select' | 'search' | 'create' | 'verify_domain' | 'verify_business' | 'verify_manager'>('select');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create State
  const [companyData, setCompanyData] = useState({
    name: '', type: 'private', shortName: '', cin: '', gst: '',
    hqLocation: '', branchLocations: ''
  });

  const variants = {
    enter: { y: 20, opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  const completeSetup = (level: VerificationLevel) => {
    if (user) {
      updateProfile({
        verificationLevel: level,
        currentCompany: companyData.name || searchQuery || 'Acme Corp'
      });
    }
    router.push('/dashboard');
  };

  const renderSelectMode = () => (
    <div className="liquid-form-grid" style={{ gridTemplateColumns: '1fr', gap: '20px', marginTop: '20px' }}>
      <div className="role-card" onClick={() => setMode('search')}>
        <div className="role-card-icon"><Search size={28} /></div>
        <h3>Join Existing Company</h3>
        <p>Your company is already registered on VIJ? Search and request access.</p>
      </div>
      <div className="role-card" onClick={() => setMode('create')}>
        <div className="role-card-icon"><Building2 size={28} /></div>
        <h3>Register New Company</h3>
        <p>Be the first to register your company and become the admin.</p>
      </div>
    </div>
  );

  const renderSearchMode = () => (
    <div className="liquid-form-grid" style={{ gridTemplateColumns: '1fr' }}>
      <div className="liquid-form-group full-width">
        <label className="liquid-form-label">Search Company Name or CIN</label>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: '#64748b' }} />
          <input 
            className="liquid-input" 
            style={{ paddingLeft: '44px' }} 
            placeholder="e.g. Tata Consultancy Services" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
      </div>

      <div style={{ padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px', textAlign: 'center', marginTop: '20px' }}>
        <p style={{ fontSize: '14px', color: 'var(--vij-text-muted)' }}>Type to search the global registry...</p>
      </div>

      <div className="wizard-actions" style={{ marginTop: '20px' }}>
        <button className="btn-liquid-secondary" onClick={() => setMode('select')}>Back</button>
        <button className="btn-liquid-primary" disabled={!searchQuery} onClick={() => setMode('verify_domain')}>Request Access</button>
      </div>
    </div>
  );

  const renderCreateMode = () => (
    <div className="liquid-form-grid">
      <div className="liquid-form-group full-width">
        <label className="liquid-form-label">Legal Company Name</label>
        <input className="liquid-input" placeholder="Google LLC" value={companyData.name} onChange={e => setCompanyData({...companyData, name: e.target.value})} />
      </div>
      <div className="liquid-form-group">
        <label className="liquid-form-label">Company Type</label>
        <select className="liquid-input" value={companyData.type} onChange={e => setCompanyData({...companyData, type: e.target.value})}>
          <option value="private">Private Limited</option>
          <option value="public">Public Limited</option>
          <option value="llp">LLP</option>
        </select>
      </div>
      <div className="liquid-form-group">
        <label className="liquid-form-label">Short Name (Brand)</label>
        <input className="liquid-input" placeholder="Google" value={companyData.shortName} onChange={e => setCompanyData({...companyData, shortName: e.target.value})} />
      </div>
      <div className="liquid-form-group">
        <label className="liquid-form-label">CIN (Corporate ID)</label>
        <input className="liquid-input" placeholder="U72900MH2000PTC123456" value={companyData.cin} onChange={e => setCompanyData({...companyData, cin: e.target.value})} />
      </div>
      <div className="liquid-form-group">
        <label className="liquid-form-label">GST Number</label>
        <input className="liquid-input" placeholder="27XXXXX1234X1ZX" value={companyData.gst} onChange={e => setCompanyData({...companyData, gst: e.target.value})} />
      </div>
      <div className="liquid-form-group full-width">
        <label className="liquid-form-label">HQ Location</label>
        <input className="liquid-input" placeholder="City, State, Country" value={companyData.hqLocation} onChange={e => setCompanyData({...companyData, hqLocation: e.target.value})} />
      </div>
      <div className="liquid-form-group full-width">
        <label className="liquid-form-label">Branch Locations (Comma separated)</label>
        <input className="liquid-input" placeholder="Mumbai, Bangalore, New York" value={companyData.branchLocations} onChange={e => setCompanyData({...companyData, branchLocations: e.target.value})} />
      </div>

      <div className="wizard-actions full-width" style={{ marginTop: '20px' }}>
        <button className="btn-liquid-secondary" onClick={() => setMode('select')}>Back</button>
        <button className="btn-liquid-primary" onClick={() => setMode('verify_domain')}>Proceed to Verification</button>
      </div>
    </div>
  );

  const renderVerifyDomain = () => (
    <div className="liquid-form-grid" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
          <ShieldCheck size={40} />
        </div>
      </div>
      
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>Level 1: Professional Verification</h2>
      <p style={{ fontSize: '15px', color: 'var(--vij-text-muted)', marginBottom: '30px', maxWidth: '400px', margin: '0 auto 30px auto', lineHeight: '1.5' }}>
        Verify your work email address to prove your affiliation with {companyData.name || searchQuery || 'this company'}.
      </p>

      <div className="liquid-form-group full-width" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <input className="liquid-input" placeholder="yourname@company.com" type="email" style={{ textAlign: 'center' }} />
      </div>

      <div className="wizard-actions full-width" style={{ justifyContent: 'center', marginTop: '40px', gap: '16px' }}>
        <button className="btn-liquid-secondary" onClick={() => setMode(companyData.name ? 'create' : 'search')}>Back</button>
        <button className="btn-liquid-primary" onClick={() => setMode(searchQuery ? 'verify_manager' : 'verify_business')}>
          Verify Email & Continue
        </button>
      </div>
    </div>
  );

  const renderVerifyBusiness = () => (
    <div className="liquid-form-grid" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
          <FileText size={40} />
        </div>
      </div>
      
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>Level 2: Business Verification</h2>
      <p style={{ fontSize: '15px', color: 'var(--vij-text-muted)', marginBottom: '30px', maxWidth: '400px', margin: '0 auto 30px auto', lineHeight: '1.5' }}>
        Since you are registering a new company, please upload official incorporation documents (CIN / GST Certificate).
      </p>

      <div className="liquid-form-group full-width" style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ border: '2px dashed rgba(0,0,0,0.1)', padding: '40px', borderRadius: '16px', background: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
          <Upload size={32} style={{ margin: '0 auto 16px', color: '#8b5cf6' }} />
          <p style={{ margin: 0, fontWeight: 600, color: '#334155' }}>Click to upload PDF or Image</p>
        </div>
      </div>

      <div className="wizard-actions full-width" style={{ justifyContent: 'center', marginTop: '40px', gap: '16px' }}>
        <button className="btn-liquid-secondary" onClick={() => completeSetup(1)}>Skip for Now (Level 1)</button>
        <button className="btn-liquid-primary" onClick={() => completeSetup(3)}>
          Submit for Level 3 Verification
        </button>
      </div>
    </div>
  );

  const renderVerifyManager = () => (
    <div className="liquid-form-grid" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
          <UserCheck size={40} />
        </div>
      </div>
      
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>Level 2: Manager Verification</h2>
      <p style={{ fontSize: '15px', color: 'var(--vij-text-muted)', marginBottom: '30px', maxWidth: '400px', margin: '0 auto 30px auto', lineHeight: '1.5' }}>
        An access request has been sent to the company admin. Once approved, your account will be upgraded to Level 2.
      </p>

      <div className="wizard-actions full-width" style={{ justifyContent: 'center', marginTop: '40px' }}>
        <button className="btn-liquid-primary" onClick={() => completeSetup(1)}>
          Go to Dashboard (Level 1)
        </button>
      </div>
    </div>
  );

  return (
    <div className="liquid-wizard-root">
      <div className="liquid-wizard-bg-blobs" />

      <div className="liquid-glass-container" style={{ maxWidth: '700px' }}>
        
        <div className="wizard-header" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '16px', color: 'var(--accent-azure)' }}>
              <Building size={28} />
            </div>
          </div>
          <h1>Corporate Setup</h1>
          <p>Link your professional identity to your company.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ minHeight: '350px' }}
          >
            {mode === 'select' && renderSelectMode()}
            {mode === 'search' && renderSearchMode()}
            {mode === 'create' && renderCreateMode()}
            {mode === 'verify_domain' && renderVerifyDomain()}
            {mode === 'verify_business' && renderVerifyBusiness()}
            {mode === 'verify_manager' && renderVerifyManager()}
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
