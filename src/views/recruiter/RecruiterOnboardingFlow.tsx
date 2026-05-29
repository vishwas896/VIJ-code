'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PageTransition } from '../../components/common/PageTransition';
import { GlassCard } from '../../components/common/GlassCard';
import { GlassButton } from '../../components/common/GlassButton';
import {
  Mail, Building2, ShieldCheck, CheckCircle, AlertCircle,
  Globe, Users, MapPin, Briefcase, Sparkles, ArrowRight, X, Plus, Loader2
} from 'lucide-react';
import { validateBusinessEmail } from '../../services/emailValidator';
import { mockCompanies, saveCompany, type Company } from '../../data/recruiterData';
import { useAuth } from '../../context/AuthContext';
import './RecruiterOnboardingFlow.css';

export const RecruiterOnboardingFlow: React.FC = () => {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const [step, setStep] = useState(1);

  // Step 1 state
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [detectedCompany, setDetectedCompany] = useState('');

  // Step 2 state
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [headquarters, setHeadquarters] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [mission, setMission] = useState('');
  const [benefits, setBenefits] = useState<string[]>([]);
  const [benefitInput, setBenefitInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState('');
  const [smartFilling, setSmartFilling] = useState(false);

  const handleEmailVerify = () => {
    const result = validateBusinessEmail(email);
    if (!result.isValid) {
      setEmailError(result.errorMessage || 'Invalid email');
      setEmailVerified(false);
      return;
    }
    setEmailError('');
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setEmailVerified(true);
      setDetectedCompany(result.companyNameGuess);
      setCompanyName(result.companyNameGuess);
      setWebsite(`https://${result.domain}`);
    }, 1500);
  };

  const handleSmartFill = () => {
    setSmartFilling(true);
    const match = mockCompanies.find(c =>
      c.name.toLowerCase().includes(companyName.toLowerCase()) ||
      companyName.toLowerCase().includes(c.name.toLowerCase())
    );
    setTimeout(() => {
      if (match) {
        setIndustry(match.industry);
        setCompanySize(match.size);
        setHeadquarters(match.headquarters);
        setDescription(match.description);
        setMission(match.mission);
        setBenefits(match.benefits);
        setTechStack(match.techStack);
      } else {
        setIndustry('Technology');
        setCompanySize('50 - 200');
        setHeadquarters('San Francisco, CA');
        setDescription(`${companyName} is an innovative company building the future of technology.`);
        setMission(`Empowering teams to build better products.`);
        setBenefits(['Health Insurance', 'Remote Flexibility', 'Learning Budget']);
        setTechStack(['React', 'TypeScript', 'Node.js']);
      }
      setSmartFilling(false);
    }, 1800);
  };

  const addTag = (type: 'benefit' | 'tech') => {
    if (type === 'benefit' && benefitInput.trim()) {
      if (!benefits.includes(benefitInput.trim())) setBenefits(p => [...p, benefitInput.trim()]);
      setBenefitInput('');
    } else if (type === 'tech' && techInput.trim()) {
      if (!techStack.includes(techInput.trim())) setTechStack(p => [...p, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTag = (type: 'benefit' | 'tech', val: string) => {
    if (type === 'benefit') setBenefits(p => p.filter(b => b !== val));
    else setTechStack(p => p.filter(t => t !== val));
  };

  const companySlug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleLaunch = () => {
    const newCompany: Company = {
      slug: companySlug,
      name: companyName,
      industry: industry || 'Technology',
      size: companySize || '50 - 200',
      headquarters: headquarters || 'Remote',
      website: website,
      logo: companyName.charAt(0).toUpperCase(),
      description: description,
      mission: mission,
      culture: 'Innovation-driven and collaborative.',
      benefits: benefits,
      techStack: techStack,
      socialLinks: {},
      verificationStatus: 'verified',
      hiringStatus: 'actively-hiring',
      employeeCount: 150,
      foundedYear: 2020,
      responseRate: 90,
      avgHiringDays: 20,
    };
    saveCompany(newCompany);
    completeOnboarding();
    router.push('/recruiter/dashboard');
  };

  return (
    <PageTransition>
      <div className="ro-container">
        {/* Progress Bar */}
        <div className="ro-progress">
          {[1, 2, 3].map(s => (
            <div key={s} className={`ro-step-dot ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}>
              {step > s ? <CheckCircle size={16} /> : s}
            </div>
          ))}
          <div className="ro-progress-line">
            <div className="ro-progress-fill" style={{ width: `${((step - 1) / 2) * 100}%` }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ══════ STEP 1: EMAIL VERIFICATION ══════ */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}>
              <GlassCard className="ro-card">
                <div className="ro-card-icon"><Mail size={28} /></div>
                <h1 className="ro-title">Verify Your Identity</h1>
                <p className="ro-subtitle">Use your official company email to verify your recruiter status.</p>

                <div className="ro-form-group">
                  <label>Official Company Email</label>
                  <div className="ro-input-row">
                    <input
                      type="email"
                      className={`ro-input ${emailError ? 'error' : ''} ${emailVerified ? 'verified' : ''}`}
                      placeholder="name@company.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setEmailError(''); setEmailVerified(false); }}
                    />
                    {emailVerified && <CheckCircle size={20} className="ro-input-icon success" />}
                  </div>
                  {emailError && (
                    <motion.div className="ro-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                      <AlertCircle size={14} /> {emailError}
                    </motion.div>
                  )}
                  {emailVerified && (
                    <motion.div className="ro-success" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                      <ShieldCheck size={14} /> Domain verified — {detectedCompany} recognized.
                    </motion.div>
                  )}
                </div>

                <div className="ro-divider"><span>or sign up with</span></div>
                <div className="ro-social-row">
                  <button className="ro-social-btn"><Globe size={16} /> Google</button>
                  <button className="ro-social-btn"><Briefcase size={16} /> LinkedIn</button>
                </div>

                {!emailVerified ? (
                  <GlassButton variant="primary" className="ro-cta" onClick={handleEmailVerify} disabled={verifying || !email}>
                    {verifying ? <><Loader2 size={16} className="spin" /> Verifying Domain...</> : 'Verify Email Domain'}
                  </GlassButton>
                ) : (
                  <GlassButton variant="primary" className="ro-cta" onClick={() => setStep(2)}>
                    Continue to Company Setup <ArrowRight size={16} />
                  </GlassButton>
                )}
              </GlassCard>
            </motion.div>
          )}

          {/* ══════ STEP 2: COMPANY DETAILS ══════ */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}>
              <GlassCard className="ro-card">
                <div className="ro-card-icon"><Building2 size={28} /></div>
                <h1 className="ro-title">Company Profile</h1>
                <p className="ro-subtitle">Set up your company's presence on VIJ.</p>

                <button className="ro-smart-fill-btn" onClick={handleSmartFill} disabled={smartFilling}>
                  {smartFilling ? <><Loader2 size={14} className="spin" /> Scanning public data...</> : <><Sparkles size={14} /> Smart Fill from Web</>}
                </button>

                <div className="ro-form-grid">
                  <div className="ro-form-group"><label>Company Name</label><input className="ro-input" value={companyName} onChange={e => setCompanyName(e.target.value)} /></div>
                  <div className="ro-form-group"><label>Industry</label><input className="ro-input" placeholder="e.g. SaaS, Fintech" value={industry} onChange={e => setIndustry(e.target.value)} /></div>
                  <div className="ro-form-group"><label><Users size={14} /> Company Size</label>
                    <select className="ro-select" value={companySize} onChange={e => setCompanySize(e.target.value)}>
                      <option value="">Select size</option>
                      <option>1 - 50</option><option>50 - 200</option><option>200 - 1,000</option><option>1,000 - 5,000</option><option>5,000 - 10,000</option><option>10,000+</option>
                    </select>
                  </div>
                  <div className="ro-form-group"><label><MapPin size={14} /> Headquarters</label><input className="ro-input" placeholder="e.g. San Francisco, CA" value={headquarters} onChange={e => setHeadquarters(e.target.value)} /></div>
                  <div className="ro-form-group ro-full-span"><label><Globe size={14} /> Website</label><input className="ro-input" value={website} onChange={e => setWebsite(e.target.value)} /></div>
                  <div className="ro-form-group ro-full-span"><label>Description</label><textarea className="ro-textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} /></div>
                  <div className="ro-form-group ro-full-span"><label>Mission</label><textarea className="ro-textarea" rows={2} value={mission} onChange={e => setMission(e.target.value)} /></div>
                </div>

                <div className="ro-tags-section">
                  <label>Benefits</label>
                  <div className="ro-tags-wrap">{benefits.map(b => <span key={b} className="ro-tag">{b} <X size={12} onClick={() => removeTag('benefit', b)} /></span>)}</div>
                  <div className="ro-tag-input-row"><input className="ro-input ro-sm" placeholder="Add benefit..." value={benefitInput} onChange={e => setBenefitInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('benefit'))} /><button className="ro-add-btn" onClick={() => addTag('benefit')}><Plus size={14} /></button></div>
                </div>

                <div className="ro-tags-section">
                  <label>Tech Stack</label>
                  <div className="ro-tags-wrap">{techStack.map(t => <span key={t} className="ro-tag tech">{t} <X size={12} onClick={() => removeTag('tech', t)} /></span>)}</div>
                  <div className="ro-tag-input-row"><input className="ro-input ro-sm" placeholder="Add technology..." value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('tech'))} /><button className="ro-add-btn" onClick={() => addTag('tech')}><Plus size={14} /></button></div>
                </div>

                <div className="ro-btn-row">
                  <GlassButton variant="secondary" onClick={() => setStep(1)}>Back</GlassButton>
                  <GlassButton variant="primary" onClick={() => setStep(3)}>Preview & Launch <ArrowRight size={16} /></GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* ══════ STEP 3: REVIEW & LAUNCH ══════ */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35 }}>
              <GlassCard className="ro-card">
                <div className="ro-card-icon success"><ShieldCheck size={28} /></div>
                <h1 className="ro-title">Review & Launch</h1>
                <p className="ro-subtitle">Your company profile is ready. Review and launch your career page.</p>

                <div className="ro-preview-section">
                  <div className="ro-preview-header">
                    <div className="ro-preview-logo">{companyName.charAt(0)}</div>
                    <div>
                      <h2>{companyName}</h2>
                      <p>{industry} • {headquarters}</p>
                    </div>
                    <span className="ro-verified-badge"><ShieldCheck size={14} /> Verified</span>
                  </div>
                  <p className="ro-preview-desc">{description || 'No description provided.'}</p>
                  {benefits.length > 0 && (
                    <div className="ro-preview-tags">{benefits.map(b => <span key={b} className="ro-preview-tag">{b}</span>)}</div>
                  )}
                  {techStack.length > 0 && (
                    <div className="ro-preview-tags">{techStack.map(t => <span key={t} className="ro-preview-tag tech">{t}</span>)}</div>
                  )}
                </div>

                <div className="ro-url-preview">
                  <span>Your Career Page:</span>
                  <code>/company/{companySlug}/careers</code>
                </div>

                <div className="ro-btn-row">
                  <GlassButton variant="secondary" onClick={() => setStep(2)}>Back to Edit</GlassButton>
                  <GlassButton variant="primary" onClick={handleLaunch}>
                    <Sparkles size={16} /> Launch Company Profile
                  </GlassButton>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};
