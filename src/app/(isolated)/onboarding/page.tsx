'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, ChevronRight, User, Briefcase, GraduationCap, Building2,
  Mail, Phone, Shield, MapPin, BookOpen, Code, Star, Target
} from 'lucide-react';
import { useAuth, type UserRole } from '../../../context/AuthContext';
import './Onboarding.css';

const STEPS = [
  { id: 1, label: 'Verification' },
  { id: 2, label: 'Select Role' },
  { id: 3, label: 'Professional Profile' }
];

export default function OnboardingWizard() {
  const router = useRouter();
  const { updateProfile, completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  
  // Phase 1: Verification
  const [emailOtp, setEmailOtp] = useState('');
  const [mobileOtp, setMobileOtp] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);

  // Phase 2: Role Selection
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Phase 3: Student Profile
  const [studentData, setStudentData] = useState({
    college: '', university: '', degree: '', cgpa: '',
    technicalSkills: '', softSkills: '', languages: '',
    desiredRole: '', desiredIndustry: '', desiredLocation: ''
  });

  // Phase 3: Job Seeker Profile
  const [seekerData, setSeekerData] = useState({
    currentCompany: '', yearsExperience: '', skills: '',
    expectedSalary: '', noticePeriod: '30', preferredLocation: '',
    remotePreference: 'hybrid'
  });

  // Phase 3: Recruiter Profile
  const [recruiterData, setRecruiterData] = useState({
    designation: '', department: '', company: '',
    workEmail: '', businessContact: ''
  });

  const nextStep = () => {
    if (currentStep === 3) {
      // Save role and professional profile
      if (selectedRole) {
        const profileData: Record<string, unknown> = { role: selectedRole, onboardingCompleted: true };
        
        if (selectedRole === 'student') {
          profileData.education = studentData.degree;
          profileData.skills = studentData.technicalSkills.split(',').map(s => s.trim()).filter(Boolean);
        } else if (selectedRole === 'job_seeker') {
          profileData.currentCompany = seekerData.currentCompany;
          profileData.experience = parseInt(seekerData.yearsExperience) || 0;
          profileData.skills = seekerData.skills.split(',').map(s => s.trim()).filter(Boolean);
        } else if (selectedRole === 'recruiter') {
          profileData.currentCompany = recruiterData.company;
          profileData.roleTitle = recruiterData.designation;
        }
        
        updateProfile(profileData);
        completeOnboarding();
      }

      if (selectedRole === 'recruiter') {
        router.push('/onboarding/company-setup');
      } else {
        router.push('/home');
      }
      return;
    }
    setDirection(1);
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep(prev => prev - 1);
  };

  const verifyEmail = () => {
    if (emailOtp.length >= 4) setEmailVerified(true);
  };
  const verifyMobile = () => {
    if (mobileOtp.length >= 4) setMobileVerified(true);
  };

  const canProceed = () => {
    if (currentStep === 1) return emailVerified && mobileVerified;
    if (currentStep === 2) return !!selectedRole;
    if (currentStep === 3) return true;
    return false;
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 50 : -50, opacity: 0 })
  };

  return (
    <div className="liquid-wizard-root">
      <div className="liquid-wizard-bg-blobs" />

      <div className="liquid-glass-container">
        
        <div className="wizard-header">
          <h1>Welcome to VIJ</h1>
          <p>Build your intelligent identity. This takes about 3 minutes.</p>
        </div>

        <div className="wizard-stepper">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className="wizard-step-indicator">
                <div className={`step-circle ${currentStep === step.id ? 'active' : currentStep > step.id ? 'completed' : ''}`}>
                  {currentStep > step.id ? <Check size={16} /> : step.id}
                </div>
                <span className="step-label-text">{step.label}</span>
              </div>
              {idx < STEPS.length - 1 && <div className="step-line" />}
            </React.Fragment>
          ))}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ minHeight: '380px' }}
          >
            {/* ═══ STEP 1: VERIFICATION ═══ */}
            {currentStep === 1 && (
              <div className="liquid-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="liquid-form-group full-width">
                  <label className="liquid-form-label"><Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />Email OTP Verification</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      className="liquid-input" 
                      value={emailOtp} 
                      onChange={e => setEmailOtp(e.target.value)} 
                      placeholder="Enter 6-digit OTP" 
                      maxLength={6}
                      disabled={emailVerified}
                      style={{ flex: 1 }}
                    />
                    {!emailVerified ? (
                      <button className="btn-liquid-secondary" onClick={verifyEmail} style={{ whiteSpace: 'nowrap' }}>Verify</button>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 700, fontSize: '13px' }}><Check size={16} /> Verified</span>
                    )}
                  </div>
                </div>

                <div className="liquid-form-group full-width" style={{ marginTop: '16px' }}>
                  <label className="liquid-form-label"><Phone size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />Mobile OTP Verification</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      className="liquid-input" 
                      value={mobileOtp} 
                      onChange={e => setMobileOtp(e.target.value)} 
                      placeholder="Enter 6-digit OTP" 
                      maxLength={6}
                      disabled={mobileVerified}
                      style={{ flex: 1 }}
                    />
                    {!mobileVerified ? (
                      <button className="btn-liquid-secondary" onClick={verifyMobile} style={{ whiteSpace: 'nowrap' }}>Verify</button>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 700, fontSize: '13px' }}><Check size={16} /> Verified</span>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(14, 165, 233, 0.06)', borderRadius: '12px', border: '1px solid rgba(14, 165, 233, 0.15)' }}>
                  <p style={{ fontSize: '13px', color: 'var(--vij-text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={16} color="var(--accent-azure)" /> For demo: enter any 4+ character code and click Verify.
                  </p>
                </div>
              </div>
            )}

            {/* ═══ STEP 2: ROLE SELECTION ═══ */}
            {currentStep === 2 && (
              <div>
                <p style={{ textAlign: 'center', fontSize: '15px', color: 'var(--vij-text-muted)', marginBottom: '24px' }}>
                  Choose your primary identity on VIJ. This determines your dashboard, KPIs, and feed.
                </p>
                <div className="role-cards-container">
                  <div className={`role-card ${selectedRole === 'student' ? 'selected' : ''}`} onClick={() => setSelectedRole('student')}>
                    <div className="role-card-icon"><GraduationCap size={28} /></div>
                    <h3>Student</h3>
                    <p>Learning, skill building, internships, and your first job.</p>
                  </div>
                  <div className={`role-card ${selectedRole === 'job_seeker' ? 'selected' : ''}`} onClick={() => setSelectedRole('job_seeker')}>
                    <div className="role-card-icon"><User size={28} /></div>
                    <h3>Job Seeker</h3>
                    <p>Career growth, employment, networking, and upskilling.</p>
                  </div>
                  <div className={`role-card ${selectedRole === 'recruiter' ? 'selected' : ''}`} onClick={() => setSelectedRole('recruiter')}>
                    <div className="role-card-icon"><Building2 size={28} /></div>
                    <h3>Recruiter</h3>
                    <p>Company hiring, talent acquisition, and team building.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ STEP 3: DYNAMIC PROFESSIONAL PROFILE ═══ */}
            {currentStep === 3 && selectedRole === 'student' && (
              <div className="liquid-form-grid">
                <div className="liquid-form-group full-width" style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <BookOpen size={18} color="var(--accent-azure)" />
                    <span style={{ fontWeight: 800, fontSize: '16px' }}>Student Professional Profile</span>
                  </div>
                </div>
                <div className="liquid-form-group">
                  <label className="liquid-form-label">College</label>
                  <input className="liquid-input" placeholder="IIT Delhi" value={studentData.college} onChange={e => setStudentData({...studentData, college: e.target.value})} />
                </div>
                <div className="liquid-form-group">
                  <label className="liquid-form-label">Degree & CGPA</label>
                  <input className="liquid-input" placeholder="B.Tech CSE — 8.5" value={studentData.degree} onChange={e => setStudentData({...studentData, degree: e.target.value})} />
                </div>
                <div className="liquid-form-group full-width">
                  <label className="liquid-form-label"><Code size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />Technical Skills (comma separated)</label>
                  <input className="liquid-input" placeholder="React, Python, SQL, Figma" value={studentData.technicalSkills} onChange={e => setStudentData({...studentData, technicalSkills: e.target.value})} />
                </div>
                <div className="liquid-form-group">
                  <label className="liquid-form-label"><Target size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />Desired Role</label>
                  <input className="liquid-input" placeholder="Frontend Developer" value={studentData.desiredRole} onChange={e => setStudentData({...studentData, desiredRole: e.target.value})} />
                </div>
                <div className="liquid-form-group">
                  <label className="liquid-form-label"><MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />Desired Location</label>
                  <input className="liquid-input" placeholder="Bangalore / Remote" value={studentData.desiredLocation} onChange={e => setStudentData({...studentData, desiredLocation: e.target.value})} />
                </div>
              </div>
            )}

            {currentStep === 3 && selectedRole === 'job_seeker' && (
              <div className="liquid-form-grid">
                <div className="liquid-form-group full-width" style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Briefcase size={18} color="var(--accent-azure)" />
                    <span style={{ fontWeight: 800, fontSize: '16px' }}>Job Seeker Professional Profile</span>
                  </div>
                </div>
                <div className="liquid-form-group">
                  <label className="liquid-form-label">Current Company</label>
                  <input className="liquid-input" placeholder="Google, TCS, Freelance…" value={seekerData.currentCompany} onChange={e => setSeekerData({...seekerData, currentCompany: e.target.value})} />
                </div>
                <div className="liquid-form-group">
                  <label className="liquid-form-label">Years of Experience</label>
                  <input className="liquid-input" placeholder="4" type="number" value={seekerData.yearsExperience} onChange={e => setSeekerData({...seekerData, yearsExperience: e.target.value})} />
                </div>
                <div className="liquid-form-group full-width">
                  <label className="liquid-form-label"><Code size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />Key Skills (comma separated)</label>
                  <input className="liquid-input" placeholder="React, TypeScript, Node, AWS" value={seekerData.skills} onChange={e => setSeekerData({...seekerData, skills: e.target.value})} />
                </div>
                <div className="liquid-form-group">
                  <label className="liquid-form-label">Expected Salary (LPA)</label>
                  <input className="liquid-input" placeholder="₹18L – ₹25L" value={seekerData.expectedSalary} onChange={e => setSeekerData({...seekerData, expectedSalary: e.target.value})} />
                </div>
                <div className="liquid-form-group">
                  <label className="liquid-form-label">Notice Period</label>
                  <select className="liquid-input" value={seekerData.noticePeriod} onChange={e => setSeekerData({...seekerData, noticePeriod: e.target.value})}>
                    <option value="0">Immediate</option>
                    <option value="15">15 Days</option>
                    <option value="30">30 Days</option>
                    <option value="60">60 Days</option>
                    <option value="90">90 Days</option>
                  </select>
                </div>
                <div className="liquid-form-group">
                  <label className="liquid-form-label"><MapPin size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />Preferred Location</label>
                  <input className="liquid-input" placeholder="Bangalore, Remote" value={seekerData.preferredLocation} onChange={e => setSeekerData({...seekerData, preferredLocation: e.target.value})} />
                </div>
                <div className="liquid-form-group">
                  <label className="liquid-form-label">Remote Preference</label>
                  <select className="liquid-input" value={seekerData.remotePreference} onChange={e => setSeekerData({...seekerData, remotePreference: e.target.value})}>
                    <option value="remote">Remote Only</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">On-site</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 3 && selectedRole === 'recruiter' && (
              <div className="liquid-form-grid">
                <div className="liquid-form-group full-width" style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Building2 size={18} color="var(--accent-azure)" />
                    <span style={{ fontWeight: 800, fontSize: '16px' }}>Recruiter Professional Profile</span>
                  </div>
                </div>
                <div className="liquid-form-group">
                  <label className="liquid-form-label">Designation</label>
                  <input className="liquid-input" placeholder="HR Manager, Talent Lead…" value={recruiterData.designation} onChange={e => setRecruiterData({...recruiterData, designation: e.target.value})} />
                </div>
                <div className="liquid-form-group">
                  <label className="liquid-form-label">Department</label>
                  <input className="liquid-input" placeholder="Human Resources" value={recruiterData.department} onChange={e => setRecruiterData({...recruiterData, department: e.target.value})} />
                </div>
                <div className="liquid-form-group full-width">
                  <label className="liquid-form-label">Current Company</label>
                  <input className="liquid-input" placeholder="Google, Infosys, Startup…" value={recruiterData.company} onChange={e => setRecruiterData({...recruiterData, company: e.target.value})} />
                </div>
                <div className="liquid-form-group">
                  <label className="liquid-form-label"><Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />Work Email</label>
                  <input className="liquid-input" placeholder="name@company.com" type="email" value={recruiterData.workEmail} onChange={e => setRecruiterData({...recruiterData, workEmail: e.target.value})} />
                </div>
                <div className="liquid-form-group">
                  <label className="liquid-form-label"><Phone size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />Business Contact</label>
                  <input className="liquid-input" placeholder="+91 98765 43210" type="tel" value={recruiterData.businessContact} onChange={e => setRecruiterData({...recruiterData, businessContact: e.target.value})} />
                </div>

                <div className="liquid-form-group full-width" style={{ marginTop: '12px' }}>
                  <div style={{ padding: '14px 16px', background: 'rgba(14, 165, 233, 0.06)', borderRadius: '12px', border: '1px solid rgba(14, 165, 233, 0.15)' }}>
                    <p style={{ fontSize: '13px', color: 'var(--vij-text-muted)', margin: 0 }}>
                      <Star size={14} color="#f59e0b" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                      After this step, you will set up your <strong>Company Profile</strong> with legal details, verification, and branch locations.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="wizard-actions">
          {currentStep > 1 ? (
            <button className="btn-liquid-secondary" onClick={prevStep}>Back</button>
          ) : <div />}
          <button 
            className="btn-liquid-primary" 
            onClick={nextStep}
            disabled={!canProceed()}
          >
            {currentStep === 3 
              ? (selectedRole === 'recruiter' ? 'Setup Company →' : 'Complete & Enter VIJ →') 
              : 'Continue'
            } 
            {currentStep < 3 && <ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} />}
          </button>
        </div>

      </div>
    </div>
  );
}
