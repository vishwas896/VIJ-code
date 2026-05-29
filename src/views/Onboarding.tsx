'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Upload, Sparkles,
  CheckCircle2, Loader2, Brain
} from 'lucide-react';
import { GlassButton } from '../components/common/GlassButton';
import { PageTransition } from '../components/common/PageTransition';
import { CompanyMatcher } from '../components/onboarding/CompanyMatcher';
import { useAuth } from '../context/AuthContext';
import './Onboarding.css';

export const Onboarding: React.FC = () => {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Form State
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const [isEmployed, setIsEmployed] = useState<string>('Yes');
  const [jobTitle, setJobTitle] = useState('');
  const [empType, setEmpType] = useState('Full-time');
  const [roleDesc, setRoleDesc] = useState('');
  const [isImprovingDesc, setIsImprovingDesc] = useState(false);

  const [skills, setSkills] = useState<string[]>(['React.js', 'TypeScript']);
  const [skillInput, setSkillInput] = useState('');
  const [education, setEducation] = useState({
    degree: 'B.Tech',
    specialization: 'Computer Science',
    college: '',
    year: '2024'
  });

  const totalSteps = 4; // Visual steps before processing

  // Handle Processing Simulation
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              completeOnboarding();
              router.push('/seeker/dashboard');
            }, 1000);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isProcessing, completeOnboarding, router]);

  const handleImproveDesc = () => {
    setIsImprovingDesc(true);
    setTimeout(() => {
      setRoleDesc("Architecting high-performance frontend systems using React and TypeScript. Lead developer for cross-functional teams, optimizing WebRTC communication protocols and achieving 30% reduction in latency.");
      setIsImprovingDesc(false);
    }, 1500);
  };

  const handleAddSkill = (s: string) => {
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput('');
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setIsProcessing(true);
    }
  };

  const handleVerifyOTP = () => {
    setIsVerifyingPhone(true);
    setTimeout(() => {
      setIsPhoneVerified(true);
      setIsVerifyingPhone(false);
      setTimeout(() => setStep(2), 800);
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="onboarding-page">
        
        {isProcessing ? (
          <motion.div 
            className="processing-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="processing-content">
              <div className="brain-animation">
                <Brain size={80} style={{ color: '#0ea5e9', filter: 'drop-shadow(0 0 10px rgba(14, 165, 233, 0.4))' }} />
                <motion.div 
                  className="processing-ring"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              <h2>Building Your Professional Identity</h2>
              <div className="processing-steps">
                <p className={progress > 20 ? 'done' : 'active'}>Analyzing profile components...</p>
                <p className={progress > 50 ? 'done' : (progress > 20 ? 'active' : '')}>Mapping skill clusters...</p>
                <p className={progress > 80 ? 'done' : (progress > 50 ? 'active' : '')}>Synchronizing match engine...</p>
              </div>

              <div className="processing-bar-wrap">
                <div className="processing-bar-fill" style={{ width: `${progress}%` }} />
                <span className="progress-pct">{progress}%</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="wizard-container">
            <div className="progress-section">
              <div className="progress-text">Step {step} of {totalSteps}</div>
              <div className="progress-track">
                <motion.div 
                  className="progress-fill" 
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            <div className="wizard-pane-container">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: PHONE VERIFICATION */}
                {step === 1 && (
                  <motion.div key="step1" className="wizard-pane" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="pane-header">
                      <div className="step-badge">Security Phase</div>
                      <h2>Verify your mobile number</h2>
                      <p>Establish trust with verified recruiters instantly.</p>
                    </div>

                    {!isVerifyingPhone && !isPhoneVerified ? (
                      <div className="phone-entry">
                        <div className="input-group">
                          <label>Mobile Number</label>
                          <div className="phone-input-wrap">
                            <span className="country-prefix">+91</span>
                            <input 
                              type="tel" 
                              placeholder="98765 43210"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="fluid-input"
                            />
                          </div>
                        </div>
                        <GlassButton onClick={handleVerifyOTP} disabled={phone.length < 10}>
                          Send Verification Code
                        </GlassButton>
                      </div>
                    ) : isVerifyingPhone ? (
                      <div className="otp-entry">
                        <label>Enter 4-digit OTP</label>
                        <div className="otp-grid">
                          {otp.map((digit, i) => (
                            <input 
                              key={i}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => {
                                const newOtp = [...otp];
                                newOtp[i] = e.target.value;
                                setOtp(newOtp);
                              }}
                              className="otp-box"
                            />
                          ))}
                        </div>
                        <p className="resend-text">Resend code in <span>00:24</span></p>
                      </div>
                    ) : (
                      <motion.div className="success-check" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <div className="check-circle">
                          <CheckCircle2 size={48} />
                        </div>
                        <h3>Number Verified</h3>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* STEP 2: EMPLOYMENT */}
                {step === 2 && (
                  <motion.div key="step2" className="wizard-pane" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="pane-header">
                      <div className="step-badge">Experience</div>
                      <h2>Current Employment</h2>
                      <p>Tell us about your latest professional chapter.</p>
                    </div>

                    <div className="employment-toggle">
                      {['Yes', 'No', 'Student', 'Freelancer'].map(opt => (
                        <button 
                          key={opt}
                          className={`toggle-option ${isEmployed === opt ? 'active' : ''}`}
                          onClick={() => setIsEmployed(opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {isEmployed === 'Yes' && (
                      <div className="employment-form">
                        <div className="input-group">
                          <label>Current Company</label>
                          <CompanyMatcher onSelect={() => {}} />
                        </div>
                        
                        <div className="input-row">
                          <div className="input-group">
                            <label>Job Title</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Senior Frontend Engineer"
                              value={jobTitle}
                              onChange={(e) => setJobTitle(e.target.value)}
                              className="fluid-input"
                            />
                          </div>
                          <div className="input-group">
                            <label>Type</label>
                            <select className="fluid-input" value={empType} onChange={(e) => setEmpType(e.target.value)}>
                              <option>Full-time</option>
                              <option>Part-time</option>
                              <option>Contract</option>
                              <option>Internship</option>
                            </select>
                          </div>
                        </div>

                        <div className="input-group">
                          <div className="label-with-action">
                            <label>Role Description</label>
                            <button className="ai-assist-btn" onClick={handleImproveDesc} disabled={isImprovingDesc}>
                              {isImprovingDesc ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                              <span>Improve with AI</span>
                            </button>
                          </div>
                          <textarea 
                            className="fluid-input profile-textarea"
                            placeholder="Describe your responsibilities..."
                            value={roleDesc}
                            onChange={(e) => setRoleDesc(e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STEP 3: SKILLS & EDUCATION */}
                {step === 3 && (
                  <motion.div key="step3" className="wizard-pane" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="pane-header">
                      <div className="step-badge">Competency</div>
                      <h2>Skills & Academic Record</h2>
                      <p>Showcase your expertise and educational background.</p>
                    </div>

                    <div className="skills-section">
                      <label>Core Skills</label>
                      <div className="skill-input-wrap">
                        <input 
                          type="text" 
                          placeholder="Search skills (e.g. Python, React)..."
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill(skillInput)}
                          className="fluid-input"
                        />
                      </div>
                      <div className="skill-tags">
                        {skills.map(s => (
                          <span key={s} className="skill-tag">
                            {s} <X size={12} onClick={() => setSkills(skills.filter(x => x !== s))} />
                          </span>
                        ))}
                      </div>
                      <div className="suggested-skills">
                        <span>Suggested:</span>
                        {['Node.js', 'Figma', 'AWS', 'Tailwind'].map(s => (
                          <button key={s} onClick={() => handleAddSkill(s)}>+ {s}</button>
                        ))}
                      </div>
                    </div>

                    <div className="education-form">
                      <div className="input-row">
                        <div className="input-group">
                          <label>Degree</label>
                          <select className="fluid-input" value={education.degree} onChange={(e) => setEducation({...education, degree: e.target.value})}>
                            <option>B.Tech</option>
                            <option>BCA</option>
                            <option>MBA</option>
                            <option>Diploma</option>
                          </select>
                        </div>
                        <div className="input-group">
                          <label>Graduation Year</label>
                          <input type="number" className="fluid-input" value={education.year} onChange={(e) => setEducation({...education, year: e.target.value})} />
                        </div>
                      </div>
                      <div className="input-group">
                        <label>College/University</label>
                        <input 
                          type="text" 
                          className="fluid-input" 
                          placeholder="Search university..."
                          value={education.college}
                          onChange={(e) => setEducation({...education, college: e.target.value})}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: CERTIFICATIONS */}
                {step === 4 && (
                  <motion.div key="step4" className="wizard-pane" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="pane-header">
                      <div className="step-badge">Validation</div>
                      <h2>Certifications</h2>
                      <p>Upload certificates or add them manually for validation.</p>
                    </div>

                    <div className="upload-container">
                      <div className="upload-box">
                        <Upload size={32} />
                        <p>Drag & drop certificate (PDF/Image)</p>
                        <span>Max size: 5MB</span>
                        <input type="file" hidden id="cert-up" />
                        <label htmlFor="cert-up" className="upload-btn-label">Browse Files</label>
                      </div>
                    </div>

                    <div className="manual-certs">
                      <div className="input-group">
                        <label>Certificate Name</label>
                        <input type="text" className="fluid-input" placeholder="e.g. AWS Certified Solutions Architect" />
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            <div className="wizard-controls">
              {step > 1 && (
                <GlassButton variant="secondary" onClick={() => setStep(step - 1)}>
                  Back
                </GlassButton>
              )}
              <div className="ml-auto">
                <GlassButton onClick={handleNext}>
                  {step === totalSteps ? 'Finalize Profile' : 'Continue'}
                </GlassButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

