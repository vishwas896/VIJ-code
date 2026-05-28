'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  User, Shield, Bell, Lock, Palette, Briefcase, Zap, 
  Globe, Sparkles, Laptop, LogOut, Upload, Share2, 
  RotateCcw, Layout, Moon, Sun, CheckCircle, FileText, 
  CreditCard, Accessibility, Link2, Trash2, FileDown, 
  RefreshCw, Mail, Terminal, SlidersHorizontal, CheckSquare
} from 'lucide-react';
import { PageTransition } from '../components/PageTransition';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { useTheme, THEME_PRESETS, PRESET_WALLPAPERS } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import './Settings.css';

type Role = 'seeker' | 'recruiter';
type Tab = 
  | 'account' 
  | 'profile' 
  | 'career' 
  | 'resume' 
  | 'privacy' 
  | 'notifications' 
  | 'appearance' 
  | 'dashboard' 
  | 'security' 
  | 'verification' 
  | 'applications' 
  | 'ai' 
  | 'accessibility' 
  | 'connected' 
  | 'billing' 
  | 'data' 
  | 'language';

// --- Shared Components ---

const ToggleSwitch = ({ active, onChange }: { active: boolean, onChange: () => void }) => (
  <div className={`toggle-switch ${active ? 'on' : ''}`} onClick={onChange}>
    <div className="toggle-handle" />
  </div>
);

const SettingRow = ({ label, desc, children }: { label: string, desc?: string, children: React.ReactNode }) => (
  <div className="setting-row">
    <div className="setting-info">
      <div className="setting-label">{label}</div>
      {desc && <div className="setting-desc">{desc}</div>}
    </div>
    <div className="setting-control">{children}</div>
  </div>
);

// --- 18 Settings Modules ---

export const Settings: React.FC = () => {
  const { tabId } = useParams<{ tabId: string }>();
  const router = useRouter();
  const activeTab = (tabId || 'account') as Tab;

  const { preferences, updatePreferences, applyPresetTheme, resetPreferences } = useTheme();
  const { user, updateProfile, logout } = useAuth();
  
  // Dynamic Role toggle for preview testing
  const [role, setRole] = useState<Role>(user?.role || 'seeker');

  // Save indicator status
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('saved');

  // Custom configuration state stored in LocalStorage
  const [settings, setSettings] = useState({
    // Account
    email: user?.email || 'user@example.com',
    phone: '+91 98765 43210',
    username: '@vishwas_s',
    verifiedEmail: true,
    verifiedPhone: false,
    
    // Career Preferences
    salaryMin: 1200000,
    salaryMax: 3600000,
    preferredLocations: ['Gurgaon', 'Bangalore', 'Remote'],
    workType: 'remote',
    jobType: 'full-time',
    availability: 'immediate',

    // Resume & Portfolio
    resumes: [
      { id: 'res-1', name: 'Vishwas_Resume_Frontend.pdf', uploadedAt: 'May 12, 2026', size: '240 KB', isDefault: true }
    ],
    portfolioUrl: 'https://vishwas.dev',
    githubUrl: 'https://github.com/vishwas',
    linkedinUrl: 'https://linkedin.com/in/vishwas',
    certifications: ['AWS Certified Developer', 'Google UX Design Professional Certificate'],

    // Privacy Settings
    publicProfile: true,
    recruiterVisibility: true,
    hideCurrentCompany: false,
    anonymousApplications: false,
    searchEngineIndexing: true,

    // Notification settings
    emailJobAlerts: true,
    emailRecruiterMsgs: true,
    emailAppUpdates: true,
    smsSecurityAlerts: true,
    smsJobAlerts: false,
    pushAppUpdates: true,
    pushRecruiterMsgs: true,

    // Security Settings
    twoFactorEnabled: false,
    sessions: [
      { id: 'sess-1', device: 'Windows PC (Chrome)', location: 'Gurgaon, India', ip: '192.168.1.45', lastActive: 'Active Now', isCurrent: true },
      { id: 'sess-2', device: 'iPhone 15 Pro (App)', location: 'Delhi, India', ip: '103.45.12.82', lastActive: '2 days ago', isCurrent: false }
    ],
    logs: [
      { id: 'log-1', timestamp: '2026-05-21 14:12', event: 'Password reset completed', ip: '192.168.1.45' },
      { id: 'log-2', timestamp: '2026-05-20 09:30', event: '2FA preference updated', ip: '192.168.1.45' }
    ],

    // Dashboard Customization
    showJobAnalytics: true,
    showProfileViews: true,
    showApplications: true,
    showAISuggestions: true,
    showIndustryTrends: true,

    // Verification Settings
    emailVerified: true,
    phoneVerified: false,
    identityVerified: false,
    companyVerified: false,
    skillsVerified: ['React', 'TypeScript'],

    // Application defaults
    defaultResumeId: 'res-1',
    autoFillEnabled: true,
    coverLetterTemplate: 'Hi hiring team,\n\nI am excited to apply for the Frontend Engineer position. With 4+ years of development experience in React & TypeScript, I look forward to contributing to your vision.\n\nBest,\nVishwas',
    interviewAvailability: 'Mon-Fri, 2 PM - 6 PM IST',

    // AI Settings
    aiJobRecs: true,
    aiRoadmaps: true,
    aiProfileOptimization: true,

    // Accessibility
    textScale: 'standard',
    highContrast: false,
    reducedMotion: false,

    // Linked accounts
    googleConnected: true,
    linkedinConnected: false,
    githubConnected: true,

    // Billing Setup
    subscriptionPlan: 'pro',
    paymentMethods: [
      { id: 'pm-1', brand: 'Visa', last4: '4242', exp: '12/28' }
    ],
    invoices: [
      { id: 'inv-01', date: 'May 10, 2026', amount: 999, status: 'paid' },
      { id: 'inv-02', date: 'April 10, 2026', amount: 999, status: 'paid' }
    ],

    // Data Consent
    consentMarketing: true,
    consentAnalytics: true,

    // Region preferences
    language: 'en',
    timezone: 'Asia/Kolkata',
    currency: 'INR'
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`vij_system_settings_${user?.id || 'guest'}`);
      if (saved) {
        try {
          setSettings(JSON.parse(saved));
        } catch (e) {
          // Fallback default structure
        }
      }
    }
  }, [user]);

  // Save settings with optimistic UI update state
  const saveSettings = (updated: any) => {
    setSaveStatus('saving');
    setSettings(updated);
    localStorage.setItem(`vij_system_settings_${user?.id || 'guest'}`, JSON.stringify(updated));
    
    // Also save widgets customization under direct dashboard key for layout bindings
    localStorage.setItem(`vij_dashboard_customization_${user?.id || 'guest'}`, JSON.stringify({
      showJobAnalytics: updated.showJobAnalytics,
      showProfileViews: updated.showProfileViews,
      showApplications: updated.showApplications,
      showAISuggestions: updated.showAISuggestions,
      showIndustryTrends: updated.showIndustryTrends
    }));

    setTimeout(() => {
      setSaveStatus('saved');
    }, 500);
  };

  const handleFieldChange = (key: string, value: any) => {
    const updated = { ...settings, [key]: value };
    saveSettings(updated);
  };

  // Sync profile details back to the global auth context
  const handleProfileChange = (key: string, value: any) => {
    if (user) {
      updateProfile({ [key]: value });
    }
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 500);
  };

  // Sidebar list data
  const baseNav = [
    { id: 'account', label: 'Account', icon: <User size={18} /> },
    { id: 'profile', label: 'Profile Identity', icon: <Briefcase size={18} /> },
    { id: 'career', label: 'Career Preferences', icon: <SlidersHorizontal size={18} /> },
    { id: 'resume', label: 'Resume & Portfolio', icon: <FileText size={18} /> },
    { id: 'privacy', label: 'Privacy & Visibility', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'appearance', label: 'Appearance & Themes', icon: <Palette size={18} /> },
    { id: 'dashboard', label: 'Dashboard Config', icon: <Layout size={18} /> },
    { id: 'security', label: 'Security & Sessions', icon: <Lock size={18} /> },
  ];

  const secondaryNav = [
    { id: 'verification', label: 'Verification Center', icon: <CheckSquare size={18} /> },
    { id: 'applications', label: 'Application Defaults', icon: <CheckCircle size={18} /> },
    { id: 'ai', label: 'AI Customization', icon: <Zap size={18} /> },
    { id: 'accessibility', label: 'Accessibility', icon: <Accessibility size={18} /> },
    { id: 'connected', label: 'Connected Accounts', icon: <Link2 size={18} /> },
    { id: 'billing', label: 'Billing & Plans', icon: <CreditCard size={18} /> },
    { id: 'data', label: 'Data & Privacy', icon: <FileDown size={18} /> },
    { id: 'language', label: 'Language & Region', icon: <Globe size={18} /> },
  ];

  const setActiveTab = (tab: Tab) => {
    router.push(`/settings/${tab}`);
  };

  // --- Sub-components for sharing and modals ---
  const [otpModal, setOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  
  // Custom states for theme sharing
  const [importCode, setImportCode] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // AI bio optimize tool helper
  const [optimizingBio, setOptimizingBio] = useState(false);

  const triggerAIOptimization = () => {
    setOptimizingBio(true);
    setTimeout(() => {
      handleProfileChange('bio', `Innovative Frontend Engineer | Specialized in building responsive Liquid Glass visual systems with React, TypeScript, and micro-animations. Active creator of AI-driven developer workflows.`);
      setOptimizingBio(false);
    }, 1500);
  };

  // OTP Demo Verification
  const verifyOTP = () => {
    if (otpCode === '123456') {
      handleFieldChange('verifiedPhone', true);
      setOtpModal(false);
      setOtpCode('');
      setOtpError('');
    } else {
      setOtpError('Invalid OTP code. Please enter 123456 for demonstration.');
    }
  };

  // Resume upload simulator
  const handleResumeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newRes = {
        id: `res-${Date.now()}`,
        name: file.name,
        uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        size: `${Math.round(file.size / 1024)} KB`,
        isDefault: false
      };
      handleFieldChange('resumes', [...settings.resumes, newRes]);
    }
  };

  const handleExport = () => {
    const config = JSON.stringify({
      darkMode: preferences.darkMode,
      primaryColor: preferences.primaryColor,
      accentColor: preferences.accentColor,
      backgroundImage: preferences.backgroundImage,
      layoutMode: preferences.layoutMode,
      blurIntensity: preferences.blurIntensity,
      fontPreference: preferences.fontPreference,
      animationEnabled: preferences.animationEnabled
    });
    const base64 = btoa(config);
    navigator.clipboard.writeText(base64);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  const handleImport = () => {
    try {
      const decoded = atob(importCode.trim());
      const parsed = JSON.parse(decoded);
      updatePreferences({
        ...parsed,
        selectedTheme: 'custom-imported'
      });
      setImportSuccess(true);
      setImportCode('');
      setTimeout(() => setImportSuccess(false), 3000);
      setUploadError('');
    } catch (e) {
      setUploadError('Invalid theme configuration code.');
    }
  };

  // Canvas wallpaper upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1280;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.70);
          updatePreferences({
            backgroundImage: compressedBase64,
            selectedTheme: 'custom-wallpaper'
          });
          setUploadError('');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Deletion modal trigger
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Tab switch render
  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="settings-module">
            <div className="module-header">
              <h2 className="module-title">Account Settings</h2>
              <p className="module-subtitle">Manage your primary account details and verification state.</p>
            </div>
            
            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Identity & Login</h3>
              <SettingRow label="Email Address" desc="Used for primary account updates">
                <input 
                  type="email" 
                  className="setting-input" 
                  value={settings.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)} 
                />
              </SettingRow>

              <SettingRow label="Phone Number" desc="OTP and security alerts">
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="tel" 
                    className="setting-input" 
                    value={settings.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    style={{ width: '180px' }} 
                  />
                  {!settings.verifiedPhone ? (
                    <GlassButton variant="secondary" onClick={() => setOtpModal(true)}>Verify OTP</GlassButton>
                  ) : (
                    <span className="badge verified" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Verified</span>
                  )}
                </div>
              </SettingRow>

              <SettingRow label="Username (VIJ ID)" desc="Your unique global routing username">
                <input 
                  type="text" 
                  className="setting-input" 
                  value={settings.username}
                  onChange={(e) => handleFieldChange('username', e.target.value)}
                />
              </SettingRow>
            </GlassCard>

            {otpModal && (
              <div className="otp-modal-backdrop">
                <GlassCard className="otp-modal-card">
                  <h3 className="otp-title">Security Code Required</h3>
                  <p className="otp-desc">We have sent a demonstration OTP verification code to <strong>{settings.phone}</strong>. Enter <strong>123456</strong> to complete.</p>
                  <input 
                    type="text" 
                    placeholder="Enter 6-digit OTP" 
                    maxLength={6} 
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="otp-input"
                  />
                  {otpError && <div className="otp-error">{otpError}</div>}
                  <div className="otp-actions">
                    <GlassButton variant="secondary" onClick={() => setOtpModal(false)}>Cancel</GlassButton>
                    <GlassButton variant="primary" onClick={verifyOTP}>Confirm</GlassButton>
                  </div>
                </GlassCard>
              </div>
            )}
          </motion.div>
        );

      case 'profile':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="settings-module">
            <div className="module-header">
              <h2 className="module-title">Profile Identity</h2>
              <p className="module-subtitle">Personalize your professional presence across the VIJ platform.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <GlassCard className="settings-card">
                  <h3 className="settings-card-title">Professional Bio</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="profile-photo-uploader">
                      <div className="avatar-placeholder">
                        {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'VU'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--vij-text-main)' }}>Profile Photograph</div>
                        <p style={{ fontSize: '12px', color: 'var(--vij-text-muted)', margin: '4px 0 8px 0' }}>JPG, PNG or WebP. Max size 2MB.</p>
                        <GlassButton variant="secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Upload Image</GlassButton>
                      </div>
                    </div>

                    <SettingRow label="Full Name">
                      <input 
                        type="text" 
                        className="setting-input" 
                        value={user?.name || ''} 
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                      />
                    </SettingRow>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--vij-text-main)' }}>Professional Bio Summary</label>
                      <textarea 
                        rows={4}
                        className="setting-input" 
                        style={{ maxWidth: '100%', fontFamily: 'inherit', resize: 'none' }}
                        value={user?.bio || ''} 
                        onChange={(e) => handleProfileChange('bio', e.target.value)}
                        placeholder="Tell the network about your skills, values, and experience..."
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                        <GlassButton 
                          variant="primary" 
                          onClick={triggerAIOptimization} 
                          disabled={optimizingBio}
                          style={{ padding: '6px 14px', fontSize: '12px', background: 'linear-gradient(135deg, #a855f7, #6366f1)', border: 'none' }}
                        >
                          {optimizingBio ? 'Rewriting...' : '✨ Auto-Optimize with AI'}
                        </GlassButton>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="settings-card">
                  <h3 className="settings-card-title">Current Role & Firm</h3>
                  <SettingRow label="Company/Organization">
                    <input 
                      type="text" 
                      className="setting-input" 
                      value={user?.currentCompany || ''} 
                      onChange={(e) => handleProfileChange('currentCompany', e.target.value)}
                    />
                  </SettingRow>
                  <SettingRow label="Professional Role Title">
                    <input 
                      type="text" 
                      className="setting-input" 
                      value={user?.roleTitle || 'Senior Frontend Architect'} 
                      onChange={(e) => handleProfileChange('roleTitle', e.target.value)}
                    />
                  </SettingRow>
                  <SettingRow label="Industry Area">
                    <input 
                      type="text" 
                      className="setting-input" 
                      value={user?.industry || ''} 
                      onChange={(e) => handleProfileChange('industry', e.target.value)}
                    />
                  </SettingRow>
                </GlassCard>
              </div>

              {/* Live Preview Card */}
              <GlassCard className="settings-card live-preview-sidebar" style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h4 style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '1px', color: 'var(--vij-text-muted)', margin: 0 }}>Live Network Preview</h4>
                <div className="preview-avatar-wrap">
                  <div className="preview-avatar">
                    {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'VU'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', color: 'var(--vij-text-main)' }}>{user?.name || 'VIJ User'}</div>
                    <div style={{ fontSize: '12px', color: 'var(--accent-azure)', fontWeight: '600' }}>{user?.roleTitle || 'Senior Frontend Architect'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--vij-text-muted)' }}>{user?.currentCompany || 'Freelance / Open'}</div>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--vij-text-muted)', fontStyle: 'italic', borderTop: '1px solid var(--glass-border)', paddingTop: '12px', margin: 0 }}>
                  "{user?.bio || 'No professional bio added yet. Click Auto-Optimize to build one.'}"
                </p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                  <span className="badge verified" style={{ fontSize: '10px' }}>✓ VIJ Certified</span>
                  <span className="badge" style={{ fontSize: '10px', background: 'rgba(255,255,255,0.05)' }}>{user?.role === 'seeker' ? 'Seeking opportunities' : 'Hiring'}</span>
                </div>
              </GlassCard>
            </div>
          </motion.div>
        );

      case 'career':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="settings-module">
            <div className="module-header">
              <h2 className="module-title">Career Preferences</h2>
              <p className="module-subtitle">Directly shapes candidate recommendations, recruiter indexing, and match parameters.</p>
            </div>

            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Matching Engine Settings</h3>
              
              <div style={{ padding: '16px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--vij-text-main)' }}>Target Salary Expectation</span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-azure)' }}>
                    ₹{(settings.salaryMin / 100000).toFixed(1)}L - ₹{(settings.salaryMax / 100000).toFixed(1)}L
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <input 
                    type="range" 
                    min="500000" 
                    max="8000000" 
                    step="100000"
                    value={settings.salaryMin}
                    onChange={(e) => handleFieldChange('salaryMin', Number(e.target.value))}
                    className="theme-range-slider"
                  />
                  <input 
                    type="range" 
                    min="500000" 
                    max="8000000" 
                    step="100000"
                    value={settings.salaryMax}
                    onChange={(e) => handleFieldChange('salaryMax', Number(e.target.value))}
                    className="theme-range-slider"
                  />
                </div>
              </div>

              <SettingRow label="Workplace Model" desc="Remote, Hybrid, or On-site requirements">
                <select 
                  className="setting-input" 
                  value={settings.workType}
                  onChange={(e) => handleFieldChange('workType', e.target.value)}
                >
                  <option value="remote">Remote Only</option>
                  <option value="hybrid">Hybrid preferred</option>
                  <option value="onsite">On-site workspace</option>
                </select>
              </SettingRow>

              <SettingRow label="Job Class Category" desc="Permanent role, Internship, or Contract">
                <select 
                  className="setting-input" 
                  value={settings.jobType}
                  onChange={(e) => handleFieldChange('jobType', e.target.value)}
                >
                  <option value="full-time">Full-time Regular</option>
                  <option value="part-time">Part-time Schedule</option>
                  <option value="contract">Freelance Contract</option>
                  <option value="internship">Educational Internship</option>
                </select>
              </SettingRow>

              <SettingRow label="Availability Status" desc="Tell recruiters when you can start">
                <select 
                  className="setting-input" 
                  value={settings.availability}
                  onChange={(e) => handleFieldChange('availability', e.target.value)}
                >
                  <option value="immediate">Immediate availability (Actively applying)</option>
                  <option value="1-month">1 Month Notice Period</option>
                  <option value="not-looking">Passive search (Happy where I am)</option>
                </select>
              </SettingRow>
            </GlassCard>
          </motion.div>
        );

      case 'resume':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="settings-module">
            <div className="module-header">
              <h2 className="module-title">Resume & Portfolio</h2>
              <p className="module-subtitle">Manage resume versions, link profiles, and analyze applicant tracking system compatibility.</p>
            </div>

            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Resume Files</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                {settings.resumes.map((res: any) => (
                  <div key={res.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <FileText size={24} color="var(--accent-azure)" />
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--vij-text-main)' }}>{res.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--vij-text-muted)' }}>Uploaded on {res.uploadedAt} • {res.size}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {res.isDefault ? (
                        <span className="badge verified" style={{ fontSize: '11px' }}>Primary Selection</span>
                      ) : (
                        <button 
                          className="accent-preset-btn" 
                          onClick={() => {
                            const updated = settings.resumes.map((r: any) => ({ ...r, isDefault: r.id === res.id }));
                            handleFieldChange('resumes', updated);
                          }}
                          style={{ padding: '4px 10px', fontSize: '11px' }}
                        >
                          Make Default
                        </button>
                      )}
                      <button 
                        onClick={() => {
                          const filtered = settings.resumes.filter((r: any) => r.id !== res.id);
                          handleFieldChange('resumes', filtered);
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="wallpaper-upload-box" style={{ padding: '20px', border: '2px dashed var(--glass-border)' }}>
                  <Upload size={20} color="var(--vij-text-muted)" />
                  <div style={{ fontSize: '13px', fontWeight: '700', marginTop: '6px', color: 'var(--vij-text-main)' }}>Click to upload new PDF resume</div>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeFile} style={{ position: 'absolute', opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="settings-card">
              <h3 className="settings-card-title">ATS Resume Parser Score</h3>
              <p className="settings-card-desc">Simulated scan mapping skills matching score.</p>
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', fontWeight: '700' }}>Keyword Match Index</span>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#10b981' }}>78/100 (Optimal)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '78%', height: '100%', background: '#10b981' }} />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Portfolio Links</h3>
              <SettingRow label="Portfolio Site">
                <input 
                  type="text" 
                  className="setting-input" 
                  value={settings.portfolioUrl} 
                  onChange={(e) => handleFieldChange('portfolioUrl', e.target.value)} 
                />
              </SettingRow>
              <SettingRow label="GitHub URL">
                <input 
                  type="text" 
                  className="setting-input" 
                  value={settings.githubUrl} 
                  onChange={(e) => handleFieldChange('githubUrl', e.target.value)} 
                />
              </SettingRow>
              <SettingRow label="LinkedIn ID">
                <input 
                  type="text" 
                  className="setting-input" 
                  value={settings.linkedinUrl} 
                  onChange={(e) => handleFieldChange('linkedinUrl', e.target.value)} 
                />
              </SettingRow>
            </GlassCard>
          </motion.div>
        );

      case 'privacy':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="settings-module">
            <div className="module-header">
              <h2 className="module-title">Privacy & Visibility</h2>
              <p className="module-subtitle">Control who discovers your details and profiles.</p>
            </div>

            <GlassCard className="settings-card">
              <SettingRow label="Public Network Profile" desc="Allow index searches and guest profile visits">
                <ToggleSwitch 
                  active={settings.publicProfile} 
                  onChange={() => handleFieldChange('publicProfile', !settings.publicProfile)} 
                />
              </SettingRow>
              <SettingRow label="Recruiter Search Match" desc="Appear in active recruiter databases">
                <ToggleSwitch 
                  active={settings.recruiterVisibility} 
                  onChange={() => handleFieldChange('recruiterVisibility', !settings.recruiterVisibility)} 
                />
              </SettingRow>
              <SettingRow label="Conceal Active Company" desc="Mask current company name on applicant feeds">
                <ToggleSwitch 
                  active={settings.hideCurrentCompany} 
                  onChange={() => handleFieldChange('hideCurrentCompany', !settings.hideCurrentCompany)} 
                />
              </SettingRow>
              <SettingRow label="Anonymous Applications" desc="Conceal contact identity until interviews schedule">
                <ToggleSwitch 
                  active={settings.anonymousApplications} 
                  onChange={() => handleFieldChange('anonymousApplications', !settings.anonymousApplications)} 
                />
              </SettingRow>
            </GlassCard>
          </motion.div>
        );

      case 'notifications':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="settings-module">
            <div className="module-header">
              <h2 className="module-title">Notification Settings</h2>
              <p className="module-subtitle">Tune alert channels across Email, SMS, and Push notifications.</p>
            </div>

            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Email Communications</h3>
              <SettingRow label="Job Alerts" desc="Notifications about matches matching preferences">
                <ToggleSwitch 
                  active={settings.emailJobAlerts} 
                  onChange={() => handleFieldChange('emailJobAlerts', !settings.emailJobAlerts)} 
                />
              </SettingRow>
              <SettingRow label="Recruiter Messages" desc="Direct inquiries and chat highlights">
                <ToggleSwitch 
                  active={settings.emailRecruiterMsgs} 
                  onChange={() => handleFieldChange('emailRecruiterMsgs', !settings.emailRecruiterMsgs)} 
                />
              </SettingRow>
              <SettingRow label="Application Progress" desc="Status updates when resumes pass stage pipelines">
                <ToggleSwitch 
                  active={settings.emailAppUpdates} 
                  onChange={() => handleFieldChange('emailAppUpdates', !settings.emailAppUpdates)} 
                />
              </SettingRow>
            </GlassCard>

            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Mobile SMS Alerts</h3>
              <SettingRow label="Security Alerts" desc="OTP triggers, lockouts and new logins alert">
                <ToggleSwitch 
                  active={settings.smsSecurityAlerts} 
                  onChange={() => handleFieldChange('smsSecurityAlerts', !settings.smsSecurityAlerts)} 
                />
              </SettingRow>
              <SettingRow label="Job Matches" desc="Urgent matching role alerts">
                <ToggleSwitch 
                  active={settings.smsJobAlerts} 
                  onChange={() => handleFieldChange('smsJobAlerts', !settings.smsJobAlerts)} 
                />
              </SettingRow>
            </GlassCard>
          </motion.div>
        );

      case 'appearance':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="settings-module appearance-module">
            <div className="module-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div>
                  <h2 className="module-title">Appearance & Themes</h2>
                  <p className="module-subtitle">Personalize your Virtual Intelligent Junction operating workspace.</p>
                </div>
                <GlassButton variant="secondary" onClick={resetPreferences} style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RotateCcw size={14} /> Reset Defaults
                </GlassButton>
              </div>
            </div>

            {/* Smart recommendation */}
            <GlassCard className="settings-card ai-recommendation-banner" style={{ border: '1px dashed rgba(168, 85, 247, 0.4)', background: 'rgba(168, 85, 247, 0.03)' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div className="ai-rec-spark"><Sparkles size={24} color="#a855f7" /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: 'var(--vij-text-main)', fontSize: '15px' }}>Smart Theme Recommendation</div>
                  <p style={{ fontSize: '13px', color: 'var(--vij-text-muted)', margin: '4px 0 12px 0', lineHeight: '1.5' }}>
                    Based on your workspace domain in <strong>{user?.domain || 'engineering'}</strong>, we suggest <strong>Midnight AI</strong> for optimal visual clarity.
                  </p>
                  <GlassButton 
                    variant="primary" 
                    onClick={() => applyPresetTheme('midnight-ai')}
                    style={{ padding: '6px 14px', fontSize: '12px', background: 'linear-gradient(135deg, #a855f7, #6366f1)', border: 'none' }}
                  >
                    Apply Preset
                  </GlassButton>
                </div>
              </div>
            </GlassCard>

            {/* Presets grid */}
            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Curated Gallery</h3>
              <div className="theme-grid">
                {THEME_PRESETS.map((theme) => {
                  const isSelected = preferences.selectedTheme === theme.id;
                  return (
                    <div 
                      key={theme.id} 
                      className={`theme-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => applyPresetTheme(theme.id)}
                    >
                      <div className="theme-card-preview" style={{ background: theme.bgGradient }}>
                        <div className="preview-header">
                          <div className="preview-dot" style={{ background: theme.primaryColor }} />
                          <div className="preview-dot" style={{ background: theme.accentColor }} />
                        </div>
                        <div className="preview-body">
                          <div className="preview-card-item" style={{ background: theme.glassWhite, border: `1px solid ${theme.glassBorder}` }}>
                            <div className="preview-text" style={{ color: theme.textMain }}>Aa</div>
                            <div className="preview-line" style={{ background: theme.textMuted }} />
                          </div>
                        </div>
                      </div>
                      <div className="theme-card-info">
                        <div className="theme-card-name">{theme.name}</div>
                        <div className="theme-card-desc-text">{theme.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Accent Pickers */}
            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Color Palette & Contrast</h3>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '16px' }}>
                <div className="color-picker-wrapper">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--vij-text-main)', marginBottom: '8px', display: 'block' }}>Primary Brand Accent</label>
                  <input 
                    type="color" 
                    value={preferences.primaryColor} 
                    onChange={(e) => updatePreferences({ primaryColor: e.target.value, selectedTheme: 'custom-colors' })}
                    className="native-color-picker"
                  />
                </div>
                <div className="color-picker-wrapper">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--vij-text-main)', marginBottom: '8px', display: 'block' }}>Secondary Accent</label>
                  <input 
                    type="color" 
                    value={preferences.accentColor} 
                    onChange={(e) => updatePreferences({ accentColor: e.target.value, selectedTheme: 'custom-colors' })}
                    className="native-color-picker"
                  />
                </div>
                <div className="color-picker-wrapper">
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--vij-text-main)', marginBottom: '8px', display: 'block' }}>Interface Contrast</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <Sun size={14} color="var(--vij-text-muted)" />
                    <ToggleSwitch 
                      active={preferences.darkMode} 
                      onChange={() => updatePreferences({ darkMode: !preferences.darkMode })} 
                    />
                    <Moon size={14} color="var(--vij-text-muted)" />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Custom Wallpapers */}
            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Wallpaper Wallpaper</h3>
              <div className="wallpaper-presets-grid" style={{ marginTop: '16px' }}>
                <div 
                  className={`wallpaper-preset-card clear-btn ${!preferences.backgroundImage ? 'selected' : ''}`}
                  onClick={() => updatePreferences({ backgroundImage: '' })}
                >
                  Clear Wallpaper
                </div>
                {PRESET_WALLPAPERS.map((wall) => {
                  const isSel = preferences.backgroundImage === wall.url;
                  return (
                    <div 
                      key={wall.id} 
                      className={`wallpaper-preset-card ${isSel ? 'selected' : ''}`}
                      onClick={() => updatePreferences({ backgroundImage: wall.url })}
                    >
                      <img src={wall.url} alt={wall.name} className="wallpaper-preset-img" />
                      <span className="wallpaper-preset-name">{wall.name}</span>
                    </div>
                  );
                })}
              </div>

              <div className="wallpaper-upload-section">
                <div className="wallpaper-upload-box">
                  <Upload size={20} color="var(--vij-text-muted)" />
                  <div style={{ fontSize: '13px', fontWeight: '700', marginTop: '6px', color: 'var(--vij-text-main)' }}>Upload customized wallpaper image</div>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="wallpaper-upload-input" />
                </div>
                {uploadError && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>{uploadError}</div>}
              </div>

              {preferences.backgroundImage && (
                <div className="slider-group" style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--vij-text-main)' }}>Blur Filter Strength</label>
                    <span style={{ fontSize: '12px', color: 'var(--vij-text-muted)' }}>{preferences.blurIntensity}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="40" 
                    value={preferences.blurIntensity} 
                    onChange={(e) => updatePreferences({ blurIntensity: Number(e.target.value) })}
                    className="theme-range-slider"
                  />
                </div>
              )}
            </GlassCard>

            {/* Sharing panel */}
            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Theme Config Share</h3>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <GlassButton variant="secondary" onClick={handleExport}><Share2 size={14} /> Export Config Code</GlassButton>
                {shareSuccess && <span style={{ color: '#10b981', fontSize: '13px', display: 'flex', alignItems: 'center' }}>✓ Copied to clipboard</span>}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <input 
                  type="text" 
                  placeholder="Paste config setup code here..." 
                  className="setting-input" 
                  value={importCode}
                  onChange={(e) => setImportCode(e.target.value)}
                  style={{ flex: 1 }}
                />
                <GlassButton variant="primary" onClick={handleImport}>Import</GlassButton>
              </div>
              {importSuccess && <div style={{ color: '#10b981', fontSize: '12px', marginTop: '8px' }}>Theme imported and applied!</div>}
            </GlassCard>
          </motion.div>
        );

      case 'dashboard':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="settings-module">
            <div className="module-header">
              <h2 className="module-title">Dashboard Customization</h2>
              <p className="module-subtitle">Personalize your dashboard display blocks and statistics layouts.</p>
            </div>

            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Toggle Active Widgets</h3>
              <p className="settings-card-desc">Select which analysis blocks render on your main seeker/recruiter dashboards.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                <SettingRow label="Job Matching & Application Analytics" desc="Display job counts and trends statistics">
                  <ToggleSwitch 
                    active={settings.showJobAnalytics} 
                    onChange={() => handleFieldChange('showJobAnalytics', !settings.showJobAnalytics)} 
                  />
                </SettingRow>

                <SettingRow label="Profile Views Counter" desc="Counter showing views history line chart">
                  <ToggleSwitch 
                    active={settings.showProfileViews} 
                    onChange={() => handleFieldChange('showProfileViews', !settings.showProfileViews)} 
                  />
                </SettingRow>

                <SettingRow label="Application Activity Stream" desc="Summary list of recent submissions">
                  <ToggleSwitch 
                    active={settings.showApplications} 
                    onChange={() => handleFieldChange('showApplications', !settings.showApplications)} 
                  />
                </SettingRow>

                <SettingRow label="AI Personalized Career Tips" desc="Actionable suggestion points generated by vision parser">
                  <ToggleSwitch 
                    active={settings.showAISuggestions} 
                    onChange={() => handleFieldChange('showAISuggestions', !settings.showAISuggestions)} 
                  />
                </SettingRow>

                <SettingRow label="Industry Salary Trends" desc="Weekly compensation indexes graph">
                  <ToggleSwitch 
                    active={settings.showIndustryTrends} 
                    onChange={() => handleFieldChange('showIndustryTrends', !settings.showIndustryTrends)} 
                  />
                </SettingRow>
              </div>
            </GlassCard>
          </motion.div>
        );

      case 'security':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="settings-module">
            <div className="module-header">
              <h2 className="module-title">Security & Sessions</h2>
              <p className="module-subtitle">Update credentials, manage logged-in devices and check audits logs.</p>
            </div>

            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Change Password</h3>
              <SettingRow label="Current Password">
                <input type="password" placeholder="••••••••••••" className="setting-input" />
              </SettingRow>
              <SettingRow label="New Password">
                <input type="password" placeholder="••••••••••••" className="setting-input" />
              </SettingRow>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                <GlassButton variant="primary" onClick={() => {
                  setSaveStatus('saving');
                  setTimeout(() => setSaveStatus('saved'), 500);
                }}>Update Password</GlassButton>
              </div>
            </GlassCard>

            <GlassCard className="settings-card">
              <SettingRow label="Two-Factor Authentication (2FA)" desc="Requires OTP verification next to password login">
                <ToggleSwitch 
                  active={settings.twoFactorEnabled} 
                  onChange={() => handleFieldChange('twoFactorEnabled', !settings.twoFactorEnabled)} 
                />
              </SettingRow>
            </GlassCard>

            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Active Security Sessions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                {settings.sessions.map((sess: any) => (
                  <div key={sess.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <Laptop size={20} color="var(--accent-azure)" />
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '13px' }}>{sess.device}</div>
                        <div style={{ fontSize: '11px', color: 'var(--vij-text-muted)' }}>{sess.location} • IP: {sess.ip}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="badge verified" style={{ fontSize: '11px' }}>{sess.lastActive}</span>
                      {!sess.isCurrent && (
                        <button 
                          onClick={() => {
                            const filtered = settings.sessions.filter((s: any) => s.id !== sess.id);
                            handleFieldChange('sessions', filtered);
                          }}
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        );

      case 'verification':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="settings-module">
            <div className="module-header">
              <h2 className="module-title">Verification Center</h2>
              <p className="module-subtitle">Manage identity badges, skill assessments certifications, and verified credentials.</p>
            </div>

            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Account Verification Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                <SettingRow label="Email Authenticated" desc="Primary communication email checked">
                  <span className="badge verified">Verified</span>
                </SettingRow>
                <SettingRow label="Phone Verified" desc="Checked via secure OTP trigger">
                  {settings.verifiedPhone ? (
                    <span className="badge verified">Verified</span>
                  ) : (
                    <GlassButton variant="secondary" style={{ padding: '6px 12px' }} onClick={() => router.push('/settings/account')}>Verify Now</GlassButton>
                  )}
                </SettingRow>
                <SettingRow label="ID Proof Assessment" desc="Verified identity proof document (Government ID)">
                  <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>Not Verified</span>
                </SettingRow>
                <SettingRow label="LinkedIn Connected Badge" desc="Professional profile validation">
                  <GlassButton variant="secondary" style={{ padding: '6px 12px' }}>Verify LinkedIn</GlassButton>
                </SettingRow>
              </div>
            </GlassCard>
          </motion.div>
        );

      case 'applications':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="settings-module">
            <div className="module-header">
              <h2 className="module-title">Application Defaults</h2>
              <p className="module-subtitle">Set your preferences for rapid one-click application systems.</p>
            </div>

            <GlassCard className="settings-card">
              <SettingRow label="Rapid Autofill Applications" desc="Pre-populate candidate profiles on external job forms">
                <ToggleSwitch 
                  active={settings.autoFillEnabled} 
                  onChange={() => handleFieldChange('autoFillEnabled', !settings.autoFillEnabled)} 
                />
              </SettingRow>

              <SettingRow label="Primary Resume Selection">
                <select 
                  className="setting-input"
                  value={settings.defaultResumeId}
                  onChange={(e) => handleFieldChange('defaultResumeId', e.target.value)}
                >
                  {settings.resumes.map((r: any) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </SettingRow>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 0' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--vij-text-main)' }}>Default Cover Letter Note</label>
                <textarea 
                  rows={5} 
                  className="setting-input" 
                  value={settings.coverLetterTemplate}
                  onChange={(e) => handleFieldChange('coverLetterTemplate', e.target.value)}
                  style={{ maxWidth: '100%', resize: 'none', fontFamily: 'inherit' }}
                />
              </div>

              <SettingRow label="Preferred Interview Hours">
                <input 
                  type="text" 
                  className="setting-input" 
                  value={settings.interviewAvailability} 
                  onChange={(e) => handleFieldChange('interviewAvailability', e.target.value)}
                />
              </SettingRow>
            </GlassCard>
          </motion.div>
        );

      case 'ai':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="settings-module">
            <div className="module-header">
              <h2 className="module-title">AI Customization</h2>
              <p className="module-subtitle">Control the machine learning engines optimization settings.</p>
            </div>

            <GlassCard className="settings-card">
              <SettingRow label="Personalized AI Recommendations" desc="Tailor jobs matching feed to user profile analysis">
                <ToggleSwitch 
                  active={settings.aiJobRecs} 
                  onChange={() => handleFieldChange('aiJobRecs', !settings.aiJobRecs)} 
                />
              </SettingRow>

              <SettingRow label="Automated Roadmap Advisor" desc="Let AI build target skill milestone guides">
                <ToggleSwitch 
                  active={settings.aiRoadmaps} 
                  onChange={() => handleFieldChange('aiRoadmaps', !settings.aiRoadmaps)} 
                />
              </SettingRow>

              <SettingRow label="Optimize profile fields dynamically" desc="Let AI suggests bio corrections in real-time">
                <ToggleSwitch 
                  active={settings.aiProfileOptimization} 
                  onChange={() => handleFieldChange('aiProfileOptimization', !settings.aiProfileOptimization)} 
                />
              </SettingRow>
            </GlassCard>
          </motion.div>
        );

      case 'accessibility':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="settings-module">
            <div className="module-header">
              <h2 className="module-title">Accessibility Settings</h2>
              <p className="module-subtitle">Optimize interface settings to fit readability needs.</p>
            </div>

            <GlassCard className="settings-card">
              <SettingRow label="Font Scaling Size">
                <select 
                  className="setting-input" 
                  value={settings.textScale}
                  onChange={(e) => handleFieldChange('textScale', e.target.value)}
                >
                  <option value="standard">Standard Scaling (100%)</option>
                  <option value="large">Large Scaling (115%)</option>
                  <option value="extra-large">Extra Large Scaling (130%)</option>
                </select>
              </SettingRow>

              <SettingRow label="High Contrast Modes" desc="Enhance visual separation on layouts grids">
                <ToggleSwitch 
                  active={settings.highContrast} 
                  onChange={() => handleFieldChange('highContrast', !settings.highContrast)} 
                />
              </SettingRow>

              <SettingRow label="Disable Ambient Motion Eases" desc="Halts background animation blobs immediately">
                <ToggleSwitch 
                  active={!preferences.animationEnabled} 
                  onChange={() => updatePreferences({ animationEnabled: !preferences.animationEnabled })} 
                />
              </SettingRow>
            </GlassCard>
          </motion.div>
        );

      case 'connected':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="settings-module">
            <div className="module-header">
              <h2 className="module-title">Connected Accounts</h2>
              <p className="module-subtitle">Link third-party platforms to synchronize profile details and import codebases.</p>
            </div>

            <GlassCard className="settings-card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Mail size={20} color="var(--accent-azure)" />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '13px' }}>Google Identity</div>
                      <div style={{ fontSize: '11px', color: '#10b981' }}>Connected as user@gmail.com</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleFieldChange('googleConnected', !settings.googleConnected)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                  >
                    Disconnect
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Terminal size={20} color="var(--accent-azure)" />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '13px' }}>GitHub Integration</div>
                      <div style={{ fontSize: '11px', color: '#10b981' }}>Connected as github.com/vishwas</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleFieldChange('githubConnected', !settings.githubConnected)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                  >
                    Disconnect
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Link2 size={20} color="var(--vij-text-muted)" />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '13px' }}>LinkedIn Professional Profile</div>
                      <div style={{ fontSize: '11px', color: 'var(--vij-text-muted)' }}>Not Connected</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleFieldChange('linkedinConnected', !settings.linkedinConnected)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-azure)', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                  >
                    Connect
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        );

      case 'billing':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="settings-module">
            <div className="module-header">
              <h2 className="module-title">Billing & Plans</h2>
              <p className="module-subtitle">Manage subscription levels, card methods, and billing logs.</p>
            </div>

            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Choose Plan Level</h3>
              <div className="layout-modes-grid" style={{ marginTop: '16px' }}>
                {[
                  { id: 'free', name: 'Free Account', price: '₹0', desc: 'Core matching features, basic profile views summary and static roadmaps.' },
                  { id: 'pro', name: 'Pro Tier', price: '₹999/mo', desc: 'AI customized dashboard filters, ATS keyword mapping analysis, and network connect badges.' },
                  { id: 'enterprise', name: 'Recruiter Hub', price: '₹4,999/mo', desc: 'Unlimited candidate interview slots pipeline management and full skill assessments verification.' }
                ].map((tier) => (
                  <div 
                    key={tier.id} 
                    className={`layout-mode-card ${settings.subscriptionPlan === tier.id ? 'selected' : ''}`}
                    onClick={() => handleFieldChange('subscriptionPlan', tier.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: '800', color: 'var(--vij-text-main)' }}>{tier.name}</div>
                      <div style={{ fontWeight: '800', color: 'var(--accent-azure)' }}>{tier.price}</div>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--vij-text-muted)', marginTop: '8px', lineHeight: '1.4' }}>{tier.desc}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Card Credentials</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                {settings.paymentMethods.map((pm: any) => (
                  <div key={pm.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <CreditCard size={20} color="var(--accent-azure)" />
                      <div style={{ fontWeight: '700', fontSize: '13px' }}>{pm.brand} ending in {pm.last4}</div>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--vij-text-muted)' }}>Expiry {pm.exp}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Invoice logs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                {settings.invoices.map((inv: any) => (
                  <div key={inv.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '13px' }}>Monthly Pro Subscription Plan</div>
                      <div style={{ fontSize: '11px', color: 'var(--vij-text-muted)' }}>{inv.date} • ID: {inv.id}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: '800' }}>₹{inv.amount}</span>
                      <span className="badge verified" style={{ fontSize: '11px' }}>{inv.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        );

      case 'data':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="settings-module">
            <div className="module-header">
              <h2 className="module-title">Data & Privacy</h2>
              <p className="module-subtitle">Download your personal information and audit consent parameters.</p>
            </div>

            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Download Profile Data</h3>
              <p className="settings-card-desc">Download a complete structured JSON copy containing your profile parameters, resumes, application history, and preferences.</p>
              <div style={{ marginTop: '16px' }}>
                <GlassButton 
                  variant="secondary" 
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
                    const dlAnchorElem = document.createElement('a');
                    dlAnchorElem.setAttribute("href", dataStr);
                    dlAnchorElem.setAttribute("download", `vij_data_export_${user?.id || 'guest'}.json`);
                    dlAnchorElem.click();
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <FileDown size={16} /> Export Profile JSON
                </GlassButton>
              </div>
            </GlassCard>

            <GlassCard className="settings-card">
              <h3 className="settings-card-title">Consent Management</h3>
              <SettingRow label="Share Diagnostic Analytics" desc="Help our builders improve UI load timings">
                <ToggleSwitch 
                  active={settings.consentAnalytics} 
                  onChange={() => handleFieldChange('consentAnalytics', !settings.consentAnalytics)} 
                />
              </SettingRow>
              <SettingRow label="Personalized Marketing Alert Options" desc="Allow periodic mailings on career trends">
                <ToggleSwitch 
                  active={settings.consentMarketing} 
                  onChange={() => handleFieldChange('consentMarketing', !settings.consentMarketing)} 
                />
              </SettingRow>
            </GlassCard>
          </motion.div>
        );

      case 'language':
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="settings-module">
            <div className="module-header">
              <h2 className="module-title">Language & Region</h2>
              <p className="module-subtitle">Localize currencies timezone and interface display languages.</p>
            </div>

            <GlassCard className="settings-card">
              <SettingRow label="Interface Language">
                <select 
                  className="setting-input" 
                  value={settings.language}
                  onChange={(e) => handleFieldChange('language', e.target.value)}
                >
                  <option value="en">English (Default US)</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                </select>
              </SettingRow>

              <SettingRow label="Timezone">
                <select 
                  className="setting-input" 
                  value={settings.timezone}
                  onChange={(e) => handleFieldChange('timezone', e.target.value)}
                >
                  <option value="Asia/Kolkata">India Standard Time (IST - UTC+5:30)</option>
                  <option value="America/New_York">Eastern Standard Time (EST - UTC-5:00)</option>
                  <option value="Europe/London">Greenwich Mean Time (GMT - UTC+0:00)</option>
                  <option value="Asia/Tokyo">Japan Standard Time (JST - UTC+9:00)</option>
                </select>
              </SettingRow>

              <SettingRow label="Local Currency Conversion">
                <select 
                  className="setting-input" 
                  value={settings.currency}
                  onChange={(e) => handleFieldChange('currency', e.target.value)}
                >
                  <option value="INR">Indian Rupee (₹ INR)</option>
                  <option value="USD">US Dollar ($ USD)</option>
                  <option value="EUR">Euro (€ EUR)</option>
                  <option value="GBP">British Pound (£ GBP)</option>
                </select>
              </SettingRow>
            </GlassCard>
          </motion.div>
        );

      default:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="settings-module">
            <div className="module-header">
              <h2 className="module-title">Settings</h2>
              <p className="module-subtitle">This section is currently loading.</p>
            </div>
          </motion.div>
        );
    }
  };

  const handleDeleteConfirmed = () => {
    if (deleteConfirmText.toLowerCase() === 'delete my account') {
      logout();
      setDeleteModal(false);
      router.push('/');
    }
  };

  return (
    <PageTransition>
      <div className="settings-page-root">
        
        {/* Dynamic header save toast */}
        <div className="settings-header-banner">
          <div className="settings-branding-title">
            <SlidersHorizontal size={20} className="header-gear-icon" />
            <span>Digital Operating System Settings</span>
          </div>
          
          <div className="save-status-indicator">
            {saveStatus === 'saving' && (
              <span className="status-item saving">
                <RefreshCw size={14} className="animate-spin" /> Synchronizing changes...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="status-item saved">
                <CheckCircle size={14} /> ✓ Live changes synced
              </span>
            )}
          </div>
        </div>

        {/* Role Toggle for testing viewports */}
        <div className="settings-role-toggle">
          <div className="role-toggle-group">
            <button 
              className={`role-toggle-btn ${role === 'seeker' ? 'active' : ''}`}
              onClick={() => setRole('seeker')}
            >
              Job Seeker
            </button>
            <button 
              className={`role-toggle-btn ${role === 'recruiter' ? 'active' : ''}`}
              onClick={() => setRole('recruiter')}
            >
              Employer
            </button>
          </div>
        </div>

        <div className="settings-container">
          
          {/* SIDEBAR NAVIGATION */}
          <aside className="settings-sidebar">
            <div className="sidebar-section">
              <div className="sidebar-section-title">Operating Workspace</div>
              {baseNav.map(item => (
                <button 
                  key={item.id} 
                  className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id as Tab)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="sidebar-section">
              <div className="sidebar-section-title">System & Security</div>
              {secondaryNav.map(item => (
                <button 
                  key={item.id} 
                  className={`sidebar-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id as Tab)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="sidebar-section" style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <button 
                className="sidebar-nav-item" 
                onClick={() => setDeleteModal(true)}
                style={{ color: '#ef4444' }}
              >
                <span className="nav-icon"><Trash2 size={18} /></span>
                Delete Account
              </button>
              <button 
                className="sidebar-nav-item" 
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                style={{ color: '#ef4444' }}
              >
                <span className="nav-icon"><LogOut size={18} /></span>
                Log Out
              </button>
            </div>
          </aside>

          {/* MAIN PANEL */}
          <main className="settings-main">
            
            {/* Smart Summary widgets */}
            <GlassCard className="smart-summary-card">
              <div className="summary-content">
                {role === 'seeker' ? (
                  <>
                    <div className="summary-metric">
                      <span className="metric-label">Search Ranking Status</span>
                      <span className="metric-value">Top 15% <span className="metric-trend">↑ 2%</span></span>
                    </div>
                    <div className="summary-metric">
                      <span className="metric-label">Smart Matches Feed</span>
                      <span className="metric-value metric-highlight">9 active</span>
                    </div>
                    <div className="summary-metric">
                      <span className="metric-label">Recruiter Inquiries</span>
                      <span className="metric-value">22 views</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="summary-metric">
                      <span className="metric-label">Open Active Jobs</span>
                      <span className="metric-value">6 openings</span>
                    </div>
                    <div className="summary-metric">
                      <span className="metric-label">Candidates Indexed</span>
                      <span className="metric-value metric-highlight">248 candidates</span>
                    </div>
                    <div className="summary-metric">
                      <span className="metric-label">Scheduled Interviews</span>
                      <span className="metric-value">4 pending</span>
                    </div>
                  </>
                )}
              </div>
              <GlassButton variant="primary" style={{ padding: '8px 20px' }}>
                Full Diagnostics
              </GlassButton>
            </GlassCard>

            {/* Render selected active Tab panel */}
            <div style={{ minHeight: '500px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Deletion Warning Modal Overlay */}
            {deleteModal && (
              <div className="otp-modal-backdrop">
                <GlassCard className="otp-modal-card" style={{ border: '1px solid rgba(239, 68, 68, 0.4)', background: 'rgba(20, 10, 10, 0.95)' }}>
                  <h3 className="otp-title" style={{ color: '#ef4444' }}>Terminate Account Confirmation</h3>
                  <p className="otp-desc" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                    WARNING: Deleting your account will permanently wipe out all profiles, matching logs, resume parsing caches and premium dashboard statistics. 
                    Type <strong>delete my account</strong> to verify termination.
                  </p>
                  <input 
                    type="text" 
                    placeholder="Type confirmation phrase" 
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="otp-input"
                    style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}
                  />
                  <div className="otp-actions" style={{ marginTop: '20px' }}>
                    <GlassButton variant="secondary" onClick={() => setDeleteModal(false)}>Keep Account</GlassButton>
                    <GlassButton 
                      variant="danger" 
                      onClick={handleDeleteConfirmed}
                      disabled={deleteConfirmText.toLowerCase() !== 'delete my account'}
                    >
                      Delete Account
                    </GlassButton>
                  </div>
                </GlassCard>
              </div>
            )}

            {/* SYSTEM AI ASSIST PANEL */}
            <GlassCard className="settings-card ai-insight-panel" style={{ marginTop: '32px' }}>
              <h3 className="settings-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#a855f7" /> Professional Assistant Insights
              </h3>
              <div className="ai-insight-list">
                {role === 'seeker' ? (
                  <>
                    <div className="ai-insight-item">
                      <Zap size={16} className="ai-insight-icon" />
                      <div>Your match strictness parameters fit 12 matching positions. Recommending Sunsets Glow preset theme.</div>
                    </div>
                    <div className="ai-insight-item">
                      <Zap size={16} className="ai-insight-icon" />
                      <div>Connected GitHub account syncs 4 public repositories to your recruiter-matching profile.</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="ai-insight-item">
                      <Zap size={16} className="ai-insight-icon" />
                      <div>Employer profile is complete. Automated matching scripts are running for active openings.</div>
                    </div>
                  </>
                )}
              </div>
            </GlassCard>

          </main>
        </div>
      </div>
    </PageTransition>
  );
};

